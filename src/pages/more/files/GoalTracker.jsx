import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Speedometer2, CameraFill } from 'react-bootstrap-icons';
import axios from 'axios';

const GoalTracker = ({ theme, cardBase, showModal }) => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [progressImage, setProgressImage] = useState('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop');

  const getHeaders = () => ({ 
    Authorization: `Bearer ${localStorage.getItem('eco_fit_token')}` 
  });

  const fetchGoalData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/goals', { headers: getHeaders() });
      const activeWeightGoal = res.data.data?.find(g => g.type === 'weight_loss');
      if (activeWeightGoal) {
        if (activeWeightGoal.weightTimeline?.length > 0) setWeightHistory(activeWeightGoal.weightTimeline);
        if (activeWeightGoal.progressImage) setProgressImage(activeWeightGoal.progressImage);
      }
    } catch (err) {
      console.error("❌ GOAL FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchGoalData(); }, []);

  const handleWeightUpdate = async (e) => {
    e.preventDefault();
    if (!currentWeight || isNaN(currentWeight)) return;
    const numericWeight = parseFloat(currentWeight);

    try {
      const res = await axios.post('http://localhost:5000/api/goals/weight', { weight: numericWeight }, { headers: getHeaders() });
      if (res.data.success && res.data.data.weightTimeline) {
        setWeightHistory(res.data.data.weightTimeline);
        if (showModal) showModal("Weight registered successfully inside MongoDB!");
      }
      setCurrentWeight('');
    } catch (err) {
      console.error("❌ GOAL WEIGHT UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      try {
        await axios.post('http://localhost:5000/api/goals/progress-image', { image: base64Data }, { headers: getHeaders() });
        setProgressImage(base64Data);
        if (showModal) showModal("Biometric snapshot synchronized with cloud!");
      } catch (err) {
        console.error("❌ GOAL IMAGE UPDATE ERROR:", err.response?.data || err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card style={cardBase} className="d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-10 pb-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <Speedometer2 size={22} style={{ color: '#ff6b00' }} />
            <h5 className="fw-black m-0 text-uppercase tracking-tight">Physiological Goal Matrix</h5>
          </div>
          <span className="badge bg-black border border-secondary text-muted font-monospace py-2 px-3 rounded-pill" style={{ fontSize: '10px' }}>
            WEEKLY RESOLUTION
          </span>
        </div>

        <Row className="g-4 align-items-center">
          <Col xs={12} sm={5} className="text-center">
            <div className="position-relative d-inline-block rounded-4 overflow-hidden shadow-lg" style={{ width: '100%', maxWidth: '170px', height: '210px', border: '1px solid #333' }}>
              <img src={progressImage} alt="Progress Profile" className="w-100 h-100 object-fit-cover opacity-75" />
              <label htmlFor="progress-upload-input" className="position-absolute bottom-0 start-0 w-100 bg-black bg-opacity-75 p-2 text-warning d-flex align-items-center justify-content-center gap-2 small m-0" style={{ cursor: 'pointer' }}>
                <CameraFill size={14} />
                <span className="fw-bold" style={{ fontSize: '10px' }}>UPDATE SNAPSHOT</span>
              </label>
              <input type="file" id="progress-upload-input" accept="image/*" className="d-none" onChange={handleImageUpload} />
            </div>
          </Col>

          <Col xs={12} sm={7}>
            <Form onSubmit={handleWeightUpdate} className="mb-4">
              <Form.Label className="small fw-black font-monospace text-muted text-uppercase mb-2" style={{ fontSize: '10px' }}>
                Log Current Biometric Mass
              </Form.Label>
              <InputGroup>
                <Form.Control 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g., 78.4" 
                  className="bg-secondary bg-opacity-10 text-white border-secondary p-2 small font-monospace fw-bold" 
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  required
                />
                <Button variant="warning" type="submit" className="fw-black px-3 text-uppercase" style={{ fontSize: '11px' }}>
                  Commit Log
                </Button>
              </InputGroup>
            </Form>

            <div className="bg-black bg-opacity-40 rounded-4 p-3 border border-secondary border-opacity-10">
              <small className="text-muted d-block font-monospace text-uppercase mb-2" style={{ fontSize: '9px' }}>Biometric Linear History</small>
              <div className="d-flex justify-content-between align-items-end gap-2" style={{ height: '75px' }}>
                {weightHistory.length === 0 ? (
                  <span className="text-muted font-monospace small w-100 text-center">No weight data.</span>
                ) : (
                  weightHistory.map((w, idx) => {
                    const maxWeight = Math.max(...weightHistory.map(item => item.weight || 1));
                    const calculatedHeight = maxWeight > 0 ? ((w.weight || 0) / maxWeight) * 100 : 0;
                    return (
                      <div key={idx} className="flex-grow-1 text-center d-flex flex-column align-items-center justify-content-end h-100">
                        <span className="font-monospace text-white fw-bold mb-1" style={{ fontSize: '10px' }}>{w.weight}</span>
                        <div className="w-100 rounded-top" style={{ height: `${calculatedHeight}%`, background: '#ff6b00' }}></div>
                        <span className="text-muted mt-2 d-block text-uppercase" style={{ fontSize: '9px', fontWeight: '800' }}>{w.date || 'Log'}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default GoalTracker;