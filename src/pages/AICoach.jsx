import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Send, Robot, Download } from 'react-bootstrap-icons'; 
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const AICoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey there! I'm your Eco-Fit Intelligence Coach. I've compiled your metrics—shall we optimize your current training split or generate a macro meal plan layout?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00' };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    doc.setFontSize(20);
    doc.text("Eco-Fit AI Coaching Plan", 20, yPos);
    yPos += 15;
    doc.setFontSize(12);
    messages.forEach((m) => {
      const lines = doc.splitTextToSize((m.role === 'user' ? "You: " : "Coach: ") + m.text, 170);
      if (yPos + lines.length * 7 > 280) { doc.addPage(); yPos = 20; }
      doc.text(lines, 20, yPos);
      yPos += (lines.length * 7) + 5;
    });
    doc.save("Eco-Fit-Plan.pdf");
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await axios.post('https://ecofit-backend.vercel.app/api/coach/chat', { message: userText, history: messages });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Telemetry link interrupted. Please resend." }]);
    } finally { setLoading(false); }
  };

  return (
    <Container fluid className="px-3 px-sm-5 pb-4 flex-grow-1 d-flex flex-column">
      
      {/* INJECTED ANIMATION TRANSITIONS */}
      <style>{`
        @keyframes subtleEntrance { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animated-frame { animation: subtleEntrance 0.4s ease forwards; }
      `}</style>

      <Card className="flex-grow-1 border-0 rounded-4 overflow-hidden d-flex flex-column position-relative animated-frame" style={{ background: theme.card, minHeight: '72vh' }}>
        <div className="p-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#151619', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="d-flex align-items-center">
            <div className="p-2 me-3 rounded-circle border border-secondary border-opacity-30" style={{ background: '#000' }}>
              <Robot size={24} style={{ color: theme.orange }} />
            </div>
            <div>
              <h6 className="mb-0 fw-bold text-white text-uppercase" style={{ fontSize: '13px' }}>Eco-Fit Core Intelligence</h6>
              <small className="text-success font-monospace" style={{ fontSize: '10px' }}>● ALGORITHM ENGAGED // ONLINE</small>
            </div>
          </div>
          <Button variant="outline-light" size="sm" className="rounded-pill px-3 border-secondary text-white-50" style={{ fontSize: '11px' }} onClick={downloadPDF}>
            <Download className="me-2" /> Download Telemetry Plan
          </Button>
        </div>

        <Card.Body className="overflow-auto p-4 d-flex flex-column flex-grow-1" style={{ backgroundColor: '#0f1012', maxHeight: 'calc(100vh - 290px)' }}>
          {messages.map((m, i) => (
            <div key={i} className={`d-flex mb-4 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className="p-3 px-4" style={{ 
                maxWidth: '75%', borderRadius: '24px', fontSize: '15px',
                background: m.role === 'user' ? theme.orange : '#1a1b1e',
                color: m.role === 'user' ? 'black' : 'white',
                fontWeight: m.role === 'user' ? '600' : '400'
              }}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex mb-4">
              <div className="p-3 px-4 rounded-4" style={{ background: '#1a1b1e' }}>
                <Spinner animation="grow" size="sm" style={{ backgroundColor: theme.orange }} className="me-1 border-0" />
                <Spinner animation="grow" size="sm" style={{ backgroundColor: theme.orange }} className="me-1 border-0" />
                <Spinner animation="grow" size="sm" style={{ backgroundColor: theme.orange }} className="border-0" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </Card.Body>

        <div className="p-3" style={{ backgroundColor: '#131417', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Form onSubmit={handleChat} className="d-flex gap-2">
            <Form.Control size="lg" className="border-0 text-white rounded-pill px-4 fs-6 shadow-none" placeholder="Ask about meal metrics or training splits..." value={input} onChange={(e) => setInput(e.target.value)} style={{ backgroundColor: '#202125' }} />
            <Button type="submit" className="rounded-circle d-flex align-items-center justify-content-center border-0" style={{ width: '50px', height: '50px', backgroundColor: theme.orange }}>
              <Send size={20} color="black" />
            </Button>
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default AICoach;