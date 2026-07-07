import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import { Card, Badge, Alert, Spinner } from 'react-bootstrap';

const TRAINER_RULES = {
  bicep_curl: { name: "Bicep Curl", mainJoints: ['shoulder', 'elbow', 'wrist'], minAng: 35, maxAng: 155, advice: "Keep elbows tucked!" },
  squat: { name: "Squat", mainJoints: ['hip', 'knee', 'ankle'], minAng: 90, maxAng: 165, advice: "Lower your hips more!" },
  deadlift: { name: "Deadlift", mainJoints: ['shoulder', 'hip', 'knee'], minAng: 110, maxAng: 170, advice: "Keep your back straight!" },
  shoulder_press: { name: "Shoulder Press", mainJoints: ['elbow', 'shoulder', 'hip'], minAng: 55, maxAng: 165, advice: "Full lockout above head!" }
};

const PoseTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const lastSpeakTime = useRef(0);
  const animationFrameId = useRef(null); // Keep a record of the active loop to prevent double tracking loops

  const [currentEx, setCurrentEx] = useState('bicep_curl');
  const [feedback, setFeedback] = useState({ msg: "Step back to begin scan", type: "info" });
  const [repQuality, setRepQuality] = useState("");
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // --- BRAIN: VOICE COACHING ---
  const speak = (text) => {
    const now = Date.now();
    if (now - lastSpeakTime.current > 3000) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.1;
      window.speechSynthesis.speak(speech);
      lastSpeakTime.current = now;
    }
  };

  useEffect(() => {
    const startEngine = async () => {
      try {
        // FORCE STABLE WEBGL ROUTING BACKEND SYSTEM TO AVOID WEBGPU RUNTIME EXTRACTION CRASHES
        await tf.setBackend('webgl');
        await tf.ready();

        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { runtime: 'tfjs', modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
        );

        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: "user" } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // CRITICAL FIXED TRIGGER: Wait for the video to truly play and have data, not just metadata
          videoRef.current.onloadeddata = () => {
            setLoading(false);
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                animationFrameId.current = requestAnimationFrame(runDetection);
              }).catch(err => console.error("Webcam video autoplay was blocked:", err));
            }
          };
        }
      } catch (error) {
        console.error("AI Pose Engine could not be initialized:", error);
        setFeedback({ msg: "Camera pipeline access denied or hardware busy.", type: "danger" });
        setLoading(false);
      }
    };

    startEngine();

    return () => {
      window.speechSynthesis.cancel();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const runDetection = async () => {
    // CRITICAL FIX: Explicitly enforce readyState === 4 (HAVE_ENOUGH_DATA) before passing video stream reference to TFJS
    if (detectorRef.current && videoRef.current && videoRef.current.readyState === 4) {
      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        if (poses && poses.length > 0) {
          const kp = poses[0].keypoints;
          const confidence = poses[0].score;

          if (confidence < 0.3) {
            setIsReady(false);
            setFeedback({ msg: "BODY NOT DETECTED: Step further back!", type: "danger" });
          } else {
            setIsReady(true);
            processExercise(kp);
            drawVisuals(kp);
          }
        }
      } catch (err) {
        // Catch and isolate WebGL/WebGPU frame drops silently without breaking the script loop
        console.warn("Frame extraction skipped due to engine texture delay:", err.message);
      }
    }
    animationFrameId.current = requestAnimationFrame(runDetection);
  };

  const getAngle = (p1, p2, p3) => {
    const rad = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let ang = Math.abs((rad * 180.0) / Math.PI);
    return ang > 180 ? 360 - ang : ang;
  };

  const processExercise = (kp) => {
    const config = TRAINER_RULES[currentEx];
    const findJoint = (name) => kp.find(k => k.name.includes(name) && k.score > 0.45);

    const a = findJoint(config.mainJoints[0]);
    const b = findJoint(config.mainJoints[1]);
    const c = findJoint(config.mainJoints[2]);

    if (!a || !b || !c) {
      setFeedback({ msg: "Joints hidden! Adjust position.", type: "warning" });
      return;
    }

    const angle = getAngle(a, b, c);

    // FORM CHECKER
    if (angle < config.minAng) {
      setRepQuality("EXCELLENT");
      setFeedback({ msg: "Perfect Range of Motion!", type: "success" });
      speak("Great rep. Perfect form.");
    } else if (angle > config.maxAng) {
      setRepQuality("Ready...");
      setFeedback({ msg: "Start the movement", type: "info" });
    } else {
      // In-between check for bad form
      if (angle > config.minAng + 40 && angle < config.maxAng - 20) {
        setRepQuality("AVERAGE");
        setFeedback({ msg: config.advice, type: "warning" });
        speak(config.advice);
      }
    }
  };

  const drawVisuals = (kp) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";

    const paths = [
      ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'], ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'], ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
    ];

    paths.forEach(([p1n, p2n]) => {
      const p1 = kp.find(k => k.name === p1n);
      const p2 = kp.find(k => k.name === p2n);
      if (p1?.score > 0.4 && p2?.score > 0.4) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  };

  return (
    <Card className="bg-dark text-white border-0 shadow-lg rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '800px' }}>
      <div className="p-4 d-flex justify-content-between align-items-center bg-black border-bottom border-secondary">
        <div>
          <Badge bg={isReady ? "success" : "danger"} className="mb-2">
            {isReady ? "COACH WATCHING" : "SCANNING..."}
          </Badge>
          <h2 className="m-0 text-uppercase fw-black">{TRAINER_RULES[currentEx].name}</h2>
        </div>
        <div className="text-center p-3 border border-secondary rounded bg-dark" style={{ minWidth: '150px' }}>
          <small className="text-muted d-block font-monospace">REP QUALITY</small>
          <h4 className={repQuality === "EXCELLENT" ? "text-success" : "text-warning"}>{repQuality || "---"}</h4>
        </div>
      </div>

      <div className="position-relative bg-black" style={{ height: '480px' }}>
        {loading && (
          <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 10 }}>
            <Spinner animation="border" variant="info" />
          </div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className="w-100 h-100" style={{ objectFit: 'cover', transform: 'scaleX(-1)', opacity: 0.7 }} />
        <canvas ref={canvasRef} className="position-absolute top-0 start-0 w-100 h-100" style={{ transform: 'scaleX(-1)', pointerEvents: 'none' }} />
        
        <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ zIndex: 5 }}>
          <Alert variant={feedback.type} className="m-0 border-0 shadow-lg bg-opacity-75 backdrop-blur-sm p-4">
             <div className="d-flex align-items-center">
                <div className="spinner-grow spinner-grow-sm me-3 text-light"></div>
                <strong>{feedback.msg}</strong>
             </div>
          </Alert>
        </div>
      </div>

      <div className="p-3 bg-black d-flex gap-2 justify-content-center border-top border-secondary">
        {Object.keys(TRAINER_RULES).map(ex => (
          <button key={ex} className={`btn ${currentEx === ex ? 'btn-info' : 'btn-outline-light'} rounded-pill px-4 fw-bold`} 
                  onClick={() => { setCurrentEx(ex); setRepQuality(""); speak(`Switching to ${TRAINER_RULES[ex].name}`); }}>
            {TRAINER_RULES[ex].name}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PoseTracker;