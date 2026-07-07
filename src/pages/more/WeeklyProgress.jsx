import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { 
  BarChartFill, ArrowLeft, Calendar3, TrophyFill, 
  ExclamationTriangleFill, Water, Activity, Fire, EmojiSmileFill
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WeeklyProgressReport = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [errorFeedback, setErrorFeedback] = useState("");

  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00', dock: '#161618' };
  const cardBase = { background: theme.card, borderRadius: '30px', border: 'none', padding: '25px', color: 'white', height: '100%' };

  const loadWeeklyMetrics = async () => {
    const token = localStorage.getItem('eco_fit_token');
    
    if (!token || token === "null" || token === "undefined") {
      setErrorFeedback("Session validation failed. Missing auth token. Routing to entry point...");
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    try {
      // Connects directly to your progress router engine
      const response = await axios.get('https://ecofit-backend.vercel.app/api/progress/summary?period=weekly', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Directly assign database payload to state
      setReport(response.data);
      setErrorFeedback("");
    } catch (err) {
      console.error("Failed database synchronizing engine sequence:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setErrorFeedback("Active session expired. Please log back in.");
        localStorage.removeItem('eco_fit_token');
        setTimeout(() => navigate('/'), 2500);
      } else {
        setErrorFeedback("Could not connect with progress engine services. Ensure backend server is responsive.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeeklyMetrics();
  }, []);

  if (loading && !errorFeedback) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" style={{ color: theme.orange }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: 'white', paddingBottom: '50px' }}>
      
      <header className="p-4 px-5 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #161618' }}>
        <Button variant="link" className="text-muted d-flex align-items-center gap-2 p-0 text-decoration-none fw-bold" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> BACK TO DASHBOARD
        </Button>
        <div className="d-flex align-items-center gap-2 fw-black text-uppercase tracking-wider" style={{ color: theme.orange }}>
          <Calendar3 /> Progress Ledger
        </div>
      </header>

      <Container className="mt-5 px-4">
        {errorFeedback && (
          <Alert variant="danger" className="border-0 rounded-4 mb-4 bg-danger bg-opacity-10 text-danger p-4 d-flex align-items-center gap-3">
            <ExclamationTriangleFill size={30} className="flex-shrink-0" />
            <div>
              <strong className="fs-5 d-block mb-1">Synchronization System Alert</strong>
              <span className="small opacity-80">{errorFeedback}</span>
            </div>
          </Alert>
        )}

        {!errorFeedback && report && (
          <Row className="g-4">
            
            {/* SIDE CALCULATION INSIGHT BLOCK */}
            <Col lg={4}>
              <Card style={{ ...cardBase, background: theme.orange, color: 'black' }} className="shadow-lg justify-content-between">
                <div>
                  <h6 className="fw-black opacity-50 text-uppercase small m-0">Cycle Tracking Range</h6>
                  <h2 className="display-5 fw-black mt-1 mb-4">7 Days</h2>
                  
                  <div className="bg-black text-white p-3 rounded-4 mb-3 border border-secondary border-opacity-10">
                    <small className="text-muted text-uppercase d-block fw-bold" style={{ fontSize: '10px' }}>Rolling Data Records Found</small>
                    <h2 className="fw-black m-0 mt-1 d-flex align-items-center gap-2" style={{ color: theme.orange }}>
                      <TrophyFill size={22} className="text-warning" /> 
                      {report.days ? report.days.length : 0} <span className="fs-6 text-white fw-normal">logged entries</span>
                    </h2>
                  </div>

                  <div className="bg-black text-white p-3 rounded-4 border border-secondary border-opacity-10">
                    <small className="text-muted text-uppercase d-block fw-bold" style={{ fontSize: '10px' }}>Metric Analytics Average Pedometer</small>
                    <h3 className="fw-black m-0 mt-1 text-info d-flex align-items-center gap-2">
                      <Activity size={20} />
                      {(report.avgStepsWalked || 0).toLocaleString()} <span className="fs-6 text-white fw-normal">steps/day</span>
                    </h3>
                  </div>
                </div>
                
                <Button variant="dark" className="w-100 mt-4 py-3 rounded-pill fw-black border-0 text-uppercase" onClick={() => window.print()}>
                  Export Summary Data
                </Button>
              </Card>
            </Col>

            {/* THREE COLUMN VALUE REPRESENTATION VIEWPORTS */}
            <Col lg={8}>
              <Card style={cardBase}>
                <h6 className="fw-black opacity-50 text-uppercase small mb-4"><BarChartFill className="me-2" />Calculated Rolling Metric Averages</h6>
                
                <Row className="g-4 text-center">
                  <Col xs={4}>
                    <div className="p-3 rounded-4 bg-secondary bg-opacity-10">
                      <Fire className="text-danger mb-2" size={24} />
                      <span className="text-muted d-block small mb-1" style={{ fontSize: '10px' }}>AVG BURN MATRIX</span>
                      <strong className="fs-5">{report.avgCaloriesBurned || 0} kcal</strong>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="p-3 rounded-4 bg-secondary bg-opacity-10">
                      <Water className="text-info mb-2" size={24} />
                      <span className="text-muted d-block small mb-1" style={{ fontSize: '10px' }}>AVG WATER INTAKE</span>
                      <strong className="fs-5">{report.avgWaterConsumed || 0} ml</strong>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="p-3 rounded-4 bg-secondary bg-opacity-10">
                      <EmojiSmileFill className="text-warning mb-2" size={24} />
                      <span className="text-muted d-block small mb-1" style={{ fontSize: '10px' }}>CYCLE SAMPLES</span>
                      <strong className="fs-5">{report.days ? report.days.length : 0} Days</strong>
                    </div>
                  </Col>
                </Row>

                {/* DYNAMIC SCHEMA TABLE ELEMENT MAP LOOP */}
                <h6 className="fw-black opacity-50 text-uppercase small mt-5 mb-3">Database Log Entries Matrix</h6>
                <div className="table-responsive">
                  <Table variant="dark" hover className="m-0 border-0 align-middle">
                    <thead>
                      <tr className="text-muted small border-bottom border-secondary border-opacity-20" style={{ fontSize: '11px' }}>
                        <th className="bg-transparent border-0 py-3">TIMELINE DATE</th>
                        <th className="bg-transparent border-0 py-3 text-center">CONSUMED / BURNED</th>
                        <th className="bg-transparent border-0 py-3 text-center">PEDOMETER</th>
                        <th className="bg-transparent border-0 py-3 text-center">HYDRATION</th>
                        <th className="bg-transparent border-0 py-3 text-end">MOOD VARIANT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.days && report.days.length > 0 ? (
                        report.days.map((item, idx) => (
                          <tr key={idx} className="border-bottom border-secondary border-opacity-10" style={{ fontSize: '13px' }}>
                            <td className="bg-transparent border-0 py-3 text-white-50">
                              <span className="d-block fw-bold text-white">{item.day || new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                              <small className="opacity-50">{item.date}</small>
                            </td>
                            <td className="bg-transparent border-0 py-3 text-center">
                              <span className="text-warning fw-bold">{item.calories || item.caloriesConsumed || 0}</span> 
                              <span className="text-muted small"> / </span>
                              <span className="text-danger fw-bold">{item.burned || item.caloriesBurned || 0} kcal</span>
                            </td>
                            <td className="bg-transparent border-0 py-3 text-center fw-bold">{(item.steps || item.stepsWalked || 0).toLocaleString()}</td>
                            <td className="bg-transparent border-0 py-3 text-center text-info fw-bold">{item.water || item.waterConsumed || 0} ml</td>
                            <td className="bg-transparent border-0 py-3 text-end">
                              <span className="badge rounded-pill bg-secondary bg-opacity-20 text-white px-3 py-1">
                                {item.mood || "Stable"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="bg-transparent border-0 text-center py-5 text-muted">
                            No active biometrics found within the last 7 days. Try adding data logs from your primary dashboard!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

              </Card>
            </Col>

          </Row>
        )}
      </Container>

      <style>{` .fw-black { font-weight: 900 !important; } ::-webkit-scrollbar { width: 0px; } `}</style>
    </div>
  );
};

export default WeeklyProgressReport;