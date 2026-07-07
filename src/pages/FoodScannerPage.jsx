import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// Corrected import path to your nutrition folder
import FoodScanner from '../features/nutrition/FoodScanner'; 

const FoodScannerPage = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="mb-4">
            <h2 className="fw-bold text-dark">AI Food Scanner</h2>
            <p className="text-muted">Snap a photo and let Llama-3-Vision calculate your nutrients.</p>
          </div>
          
          {/* Your component from the nutrition folder */}
          <FoodScanner onUpdate={() => console.log("Scanner updated data!")} />
          
          <div className="mt-4 p-3 bg-white rounded-4 border shadow-sm">
            <h6 className="fw-bold text-success">Pro Tip</h6>
            <p className="small text-muted mb-0">
              For the best accuracy, ensure the food is well-lit and centered in the frame. 
              The AI works best with single dishes (e.g., a bowl of Biryani or a slice of Pizza).
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodScannerPage;