import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { Magic } from 'react-bootstrap-icons';
import apiClient from '../../api/client';

const QuickTracker = ({ onUpdate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      await apiClient.post('/food/analyze', { foodDescription: input });
      setInput('');
      if (onUpdate) onUpdate(); // This is what makes the bars move!
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <Card.Body className="p-4 bg-white">
        <h6 className="fw-bold mb-3 text-success">AI Nutritionist</h6>
        <Form onSubmit={handleAnalyze}>
          <InputGroup className="bg-light rounded-pill p-1 border">
            <Form.Control
              className="border-0 bg-transparent ps-3"
              placeholder="Ex: 'I ate 2 eggs and a bowl of Biryani'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button 
              variant="success" 
              className="rounded-pill px-4 d-flex align-items-center" 
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : <><Magic className="me-2"/> Analyze</>}
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuickTracker;