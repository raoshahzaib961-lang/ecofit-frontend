import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '', 
    weight: '', 
    activityLevel: '1.2', 
    goal: 'maintain' 
  });

  useEffect(() => {
    const token = localStorage.getItem('eco_fit_token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.age || !formData.height || !formData.weight)) {
       setError('Please fill in all biometric configurations before moving forward.');
       return;
    }
    setError('');
    setStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    const completeProfileData = {
      gender: formData.gender,
      age: age,
      height: height,
      weight: weight,
      goal: formData.goal,
      activityLevel: formData.activityLevel
    };

    try {
      const token = localStorage.getItem('eco_fit_token');

      const response = await axios.put(
        'http://localhost:5000/api/auth/update-biometrics', 
        completeProfileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Failed to sync onboarding calculations:", err);
      setError(err.response?.data?.error || 'Could not communicate target profile settings with ledger services.');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0b', minHeight: '100vh', color: 'white' }} className="d-flex align-items-center py-5">
      <Container style={{ maxWidth: '600px' }}>
        <Card style={{ background: '#1a1b1e', borderRadius: '30px', border: 'none', padding: '40px' }} className="shadow-lg">
          
          {error && <Alert variant="danger" className="bg-danger bg-opacity-10 border-0 text-danger small mb-3">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <h4 className="fw-black mb-4 text-uppercase tracking-wider" style={{ color: '#ff6b00' }}>Biometric Profile</h4>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted text-uppercase fw-bold">Gender</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </Form.Group>
                
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small text-muted text-uppercase fw-bold">Age</Form.Label>
                    <Form.Control type="number" name="age" required value={formData.age} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }} />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small text-muted text-uppercase fw-bold">Height (cm)</Form.Label>
                    <Form.Control type="number" name="height" required value={formData.height} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }} />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label className="small text-muted text-uppercase fw-bold">Weight (kg)</Form.Label>
                    <Form.Control type="number" name="weight" required value={formData.weight} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }} />
                  </Col>
                </Row>
                <Button variant="warning" className="w-100 py-3 mt-4 rounded-pill fw-black text-uppercase border-0" onClick={handleNext} style={{ background: '#ff6b00', color: 'black' }}>Continue</Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h4 className="fw-black mb-4 text-uppercase tracking-wider" style={{ color: '#ff6b00' }}>Target Goals</h4>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted text-uppercase fw-bold">Activity Multiplier</Form.Label>
                  <Form.Select name="activityLevel" value={formData.activityLevel} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }}>
                    <option value="1.2">Sedentary (Desk Job)</option>
                    <option value="1.375">Light Exercise (1-3 days/wk)</option>
                    <option value="1.55">Moderate Exercise (3-5 days/wk)</option>
                    <option value="1.725">Heavy Athlete (6-7 days/wk)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted text-uppercase fw-bold">Primary Objective</Form.Label>
                  <Form.Select name="goal" value={formData.goal} onChange={handleChange} style={{ background: '#25262b', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }}>
                    <option value="loss">Fat Loss (Deficit)</option>
                    <option value="maintain">Maintain Vitality Balance</option>
                    <option value="gain">Muscle Mass Build (Surplus)</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button variant="dark" className="w-50 py-3 rounded-pill fw-bold text-uppercase border-0" onClick={handleBack} style={{ background: '#25262b', color: 'white' }}>Back</Button>
                  <Button type="submit" className="w-50 py-3 rounded-pill fw-black text-uppercase border-0" style={{ background: '#ff6b00', color: 'black' }}>Generate Dashboard</Button>
                </div>
              </div>
            )}
          </Form>

        </Card>
      </Container>
      <style>{` .fw-black { font-weight: 900 !important; } `}</style>
    </div>
  );
};

export default Onboarding;