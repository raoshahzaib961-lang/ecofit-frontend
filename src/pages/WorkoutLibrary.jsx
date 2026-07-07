import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Badge } from 'react-bootstrap';
import { HouseFill, PlayCircleFill, GearWideConnected } from 'react-bootstrap-icons';
import { workoutData } from '../data/workouts';

const WorkoutLibrary = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [muscleFilter, setMuscleFilter] = useState('All');

    const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

    const currentWorkouts = workoutData[activeTab].filter(ex => 
        muscleFilter === 'All' || ex.muscle === muscleFilter
    );

    const theme = {
        orange: '#ff6b00',
        cardBg: '#1f2024',
        bodyBg: '#121214',
        border: 'rgba(255, 107, 0, 0.15)'
    };

    return (
        <div style={{ backgroundColor: theme.bodyBg, minHeight: '100vh', color: '#ffffff' }}>
            <style>{`
                @keyframes pulse8D {
                    0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 107, 0, 0.2); border-color: rgba(255,107,0,0.2); }
                    50% { transform: scale(1.02); box-shadow: 0 0 25px rgba(255, 107, 0, 0.5); border-color: #ff6b00; }
                    100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 107, 0, 0.2); border-color: rgba(255,107,0,0.2); }
                }
                .pulse-card-active:hover {
                    animation: pulse8D 1.8s infinite ease-in-out;
                    transition: 0.3s;
                }
                .custom-nav-pills .nav-link {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
            `}</style>

            <Container className="py-5">
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-5">
                    <h1 className="fw-black text-uppercase display-5 tracking-tight" style={{ letterSpacing: '-1px' }}>
                        Training <span style={{ color: theme.orange }}>Ground</span>
                    </h1>
                    <p className="text-muted font-monospace text-uppercase" style={{ fontSize: '12px' }}>
                        Select your structural environment and initialize data streams
                    </p>
                </div>

                {/* --- TOGGLE NAVIGATION --- */}
                <Nav variant="pills" className="justify-content-center mb-5 custom-nav-pills rounded-4 p-1 border" style={{ backgroundColor: '#161719', borderColor: '#2d2e33', maxWidth: '550px', margin: '0 auto' }}>
                    <Nav.Item className="w-50">
                        <Nav.Link 
                            active={activeTab === 'home'} 
                            onClick={() => { setActiveTab('home'); setMuscleFilter('All'); }}
                            className="rounded-4 py-3 fw-black font-monospace text-uppercase d-flex align-items-center justify-content-center gap-2 border-0 w-100"
                            style={{ 
                                backgroundColor: activeTab === 'home' ? theme.orange : 'transparent', 
                                color: activeTab === 'home' ? '#000000' : '#8a8b92',
                                fontSize: '12px'
                            }}
                        >
                            <HouseFill size={16} /> HOME ENGINE
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="w-50">
                        <Nav.Link 
                            active={activeTab === 'gym'} 
                            onClick={() => { setActiveTab('gym'); setMuscleFilter('All'); }}
                            className="rounded-4 py-3 fw-black font-monospace text-uppercase d-flex align-items-center justify-content-center gap-2 border-0 w-100"
                            style={{ 
                                backgroundColor: activeTab === 'gym' ? '#ffffff' : 'transparent', 
                                color: activeTab === 'gym' ? '#000000' : '#8a8b92',
                                fontSize: '12px'
                            }}
                        >
                            <GearWideConnected size={16} /> GYM MATRIX
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* --- MUSCLE FILTER PILLS --- */}
                <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                    {muscleGroups.map(muscle => (
                        <Badge 
                            key={muscle}
                            pill 
                            style={{ 
                                cursor: 'pointer', 
                                transition: '0.2s',
                                backgroundColor: muscleFilter === muscle ? theme.orange : '#1f2024',
                                color: muscleFilter === muscle ? '#000000' : '#a0a1a8',
                                border: muscleFilter === muscle ? `1px solid ${theme.orange}` : '1px solid #2d2e33',
                                fontSize: '11px'
                            }}
                            className="px-4 py-2 font-monospace text-uppercase fw-bold shadow-sm"
                            onClick={() => setMuscleFilter(muscle)}
                        >
                            {muscle}
                        </Badge>
                    ))}
                </div>

                {/* --- WORKOUT GRID --- */}
                <Row className="g-4">
                    {currentWorkouts.map((ex) => (
                        <Col key={ex.id} xs={12} md={6} lg={4}>
                            <Card 
                                className="h-100 border pulse-card-active rounded-4 overflow-hidden" 
                                style={{ backgroundColor: theme.cardBg, borderColor: '#2d2e33', transition: '0.3s' }}
                            >
                                {ex.videoId ? (
                                    <div className="ratio ratio-16x9 border-bottom border-dark">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${ex.videoId}?autoplay=0&rel=0&modestbranding=1&origin=${window.location.origin}`}
                                            title={ex.name}
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            className="border-0"
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="ratio ratio-16x9 d-flex align-items-center justify-content-center flex-column text-white-50" style={{ backgroundColor: '#161719' }}>
                                        <PlayCircleFill size={36} style={{ color: theme.orange }} className="mb-2" />
                                        <span className="font-monospace fw-bold tracking-wider text-uppercase" style={{ fontSize: '10px' }}>INITIALIZING FRAME</span>
                                    </div>
                                )}
                                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                                        <h6 className="fw-black text-white m-0 text-uppercase tracking-tight" style={{ fontSize: '15px' }}>{ex.name}</h6>
                                        <Badge style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', color: theme.orange, border: `1px solid ${theme.border}` }} className="font-monospace text-uppercase px-2 py-1 small">
                                            {ex.muscle}
                                        </Badge>
                                    </div>
                                    <Card.Text className="text-muted font-monospace m-0 text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                        {activeTab === 'home' ? '⚡ CALLISTHENICS & KINETIC LOAD' : '⚙️ BARBELLS & ISO-TRACK MECHANICAL UNITS'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default WorkoutLibrary;