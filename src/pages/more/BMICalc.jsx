import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// Fixed the import below: removed 'speed', added 'Speedometer2'
import { CalculatorFill, InfoCircleFill, Speedometer2 } from 'react-bootstrap-icons';

const BMICalc = () => {
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(180);
  const [bmi, setBmi] = useState(23.1);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const result = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(result);
  };

  const getStatus = (val) => {
    if (val < 18.5) return { text: "UNDERWEIGHT", color: "#ffc107" };
    if (val < 25) return { text: "HEALTHY WEIGHT", color: "#000" };
    if (val < 30) return { text: "OVERWEIGHT", color: "#ff6b00" };
    return { text: "OBESE", color: "#dc3545" };
  };

  const status = getStatus(bmi);

  return (
    <Container fluid className="p-4 animate__animated animate__fadeIn" style={{ color: 'white' }}>
      <h2 className="fw-black mb-4 text-uppercase tracking-tighter">
        <CalculatorFill className="me-2 text-orange" style={{color: '#ff6b00'}} /> 
        Body Metrics AI
      </h2>

      <Row className="g-4">
        {/* LEFT: INPUTS */}
        <Col lg={5}>
          <Card className="border-0 shadow-lg p-4" style={{ background: '#1a1b1e', borderRadius: '30px' }}>
            <h5 className="fw-bold mb-4 opacity-75">Adjust Parameters</h5>
            
            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                <label>WEIGHT</label>
                <span>{weight} kg</span>
              </div>
              <Form.Range 
                min="40" max="150" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                <label>HEIGHT</label>
                <span>{height} cm</span>
              </div>
              <Form.Range 
                min="140" max="220" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
              />
            </Form.Group>

            <Button 
              onClick={calculateBMI}
              className="w-100 py-3 fw-black border-0 mt-2 shadow-lg"
              style={{ background: '#ff6b00', borderRadius: '15px' }}
            >
              SYNC METRICS
            </Button>
          </Card>

          <Card className="border-0 p-3 mt-4 text-muted small" style={{ background: 'transparent', border: '1px dashed #333', borderRadius: '20px' }}>
             <div className="d-flex gap-3">
                <InfoCircleFill size={25} />
                <p className="m-0">AI Note: BMI is a general indicator. For athletes, body fat % is more accurate.</p>
             </div>
          </Card>
        </Col>

        {/* RIGHT: THE ORANGE DISPLAY PILLAR */}
        <Col lg={7}>
          <Card 
            className="border-0 h-100 p-5 d-flex flex-column align-items-center justify-content-center text-center shadow-lg" 
            style={{ background: '#ff6b00', borderRadius: '40px', color: 'black' }}
          >
            <Speedometer2 size={50} className="mb-3 opacity-50" />
            <span className="fw-bold opacity-75 mb-2 uppercase">Current BMI Score</span>
            <h1 className="display-1 fw-black m-0" style={{ fontSize: '8rem', lineHeight: '1' }}>
              {bmi}
            </h1>
            <div className="mt-4 px-5 py-2 bg-black text-white rounded-pill fw-black">
              {status.text}
            </div>
          </Card>
        </Col>
      </Row>

      <style>{`
        .fw-black { font-weight: 900 !important; }
        input[type=range]::-webkit-slider-thumb { background: #ff6b00; }
      `}</style>
    </Container>
  );
};

export default BMICalc;