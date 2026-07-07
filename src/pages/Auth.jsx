import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Person, Envelope, Lock, Speedometer2, Cpu, ShieldCheck, Activity } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',       
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const BACKEND_URL = 'https://ecofit-backend.vercel.app/api/auth'; 

        try {
            if (isLogin) {
                const response = await axios.post(`${BACKEND_URL}/login`, {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('eco_fit_token', response.data.token);
                    localStorage.setItem('eco_fit_userId', response.data.user.id);
                    localStorage.setItem('eco_fit_userName', response.data.user.name);
                    
                    if (response.data.isOnboarded === false) {
                        navigate('/onboarding');
                    } else {
                        navigate('/dashboard');
                    }
                }
            } else {
                const regResponse = await axios.post(`${BACKEND_URL}/register`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                if (regResponse.status === 201) {
                    const loginResponse = await axios.post(`${BACKEND_URL}/login`, {
                        email: formData.email,
                        password: formData.password
                    });

                    if (loginResponse.data && loginResponse.data.token) {
                        localStorage.setItem('eco_fit_token', loginResponse.data.token);
                        localStorage.setItem('eco_fit_userId', loginResponse.data.user.id);
                        localStorage.setItem('eco_fit_userName', loginResponse.data.user.name);

                        navigate('/onboarding');
                    }
                }
            }
        } catch (err) {
            console.error("Authentication Error:", err);
            setError(err.response?.data?.msg || err.response?.data?.error || 'Authentication failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="vh-100 p-0 overflow-hidden bg-space-void context-perspective">
            {/* Cinematic 8D Vector Elements & Spatial Anchors */}
            <div className="space-grid-warp"></div>
            <div className="radar-horizon"></div>
            <div className="solar-plasma-core"></div>
            <div className="floating-particle p1"></div>
            <div className="floating-particle p2"></div>
            <div className="floating-particle p3"></div>

            <Row className="h-100 g-0 position-relative z-index-top">
                {/* BRAND SCENOGRAPHY PANEL */}
                <Col lg={7} className="d-none d-lg-flex align-items-center justify-content-center position-relative stage-depth-8d">
                    
                    {/* Abstract Geometric HUD Ring Accents */}
                    <div className="hud-ring-spinner"></div>
                    <div className="hud-ring-spinner-reverse"></div>

                    <div className="text-white p-5 brand-monolith-field text-start">
                        <div className="system-node-badge mb-3">
                            <Cpu size={14} className="node-pulse-icon me-2" />
                            <span>SYS_STATUS: ACTIVE // CORE_V3.82</span>
                        </div>

                        <div className="kinetic-brand-wrapper">
                            <h1 className="display-1 fw-black text-uppercase m-0 layered-text-mesh root-layer">
                                Eco<span className="neon-orange-span">Fit</span>
                            </h1>
                            <h1 className="display-1 fw-black text-uppercase m-0 layered-text-mesh chromatic-left">
                                Eco<span className="neon-orange-span">Fit</span>
                            </h1>
                            <h1 className="display-1 fw-black text-uppercase m-0 layered-text-mesh chromatic-right">
                                Eco<span className="neon-orange-span">Fit</span>
                            </h1>
                        </div>
                        
                        <div className="h4 text-uppercase tracking-cyber orange-plasma-text mb-4 mt-2">
                            Advanced Geometric Vitality Engine
                        </div>
                        <p className="lead opacity-75 parametric-text">
                            Track your nutrition, master your movement, <br/> and climb the global leaderboard.
                        </p>
                    </div>

                    {/* Augmented Reality Telemetry Gauge Overlay */}
                    <div className="position-absolute bottom-0 start-0 p-5 telemetry-anchor-3d">
                        <div className="telemetry-box-frame mb-3">
                            <Activity size={18} className="text-orange me-2 telemetry-pulse" />
                            <span className="small tracking-cyber opacity-50">REALTIME MATRIX FEED</span>
                        </div>
                        <Speedometer2 size={320} className="gauge-mesh-vector" />
                    </div>
                </Col>

                {/* FORM LAYER PANEL */}
                <Col lg={5} className="d-flex align-items-center justify-content-center position-relative px-4 monolith-depth-field">
                    <Card className="bg-monolith-shroud border-0 text-white w-100 cyber-structural-card py-5 px-4" style={{ maxWidth: '470px' }}>
                        
                        {/* High-tech corner bracket ornaments */}
                        <div className="card-corner-bracket top-left"></div>
                        <div className="card-corner-bracket top-right"></div>
                        <div className="card-corner-bracket bottom-left"></div>
                        <div className="card-corner-bracket bottom-right"></div>

                        <Card.Body className="position-relative card-internal-3d">
                            <div className="interactive-form-flow">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h2 className="fw-black m-0 text-uppercase tracking-tighter title-gradient-shine">
                                        {isLogin ? 'Security Access' : 'Register Node'}
                                    </h2>
                                    <ShieldCheck size={24} className="text-orange secure-shield-anim" />
                                </div>
                                <p className="text-muted small mb-4 tracking-wide">{isLogin ? 'Provide encryption certificates to initial data stream synchronization.' : 'Allocate systemic memory sectors to instantiate user node parameters.'}</p>
                                
                                {error && (
                                    <Alert variant="danger" className="py-3 border-0 small rounded-4 bg-danger bg-opacity-10 text-danger alert-kinetic-shake mb-4">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="terminal-cursor-indicator">&gt;&gt;</span>
                                            <strong>CRITICAL_FAULT:</strong> {error}
                                        </div>
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit} className="mt-2">
                                    {!isLogin && (
                                        <Form.Group className="mb-3 element-depth-3d">
                                            <InputGroup className="bg-field-dark border-orange-neon rounded-4 overflow-hidden frame-transition">
                                                <InputGroup.Text className="bg-transparent border-0 dynamic-icon-orange"><Person/></InputGroup.Text>
                                                <Form.Control 
                                                    required
                                                    className="bg-transparent border-0 text-white py-3 monolith-input-element" 
                                                    placeholder="Full Name" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3 element-depth-3d">
                                        <InputGroup className="bg-field-dark border-orange-neon rounded-4 overflow-hidden frame-transition">
                                            <InputGroup.Text className="bg-transparent border-0 dynamic-icon-orange"><Envelope/></InputGroup.Text>
                                            <Form.Control 
                                                type="email" 
                                                required
                                                className="bg-transparent border-0 text-white py-3 monolith-input-element" 
                                                placeholder="Email Address" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4 element-depth-3d">
                                        <InputGroup className="bg-field-dark border-orange-neon rounded-4 overflow-hidden frame-transition">
                                            <InputGroup.Text className="bg-transparent border-0 dynamic-icon-orange"><Lock/></InputGroup.Text>
                                            <Form.Control 
                                                type="password" 
                                                required
                                                className="bg-transparent border-0 text-white py-3 monolith-input-element" 
                                                placeholder="Secure Password" 
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Button type="submit" className="w-100 py-3.5 rounded-4 fw-black text-uppercase tracking-wider mb-4 cyber-action-button" disabled={loading}>
                                        {loading ? (
                                            <div className="d-flex align-items-center justify-content-center gap-3">
                                                <Spinner size="sm" animation="border" variant="light" />
                                                <span className="tracking-cyber">SYNCING INTERFACE...</span>
                                            </div>
                                        ) : isLogin ? 'Initialize System Access' : 'Deploy Ledger Allocation'}
                                    </Button>

                                    <div className="text-center">
                                        <Button variant="link" className="text-decoration-none interface-switch-link small p-0 fw-black text-uppercase" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                                            {isLogin ? "// REQUEST REALLOCATION : REGISTER PROFILE" : "// INITIALIZE PORT LOGIC : USER SIGN IN"}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* HIGH-END 8D SCENIC MOTION MATRIX ENGINE */}
            <style>{`
                .fw-black { font-weight: 900 !important; }
                .tracking-cyber { letter-spacing: 3px !important; }
                .bg-space-void { background: #030304; }
                .text-orange { color: #ff6b00 !important; }
                .z-index-top { z-index: 5; }

                /* Cinematic 8D Perspective Canvas Frame */
                .context-perspective {
                    perspective: 2500px;
                    transform-style: preserve-3d;
                }

                /* Space Matrix Infinite Grid Floor */
                .space-grid-warp {
                    position: absolute;
                    width: 300%;
                    height: 300%;
                    top: -100%;
                    left: -100%;
                    background-image: 
                        linear-gradient(rgba(255, 107, 0, 0.03) 1.5px, transparent 1.5px), 
                        linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1.5px, transparent 1.5px);
                    background-size: 50px 50px;
                    transform: rotateX(75deg) translateZ(-150px);
                    animation: matrixFlight 24s infinite linear;
                    opacity: 0.9;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Deep Rotating Geometric Vector Radar Ring */
                .radar-horizon {
                    position: absolute;
                    width: 1200px;
                    height: 1200px;
                    border: 1px dashed rgba(255, 107, 0, 0.06);
                    border-radius: 50%;
                    top: -10%;
                    left: -20%;
                    animation: radarSpin 60s infinite linear;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Intense Dynamic Solar Plasma Singularity Backdrop */
                .solar-plasma-core {
                    position: absolute;
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(255, 107, 0, 0.09) 0%, rgba(240, 50, 0, 0.02) 45%, transparent 75%);
                    top: 15%;
                    left: -5%;
                    filter: blur(50px);
                    animation: thermalExpansion 14s ease-in-out infinite alternate;
                    pointer-events: none;
                    z-index: 1;
                }

                /* Floating 8D Spatial Particle Field */
                .floating-particle {
                    position: absolute;
                    border-radius: 50%;
                    background: #ff6b00;
                    filter: drop-shadow(0 0 10px #ff6b00);
                    pointer-events: none;
                    z-index: 2;
                }
                .p1 { width: 4px; height: 4px; top: 20%; left: 40%; animation: floatP 9s infinite ease-in-out; }
                .p2 { width: 3px; height: 3px; top: 70%; left: 15%; animation: floatP 14s infinite ease-in-out -3s; }
                .p3 { width: 5px; height: 5px; top: 45%; left: 80%; animation: floatP 11s infinite ease-in-out -6s; }

                /* High-Tech HUD Elements */
                .system-node-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(255, 107, 0, 0.06);
                    border: 1px solid rgba(255, 107, 0, 0.15);
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #ff6b00;
                }
                .node-pulse-icon {
                    animation: nodeBlink 1s infinite steps(2);
                }

                /* HUD Orbital Vector Rings Overlay */
                .hud-ring-spinner {
                    position: absolute;
                    width: 450px;
                    height: 450px;
                    border: 2px cubic-bezier(0.4, 0, 0.2, 1) dashed rgba(255,107,0,0.08);
                    border-radius: 50%;
                    animation: radarSpin 25s infinite linear;
                    pointer-events: none;
                }
                .hud-ring-spinner-reverse {
                    position: absolute;
                    width: 380px;
                    height: 380px;
                    border: 1px dotted rgba(255,255,255,0.05);
                    border-radius: 50%;
                    animation: radarSpin 15s infinite linear reverse;
                    pointer-events: none;
                }

                /* Chromatic Aberration 3D Title Mesh Layers */
                .stage-depth-8d {
                    transform: rotateY(15deg) translateZ(80px);
                    transform-style: preserve-3d;
                }
                .kinetic-brand-wrapper {
                    position: relative;
                    height: 120px;
                    transform-style: preserve-3d;
                }
                .layered-text-mesh {
                    font-size: 6rem !important;
                    letter-spacing: -4px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    line-height: 0.95;
                }
                .root-layer {
                    color: #ffffff;
                    z-index: 4;
                    text-shadow: 0 20px 45px rgba(0,0,0,0.9);
                }
                .chromatic-left {
                    color: rgba(255, 107, 0, 0.5);
                    z-index: 3;
                    transform: translate3d(5px, 3px, -15px);
                    animation: waveVibration 3s infinite linear alternate;
                }
                .chromatic-right {
                    color: rgba(255, 43, 0, 0.3);
                    z-index: 2;
                    transform: translate3d(-5px, -3px, -30px);
                    animation: waveVibration 3s infinite linear alternate-reverse;
                }
                .neon-orange-span {
                    color: #ff6b00;
                    filter: drop-shadow(0 0 35px rgba(255, 107, 0, 0.75));
                }
                .orange-plasma-text {
                    color: #ff6b00 !important;
                    text-shadow: 0 0 15px rgba(255, 107, 0, 0.5);
                    font-size: 0.85rem;
                }

                /* Telemetry AR Gauge Stack Frame */
                .telemetry-anchor-3d {
                    transform-style: preserve-3d;
                    transform: perspective(1000px) rotateX(25deg) rotateY(20deg) translateZ(100px);
                    animation: structuralFloat 8s ease-in-out infinite;
                }
                .telemetry-box-frame {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(0,0,0,0.5);
                    border-left: 3px solid #ff6b00;
                    padding: 4px 12px;
                }
                .telemetry-pulse { animation: nodeBlink 0.6s infinite ease-in-out alternate; }
                .gauge-mesh-vector {
                    color: #ff6b00;
                    opacity: 0.3;
                    filter: drop-shadow(0 0 40px rgba(255, 107, 0, 0.5));
                }

                /* 3D structural Monolith Card System Container */
                .monolith-depth-field {
                    transform-style: preserve-3d;
                }
                .bg-monolith-shroud {
                    background: rgba(12, 13, 16, 0.75) !important;
                    backdrop-filter: blur(30px);
                    -webkit-backdrop-filter: blur(30px);
                    border: 1px solid rgba(255, 107, 0, 0.12) !important;
                    box-shadow: 0 50px 120px rgba(0, 0, 0, 0.9),
                                inset 0 1px 1px rgba(255, 255, 255, 0.06),
                                0 0 70px rgba(255, 107, 0, 0.04);
                    border-radius: 36px;
                    transform: translateZ(60px) rotateY(-10deg);
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease;
                    transform-style: preserve-3d;
                }
                .bg-monolith-shroud:hover {
                    transform: translateZ(100px) rotateY(-3deg) rotateX(2deg);
                    box-shadow: 0 60px 140px rgba(0, 0, 0, 0.95),
                                inset 0 1px 1px rgba(255, 255, 255, 0.1),
                                0 0 90px rgba(255, 107, 0, 0.09);
                }
                .title-gradient-shine {
                    background: linear-gradient(180deg, #ffffff 0%, #909096 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .secure-shield-anim {
                    color: #ff6b00;
                    animation: floatP 4s infinite ease-in-out;
                }

                /* Structural Technical Corner Brackets */
                .card-corner-bracket {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    border: 2px solid #ff6b00;
                    pointer-events: none;
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }
                .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
                .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
                .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
                .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
                .bg-monolith-shroud:hover .card-corner-bracket {
                    opacity: 1;
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 5px #ff6b00);
                }

                /* Inset High-Contrast Form Controls */
                .bg-field-dark {
                    background: rgba(5, 5, 7, 0.9) !important;
                    border: 1px solid rgba(255, 107, 0, 0.1) !important;
                    box-shadow: inset 0 4px 8px rgba(0,0,0,0.85);
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .bg-field-dark:focus-within {
                    border-color: rgba(255, 107, 0, 0.6) !important;
                    box-shadow: inset 0 4px 8px rgba(0,0,0,0.85), 0 0 30px rgba(255, 107, 0, 0.15);
                    transform: translateZ(20px) scale(1.015);
                }
                .monolith-input-element {
                    box-shadow: none !important;
                    outline: none !important;
                }
                .monolith-input-element::placeholder {
                    color: rgba(255,255,255,0.2) !important;
                }
                .dynamic-icon-orange {
                    color: #ff6b00 !important;
                    opacity: 0.5;
                    transition: all 0.25s ease;
                }
                .bg-field-dark:focus-within .dynamic-icon-orange {
                    opacity: 1;
                    filter: drop-shadow(0 0 10px #ff6b00);
                    transform: scale(1.1);
                }

                /* Heavy Fluid Double-Layer Action Neon Button */
                .cyber-action-button {
                    background: linear-gradient(135deg, #ff6b00 0%, #cf4a00 100%) !important;
                    color: #000000 !important;
                    border: none !important;
                    box-shadow: 0 12px 35px rgba(255, 107, 0, 0.28), inset 0 1.5px 0 rgba(255,255,255,0.3);
                    font-weight: 900;
                    letter-spacing: 1.5px;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .cyber-action-button:hover:not(:disabled) {
                    transform: translateZ(30px) translateY(-3px);
                    box-shadow: 0 18px 45px rgba(255, 107, 0, 0.5);
                    filter: brightness(1.15);
                }
                .cyber-action-button:active:not(:disabled) {
                    transform: translateZ(15px) translateY(0);
                    box-shadow: 0 8px 25px rgba(255, 107, 0, 0.3);
                }

                /* Bottom Trigger Anchor Routing Navigation Links */
                .interface-switch-link {
                    color: rgba(255,255,255,0.35) !important;
                    font-size: 0.72rem;
                    letter-spacing: 1.5px;
                    transition: all 0.25s ease;
                }
                .interface-switch-link:hover {
                    color: #ff6b00 !important;
                    text-shadow: 0 0 20px rgba(255, 107, 0, 0.6);
                }

                /* Kinetic Custom Keyframes Vector Library */
                @keyframes matrixFlight {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 1200px; }
                }
                @keyframes radarSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes thermalExpansion {
                    0% { transform: translate(0, 0) scale(1); filter: blur(50px); }
                    50% { transform: translate(6%, -4%) scale(1.15); filter: blur(40px); }
                    100% { transform: translate(0, 0) scale(1); filter: blur(50px); }
                }
                @keyframes floatP {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
                    50% { transform: translateY(-25px) translateX(15px); opacity: 1; }
                }
                @keyframes structuralFloat {
                    0%, 100% { transform: perspective(1000px) rotateX(25deg) rotateY(20deg) translateZ(100px) translateY(0px); }
                    50% { transform: perspective(1000px) rotateX(25deg) rotateY(20deg) translateZ(100px) translateY(-18px); }
                }
                @keyframes waveVibration {
                    0% { transform: translate3d(4px, 2px, -15px); }
                    50% { transform: translate3d(-4px, -1px, -15px); }
                    100% { transform: translate3d(2px, -3px, -15px); }
                }
                @keyframes nodeBlink {
                    0% { opacity: 0.1; }
                    100% { opacity: 1; }
                }
                @keyframes alertKineticShake {
                    10%, 90% { transform: translate3d(-2px, 0, 0); }
                    20%, 80% { transform: translate3d(4px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
                    40%, 60% { transform: translate3d(5px, 0, 0); }
                }
            `}</style>
        </Container>
    );
};

export default Auth;