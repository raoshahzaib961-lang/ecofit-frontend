import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Form, Row, Col, Button } from 'react-bootstrap';
import { Fire, CheckCircleFill, Circle, Award, PlusCircleFill } from 'react-bootstrap-icons';
import axios from 'axios';

const HabitTracker = ({ theme, cardBase }) => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCat, setNewHabitCat] = useState('Fitness');

  const getHeaders = () => ({ 
    Authorization: `Bearer ${localStorage.getItem('eco_fit_token')}` 
  });

  const fetchHabits = async () => {
    try {
      const res = await axios.get('https://ecofit-backend.vercel.app/api/habit-tracker', { headers: getHeaders() });
      setHabits(res.data);
    } catch (err) {
      console.error("❌ HABIT FETCH ERROR: Check if token exists or middleware is failing:", err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  const toggleHabitCompletion = async (id, currentStatus) => {
    try {
      const res = await axios.put(`https://ecofit-backend.vercel.app/api/habit-tracker/toggle/${id}`, 
        { completed: !currentStatus }, 
        { headers: getHeaders() }
      );
      // Only updates the UI card if MongoDB successfully responds with the updated document
      setHabits(prev => prev.map(h => h._id === id ? res.data : h));
    } catch (err) {
      console.error("❌ HABIT TOGGLE ERROR: Is the route /toggle/:id correct?", err.response?.data || err.message);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    try {
      const res = await axios.post('https://ecofit-backend.vercel.app/api/habit-tracker/create', 
        { name: newHabitName, category: newHabitCat }, 
        { headers: getHeaders() }
      );
      // Appends item strictly from MongoDB response
      setHabits(prev => [...prev, res.data]);
      setNewHabitName('');
    } catch (err) {
      console.error("❌ HABIT CREATION ERROR: Verify your backend controllers/habitController.js file:", err.response?.data || err.message);
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <Card style={cardBase} className="h-100">
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-10 pb-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <Fire size={22} style={{ color: '#ff6b00' }} />
          <h5 className="fw-black m-0 text-uppercase tracking-tight">Atomic Habit Infrastructure</h5>
        </div>
        <span className="fw-black font-monospace text-orange" style={{ fontSize: '13px' }}>{completionPercentage}% COMMITTED</span>
      </div>

      <ProgressBar now={completionPercentage} variant="warning" style={{ height: '4px', background: '#333' }} className="mb-4 rounded-pill" />

      <div className="d-flex flex-column gap-2 overflow-y-auto mb-4" style={{ maxHeight: '220px', paddingRight: '4px' }}>
        {habits.length === 0 ? (
          <small className="text-muted font-monospace text-center py-4">No real habits synced from database.</small>
        ) : (
          habits.map((habit) => (
            <div 
              key={habit._id} 
              className="d-flex align-items-center justify-content-between p-3 rounded-4" 
              style={{ background: habit.completed ? 'rgba(255,107,0,0.04)' : '#1f2024', border: habit.completed ? `1px solid rgba(255,107,0,0.15)` : '1px solid transparent' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div onClick={() => toggleHabitCompletion(habit._id, habit.completed)} style={{ cursor: 'pointer', color: habit.completed ? '#ff6b00' : '#555' }}>
                  {habit.completed ? <CheckCircleFill size={20} /> : <Circle size={20} />}
                </div>
                <div>
                  <span className={`fw-bold d-block small ${habit.completed ? 'text-decoration-line-through text-muted' : 'text-white'}`}>{habit.name}</span>
                  <span className="badge bg-dark text-muted p-1 mt-1 font-monospace" style={{ fontSize: '8px' }}>{habit.category?.toUpperCase()}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-1 font-monospace text-warning fw-black" style={{ fontSize: '11px' }}>
                <Award size={14} />
                <span>{habit.streak} DAY STREAK</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Form onSubmit={handleCreateHabit} className="border-top border-secondary border-opacity-10 pt-3 mt-auto">
        <Row className="g-2">
          <Col xs={12} sm={7}>
            <Form.Control 
              type="text" 
              placeholder="Initialize custom tracking..." 
              className="bg-secondary bg-opacity-10 text-white border-secondary p-2 small font-monospace"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              required
            />
          </Col>
          <Col xs={7} sm={3}>
            <Form.Select className="bg-dark text-white border-secondary p-2 small font-monospace" value={newHabitCat} onChange={(e) => setNewHabitCat(e.target.value)}>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Recovery">Recovery</option>
              <option value="Mindset">Mindset</option>
            </Form.Select>
          </Col>
          <Col xs={5} sm={2}>
            <Button variant="outline-warning" type="submit" className="w-100 h-100 p-0 d-flex align-items-center justify-content-center rounded-3">
              <PlusCircleFill size={18} />
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default HabitTracker;