import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Spinner, Badge, Row, Col, Form } from 'react-bootstrap';
import { CameraFill, ImageFill, LightningChargeFill, ArrowClockwise, CloudUploadFill } from 'react-bootstrap-icons';
import apiClient from '../../api/client';

const FoodScanner = ({ onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('camera'); 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Explicit track reference to guarantee clean hardware kills

  // Core Theme Configuration Matching Main Dashboard
  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00', dock: '#161618' };

  const startCamera = async () => {
    try {
      // Always clear any loose running tracks first
      stopCameraInstance();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera hardware access denied:", err);
      setMode('upload');
    }
  };

  const stopCameraInstance = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Triggers hardware activation ONLY when tab mode equals camera
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCameraInstance();
    }

    // CRITICAL FIX: Stops webcam stream whenever user switches tabs or changes routes
    return () => {
      stopCameraInstance();
    };
  }, [mode]);

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || loading) return;
    setLoading(true);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      await executeScanRequest(formData);
    }, 'image/jpeg', 0.85);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    await executeScanRequest(formData);
  };

  const executeScanRequest = async (formData) => {
    try {
      // Endpoint uses global Axios client instances configured with your local authorization keys
      const res = await apiClient.post('/food/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data && res.data.suggestion) {
        setResult(res.data.suggestion);
      } else if (res.data && res.data.macros) {
        // Fallback layout protection if payload variations exist across route configurations
        setResult(res.data);
      }
      
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("AI Analysis Core Breakdown:", err);
      alert("AI Vision Core Pipeline encountered a processing timeout. Please check your image clarity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="border-0 shadow-lg overflow-hidden w-100 mx-auto" 
      style={{ 
        backgroundColor: theme.card, 
        borderRadius: '30px', 
        color: 'white',
        maxWidth: '480px',
        border: '1px solid #222'
      }}
    >
      {/* SCANNING FIELD DISPLAY VIEWPORT */}
      <div className="position-relative bg-black d-flex align-items-center justify-content-center" style={{ height: '340px', overflow: 'hidden' }}>
        {mode === 'camera' ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-100 h-100 object-fit-cover" />
            {/* Cyberpunk Target Acquisition Reticle Overlay */}
            <div 
              className="position-absolute top-50 start-50 translate-middle rounded-4" 
              style={{ 
                width: '220px', 
                height: '220px', 
                opacity: loading ? 0.8 : 0.4, 
                border: `3px dashed ${theme.orange}`,
                boxShadow: loading ? `0 0 25px ${theme.orange}` : '0 0 15px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease-in-out',
                animation: loading ? 'spinner-border 8s linear infinite' : 'none'
              }} 
            />
            <div className="position-absolute top-0 start-0 p-3">
               <Badge bg="danger" className="px-3 py-2 fw-black text-uppercase tracking-wider" style={{ fontSize: '10px', animation: 'pulse 1.5s infinite' }}>
                 ● LIVE VISION ENGINE
               </Badge>
            </div>
          </>
        ) : (
          <div className="h-100 w-100 d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ background: '#0f1012' }}>
            <div className="p-4 rounded-circle mb-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-10 btn-action">
              <CloudUploadFill size={40} style={{ color: theme.orange }} />
            </div>
            <h5 className="fw-bold mb-1">Upload Meal Image</h5>
            <p className="text-muted small mb-4 px-3">Select a photograph directly from your gallery to process macro breakdowns.</p>
            
            <Form.Group className="w-100 px-4">
              <Form.Control 
                type="file" 
                accept="image/*" 
                size="sm" 
                className="bg-dark text-white border-secondary border-opacity-25 p-2 rounded-3 custom-file-input" 
                onChange={handleFileUpload} 
                disabled={loading}
              />
            </Form.Group>
          </div>
        )}
        
        {/* Hidden Canvas Context Buffer */}
        <canvas ref={canvasRef} className="d-none" />

        {/* Global Action Viewport Loading Blur Overlay */}
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column gap-2 align-items-center justify-content-center bg-black bg-opacity-75" style={{ backdropFilter: 'blur(4px)', zIndex: 10 }}>
            <Spinner animation="border" style={{ color: theme.orange }} />
            <span className="fw-bold tracking-wider mt-2 text-uppercase" style={{ color: theme.orange, fontSize: '11px' }}>Analyzing Nutrition Profiles...</span>
          </div>
        )}
      </div>

      {/* METRIC CARD INSIGHT READOUTS */}
      <Card.Body className="p-4">
        {result && !loading && (
          <div className="mb-4 style-macro-reveal">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <small className="text-muted text-uppercase d-block fw-black" style={{ fontSize: '9px', letterSpacing: '1px' }}>AI Match Detected</small>
                <h4 className="fw-black text-white mb-0 text-capitalize">{result.foodName || 'Logged Meal'}</h4>
              </div>
              <Badge className="p-2 px-3 rounded-pill text-black fs-6 fw-black" style={{ background: theme.orange }}>
                {result.calories || 0} <span className="small fw-normal" style={{ fontSize: '11px' }}>kcal</span>
              </Badge>
            </div>
            
            <Row className="g-2">
              <Col xs={4}>
                <div className="p-2.5 rounded-3 text-center border border-secondary border-opacity-10" style={{ background: '#0e0f11' }}>
                  <span className="text-muted d-block font-bold mb-0.5" style={{ fontSize: '9px' }}>PROTEIN</span>
                  <strong className="text-warning fs-6 fw-black">{result.protein || 0}g</strong>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-2.5 rounded-3 text-center border border-secondary border-opacity-10" style={{ background: '#0e0f11' }}>
                  <span className="text-muted d-block font-bold mb-0.5" style={{ fontSize: '9px' }}>CARBS</span>
                  <strong className="text-info fs-6 fw-black">{result.carbs || 0}g</strong>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-2.5 rounded-3 text-center border border-secondary border-opacity-10" style={{ background: '#0e0f11' }}>
                  <span className="text-muted d-block font-bold mb-0.5" style={{ fontSize: '9px' }}>FATS</span>
                  <strong className="text-danger fs-6 fw-black">{result.fats || 0}g</strong>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* CONTROLS ENGINE GRID */}
        <div className="d-grid gap-2">
          {mode === 'camera' && (
            <Button 
              variant="warning" 
              size="lg" 
              className="py-2.5 rounded-pill fw-black text-black d-flex align-items-center justify-content-center gap-2 border-0 btn-action" 
              style={{ background: theme.orange }}
              onClick={handleCaptureAndScan} 
              disabled={loading}
            >
              <LightningChargeFill size={18} />
              GET DETAILED NUTRITION
            </Button>
          )}
          
          <Button 
            variant="dark" 
            className="text-muted text-decoration-none py-2 rounded-pill small border-0 fw-bold btn-action" 
            style={{ background: '#202124', fontSize: '12px' }}
            onClick={() => {
              setResult(null);
              setMode(mode === 'camera' ? 'upload' : 'camera');
            }}
            disabled={loading}
          >
            {mode === 'camera' ? 'Switch to Photo Upload Mode' : 'Return to Hardware Live Camera'}
          </Button>
        </div>
      </Card.Body>

      {/* Embedded Component Isolation Keyframes */}
      <style>{`
        .fw-black { font-weight: 900 !important; }
        .btn-action { transition: transform 0.2s, opacity 0.2s; }
        .btn-action:active { transform: scale(0.97); }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .style-macro-reveal {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default FoodScanner;