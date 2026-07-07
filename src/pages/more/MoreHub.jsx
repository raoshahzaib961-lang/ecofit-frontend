import React, { useState } from 'react';
import { Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GearFill, ShieldLockFill, TrophyFill, BarChartLineFill, CalculatorFill, CheckCircleFill } from 'react-bootstrap-icons';

import GoalTracker from './files/GoalTracker';
import HabitTracker from './files/HabitTracker';

const MoreHub = () => {
  const navigate = useNavigate();

  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00' };
  const cardBase = { background: theme.card, borderRadius: '30px', border: 'none', padding: '25px', color: 'white' };

  const [showNotification, setShowNotification] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const triggerModalAlert = (msg) => {
    setModalMessage(msg);
    setShowNotification(true);
  };

  const tools = [
    { name: 'Settings', icon: <GearFill size={28} />, path: '/settings', desc: 'Account & Security' },
    { name: 'Leaderboard', icon: <TrophyFill size={28} />, path: '/leaderboard', desc: 'Global Rankings' },
    { name: 'Progress', icon: <BarChartLineFill size={28} />, path: '/progress', desc: 'Weekly Analytics' },
    { name: 'BMI Calc', icon: <CalculatorFill size={28} />, path: '/bmi', desc: 'Health Metrics' },
    { name: 'Privacy', icon: <ShieldLockFill size={28} />, path: '/privacy', desc: 'Data & Safety' },
  ];

  return (
    <div className="p-3 p-sm-5 animate__animated animate__fadeIn" style={{ backgroundColor: theme.bg, minHeight: '100vh', color: 'white' }}>
      
      <div className="mb-5">
        <h1 className="fw-black text-white text-uppercase tracking-wider m-0">Extensions</h1>
        <p className="text-muted small mt-1">Configure user modules and manage personal performance matrix assets.</p>
      </div>

      <Row className="g-4 mb-5">
        {tools.map((tool, i) => (
          <Col xs={12} sm={6} md={4} lg={2.4} key={i}>
            <Card 
              onClick={() => navigate(tool.path)}
              className="border-0 p-3 text-center h-100 hover-up transition-300"
              style={{ background: theme.card, borderRadius: '24px', cursor: 'pointer' }}
            >
              <div className="mb-2" style={{ color: theme.orange }}>{tool.icon}</div>
              <h6 className="fw-bold text-white mb-1" style={{ fontSize: '14px' }}>{tool.name}</h6>
              <p className="text-muted m-0" style={{ fontSize: '11px' }}>{tool.desc}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-5">
        <Col xs={12} lg={6}>
          <GoalTracker theme={theme} cardBase={cardBase} showModal={triggerModalAlert} />
        </Col>
        <Col xs={12} lg={6}>
          <HabitTracker theme={theme} cardBase={cardBase} />
        </Col>
      </Row>

      <Modal show={showNotification} onHide={() => setShowNotification(false)} centered contentClassName="bg-dark text-white border-0 rounded-4 mx-3">
        <Modal.Body className="p-4 text-center">
          <div className="text-warning mb-3"><CheckCircleFill size={40} /></div>
          <p className="mb-4 font-monospace small">{modalMessage}</p>
          <Button variant="outline-warning" className="px-5 rounded-pill font-monospace small" onClick={() => setShowNotification(false)}>Acknowledge</Button>
        </Modal.Body>
      </Modal>

      <style>{`
        .hover-up:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(255,107,0,0.15) !important; }
        .transition-300 { transition: all 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default MoreHub;