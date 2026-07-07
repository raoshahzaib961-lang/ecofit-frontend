import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { ShieldLockFill, EyeFill, PersonFill, CheckCircleFill, ExclamationTriangleFill, LockFill } from 'react-bootstrap-icons';
import axios from 'axios';

const SettingsPrivacy = () => {
  // Core dynamic user settings state
  const [formData, setFormData] = useState({
    username: 'Makise_Kurisu',
    email: 'kurisu@lab.jp',
    password: '',
    confirmPassword: '',
    isPublicOnLeaderboard: true,
    twoFactorAuth: false
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Fetch current user details on mounting execution loop
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setFormData({
            username: res.data.data.username || res.data.data.name,
            email: res.data.data.email,
            password: '',
            confirmPassword: '',
            isPublicOnLeaderboard: res.data.data.isPublicOnLeaderboard !== false,
            twoFactorAuth: res.data.data.twoFactorAuth || false
          });
        }
      } catch (err) {
        console.error("Failed to load backend profile sequence", err);
      }
    };
    fetchUserData();
  }, []);

  // Structural Form Input Interceptor
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Backend Pipeline Data Submission Block
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setStatus({ type: 'danger', message: 'Mismatched access passwords' });
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setStatus({ type: 'success', message: 'Database state matrix synchronized successfully.' });
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      setStatus({ 
        type: 'danger', 
        message: err.response?.data?.message || 'Matrix optimization request failed.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    orange: '#ff6b00',
    cardBg: '#1a1b1e',
    bodyBg: '#0e0f11',
    border: 'rgba(255, 107, 0, 0.25)',
    textPrimary: '#f8f9fa',   // High visibility silver-white
    textSecondary: '#ced4da' // Bright, crisp secondary text
  };

  return (
    <div className="p-4 p-md-5" style={{ backgroundColor: theme.bodyBg, minHeight: '100vh', color: theme.textPrimary }}>
      <style>{`
        @keyframes cyberGlow {
          0% { box-shadow: 0 0 15px rgba(255, 107, 0, 0.1); border-color: #2d2e33; }
          50% { box-shadow: 0 0 25px rgba(255, 107, 0, 0.3); border-color: #ff6b00; }
          100% { box-shadow: 0 0 15px rgba(255, 107, 0, 0.1); border-color: #2d2e33; }
        }
        .cyber-card {
          animation: cyberGlow 4s infinite ease-in-out;
          background: ${theme.cardBg} !important;
          border: 1px solid #343a40 !important;
        }
        .custom-input {
          background-color: #000000 !important;
          border: 1px solid #495057 !important;
          color: #ffffff !important;
          font-weight: 500;
        }
        .custom-input:focus {
          border-color: ${theme.orange} !important;
          box-shadow: 0 0 10px rgba(255, 107, 0, 0.35) !important;
        }
        /* Fixes placeholder visibility across all modern engine layouts */
        .custom-input::placeholder {
          color: #adb5bd !important;
          opacity: 1 !important;
        }
        .disabled-input {
          background-color: #111215 !important;
          border: 1px solid #2d3035 !important;
          color: #868e96 !important;
          cursor: not-allowed;
        }
        .form-check-input {
          cursor: pointer;
          border-color: #495057 !important;
          background-color: #2b2c30 !important;
        }
        .form-check-input:checked {
          background-color: ${theme.orange} !important;
          border-color: ${theme.orange} !important;
        }
        .form-check-label {
          color: ${theme.textSecondary} !important;
          cursor: pointer;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-black text-white m-0 tracking-tight text-uppercase display-6">System Configuration</h2>
          <p className="font-monospace small m-0 mt-1" style={{ color: theme.orange, letterSpacing: '0.5px' }}>
            MODIFY ACCOUNT NODES & PRIVACY CONSTRAINTS
          </p>
        </div>
        <Badge style={{ backgroundColor: 'rgba(255, 107, 0, 0.12)', color: theme.orange, border: `1px solid ${theme.border}` }} className="p-2 font-monospace text-uppercase tracking-wider">
          SECURE CHANNEL SECURED
        </Badge>
      </div>

      {status.message && (
        <div className={`p-3 mb-4 rounded-4 d-flex align-items-center gap-3 border font-monospace text-uppercase shadow-sm`} 
             style={{ 
               backgroundColor: status.type === 'success' ? 'rgba(25, 135, 84, 0.15)' : 'rgba(220, 53, 69, 0.15)',
               borderColor: status.type === 'success' ? '#198754' : '#dc3545',
               color: status.type === 'success' ? '#22c55e' : '#f87171',
               fontSize: '13px'
             }}>
          {status.type === 'success' ? <CheckCircleFill size={18} /> : <ExclamationTriangleFill size={18} />}
          {status.message}
        </div>
      )}

      <Card className="cyber-card p-4 p-md-5 rounded-4 shadow-lg">
        <Form onSubmit={handleSubmit}>
          
          {/* SECTION 1: CORE TELEMETRY */}
          <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-dark pb-3">
            <PersonFill size={22} style={{ color: theme.orange }} prefix='text' />
            <h5 className="font-monospace text-uppercase m-0 tracking-wider fw-bold" style={{ fontSize: '15px', color: '#ffffff' }}>
              User Credentials
            </h5>
          </div>

          <Row className="mb-4">
            <Col md={6} className="mb-4 mb-md-0">
              <Form.Group>
                <Form.Label className="font-monospace small fw-black tracking-wide mb-2" style={{ color: theme.textSecondary }}>
                  IDENTITY TAG / USERNAME
                </Form.Label>
                <Form.Control 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="custom-input p-3 rounded-4 font-monospace text-uppercase" 
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="font-monospace small fw-black tracking-wide m-0" style={{ color: theme.textSecondary }}>
                    COMMUNICATION LINK / EMAIL
                  </Form.Label>
                  <span className="text-warning font-monospace" style={{ fontSize: '10px' }}>
                    <LockFill size={11} className="me-1" /> CORE ID LOCKED
                  </span>
                </div>
                <Form.Control 
                  value={formData.email}
                  className="disabled-input p-3 rounded-4 font-monospace" 
                  disabled 
                  title="Your registered account email structure is system locked and cannot be altered directly."
                />
              </Form.Group>
            </Col>
          </Row>

          {/* SECTION 2: ENCRYPTION PROTOCOLS */}
          <div className="d-flex align-items-center gap-2 mt-5 mb-4 border-bottom border-dark pb-3">
            <ShieldLockFill size={22} style={{ color: theme.orange }} />
            <h5 className="font-monospace text-uppercase m-0 tracking-wider fw-bold" style={{ fontSize: '15px', color: '#ffffff' }}>
              Access Security Keys
            </h5>
          </div>

          <Row className="mb-4">
            <Col md={6} className="mb-4 mb-md-0">
              <Form.Group>
                <Form.Label className="font-monospace small fw-black tracking-wide mb-2" style={{ color: theme.textSecondary }}>
                  NEW ACCESS ENCRYPTION KEY
                </Form.Label>
                <Form.Control 
                  type="password" 
                  name="password"
                  placeholder="ENTER NEW COMPLEX PASSWORD" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="custom-input p-3 rounded-4 font-monospace" 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="font-monospace small fw-black tracking-wide mb-2" style={{ color: theme.textSecondary }}>
                  VERIFY ENCRYPTION KEY
                </Form.Label>
                <Form.Control 
                  type="password" 
                  name="confirmPassword"
                  placeholder="RE-TYPE TO VERIFY SECURITY MATCH" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="custom-input p-3 rounded-4 font-monospace" 
                />
              </Form.Group>
            </Col>
          </Row>

          {/* SECTION 3: PRIVACY FILTERS */}
          <div className="d-flex align-items-center gap-2 mt-5 mb-4 border-bottom border-dark pb-3">
            <EyeFill size={22} style={{ color: theme.orange }} />
            <h5 className="font-monospace text-uppercase m-0 tracking-wider fw-bold" style={{ fontSize: '15px', color: '#ffffff' }}>
              Privacy Matrices
            </h5>
          </div>

          <div className="bg-black p-4 rounded-4 border mb-5" style={{ borderColor: '#2d3035' }}>
            <Form.Check 
              type="switch" 
              id="switch-leaderboard"
              name="isPublicOnLeaderboard"
              label="BROADCAST MATRIX STATUS TO GENERAL LEADERBOARDS" 
              checked={formData.isPublicOnLeaderboard}
              onChange={handleInputChange}
              className="mb-3 font-monospace small tracking-wide fw-bold" 
            />
            <Form.Check 
              type="switch" 
              id="switch-2fa"
              name="twoFactorAuth"
              label="INITIALIZE MULTI-FACTOR AUTHENTICATION SYSTEM TO LINK SECURITY" 
              checked={formData.twoFactorAuth}
              onChange={handleInputChange}
              className="font-monospace small tracking-wide fw-bold" 
            />
          </div>

          {/* CONTROL SYNC TERMINAL */}
          <Button 
            type="submit"
            disabled={loading}
            style={{ backgroundColor: theme.orange, color: '#000000', letterSpacing: '1px' }} 
            className="border-0 px-5 py-3 fw-black font-monospace rounded-pill shadow-lg w-100 w-md-auto d-flex align-items-center justify-content-center gap-2 hover-scale btn-lg"
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" variant="dark" /> SYNCHRONIZING MATRIX...
              </>
            ) : (
              'SAVE AND RECOMPILE TARGET SYSTEM'
            )}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPrivacy;