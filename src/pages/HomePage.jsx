import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Spinner, Alert, Modal, Form, InputGroup } from 'react-bootstrap';
import { 
  Activity, DropletFill, LightningFill, ExclamationTriangleFill, PlusCircleFill, 
  GeoAltFill, Wind, ShieldCheck, MoonStarsFill, CloudSunFill, Fire, PersonWalking 
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ==========================================
// Weather Intelligence Engine Calculation Subsystem (RESTORED FULL LOGIC)
// ==========================================
const calculateWeatherIntelligence = (weatherData) => {
  if (!weatherData) return null;

  const { temp, condition, humidity, windSpeed } = weatherData;
  const condLower = condition ? condition.toLowerCase() : '';
  
  let intensity = "MODERATE REGULAR";
  let colorClass = "text-warning";
  let bgClass = "border-warning";
  let tips = [];

  if (temp >= 32 || (temp >= 28 && humidity > 70)) {
    intensity = "LOW INTENSITY (RESTRICTED)";
    colorClass = "text-danger";
    bgClass = "border-danger";
    tips.push("High heat index risk. Move your workout indoors or focus on low-heart-rate mobility work.", "Double your daily fluid intake thresholds.");
  } else if (temp <= 5) {
    intensity = "MODERATE (EXTENDED WARMUP)";
    colorClass = "text-info";
    bgClass = "border-info";
    tips.push("Frigid air increases muscle rigidity. Spend at least 15 minutes on comprehensive dynamic warmups.", "Wear synthetic moisture-wicking core layers.");
  } else if (temp >= 14 && temp <= 22 && !condLower.includes("rain")) {
    intensity = "PEAK PERFORMANCE (HIGH)";
    colorClass = "text-success";
    bgClass = "border-success";
    tips.push("Optimal cardiovascular climate. Perfect day for high-intensity interval training (HIIT) or outdoor tempo runs.");
  } else {
    intensity = "MODERATE PROGRESSION";
    colorClass = "text-primary";
    bgClass = "border-primary";
    tips.push("Standard climate telemetry parameters. Proceed with your progressive overload metrics as scheduled.");
  }

  if (condLower.includes("rain") || condLower.includes("shower") || condLower.includes("storm") || condLower.includes("drizzle")) {
    intensity = "MODERATE (INDOOR MODIFICATION)";
    colorClass = "text-warning";
    tips.unshift("Slippery surfaces detected via radar. Modify speed drill vectors into static indoor environments.");
  }

  if (windSpeed > 15) {
    tips.push(`High headwinds (${windSpeed} m/s). Expect notable drag variables if running or cycling outdoor lines.`);
  }

  return { intensity, colorClass, bgClass, tips };
};

const HomePage = () => {
  const navigate = useNavigate();
  
  // Core State Holders
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Dynamic Weather API State Hooks
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  // Global Modals and User Feedback State
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [appWarning, setAppWarning] = useState("");

  // Exercise Logger Form States
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseCategory, setExerciseCategory] = useState('cardio'); 
  const [activityType, setActivityType] = useState('');
  const [durationOrSets, setDurationOrSets] = useState('');
  const [processingExercise, setProcessingExercise] = useState(false);

  // Food Logger & Groq AI States
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodInput, setFoodInput] = useState('');
  const [processingFood, setProcessingFood] = useState(false);

  const localName = localStorage.getItem('eco_fit_userName') || 'Active User';

  const fetchWeatherMetrics = async (lat, lon, fallbackCity) => {
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      let targetUrl = `https://ecofit-backend.vercel.app/api/weather/current`;
      if (lat && lon) {
        targetUrl += `?lat=${lat}&lon=${lon}`;
      } else {
        targetUrl += `?q=${fallbackCity || 'London'}`;
      }

      const response = await axios.get(targetUrl);
      if (response.data && response.data.success) {
        setWeather(response.data.data);
      } else {
        setWeatherError(true);
      }
    } catch (err) {
      console.error("Telemetry Pipeline Interruption:", err.message);
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchDashboardMetrics = async () => {
    const token = localStorage.getItem('eco_fit_token');
    if (!token) { navigate('/'); return; }

    try {
      const response = await axios.get('https://ecofit-backend.vercel.app/api/auth/daily-log', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      
      if (response.data.log && response.data.log.sleepDuration > 0 && response.data.log.sleepDuration < 6) {
        setAppWarning("Critical Sleep Deficit: Sleeping less than 6 hours disrupts metabolic stability and slows physical recovery.");
      } else {
        setAppWarning("");
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherMetrics(position.coords.latitude, position.coords.longitude, response.data.city);
          },
          () => {
            fetchWeatherMetrics(null, null, response.data.city);
          }
        );
      } else {
        fetchWeatherMetrics(null, null, response.data.city);
      }

    } catch (err) {
      console.error("Error updating dashboard data layer view:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    // eslint-disable-exhaustive-deps
  }, []);

  const syncToProgressLedger = async (updatedLog) => {
    const token = localStorage.getItem('eco_fit_token');
    try {
      await axios.post('https://ecofit-backend.vercel.app/api/progress', {
        weight: dashboardData.weight || 0,
        caloriesConsumed: updatedLog.caloriesConsumed || 0,
        caloriesBurned: updatedLog.caloriesBurned || 0,
        steps: updatedLog.stepsWalked || 0,
        waterIntake: updatedLog.waterConsumed || 0,
        mood: updatedLog.mood || 'Neutral'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Background progress matrix sync pipeline failure:", err);
    }
  };

  const handleTrackerUpdate = async (type, value) => {
    const token = localStorage.getItem('eco_fit_token');
    try {
      const response = await axios.post('https://ecofit-backend.vercel.app/api/auth/update-tracker', 
        { type, value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboardData(prev => ({
        ...prev,
        log: response.data.log,
        vitalityPoints: response.data.vitalityPoints !== undefined ? response.data.vitalityPoints : prev.vitalityPoints
      }));

      syncToProgressLedger(response.data.log);

      if (response.data.celebrate) {
        let metricTitle = type === 'water' ? 'Optimal Hydration' : type === 'sleep' ? 'Sleep Recovery' : 'Daily Step Goal';
        const victoryMsg = `Congratulations! You've achieved your optimal 24-hour ${metricTitle} goal. Your healthy choices have added +15 points to your Vitality ledger!`;
        setPopupMessage(victoryMsg);
        setShowPopup(true);
      }

      if (response.data.warn) {
        setAppWarning(response.data.warningMsg);
      } else if (type === 'sleep' && value >= 6) {
        setAppWarning(""); 
      }
    } catch (err) {
      console.error("Tracker modification error:", err);
    }
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault(); 
    if (!activityType || !durationOrSets) return;

    const token = localStorage.getItem('eco_fit_token');
    setProcessingExercise(true);

    try {
      const response = await axios.post('https://ecofit-backend.vercel.app/api/auth/log-exercise', {
        category: exerciseCategory,
        activityType,
        durationOrSets: Number(durationOrSets)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardData(prev => ({ 
        ...prev, 
        log: response.data.log,
        vitalityPoints: response.data.vitalityPoints !== undefined ? response.data.vitalityPoints : prev.vitalityPoints
      }));
      
      syncToProgressLedger(response.data.log);
      setShowExerciseModal(false);
      setActivityType('');
      setDurationOrSets('');
      
      setPopupMessage(`Your ${activityType} training routine was analyzed. Total day energy expenditure metrics have been updated.`);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to post workout metrics via backend controllers:", err);
    } finally {
      setProcessingExercise(false);
    }
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault(); 
    if (!foodInput.trim()) return;

    const token = localStorage.getItem('eco_fit_token');
    setProcessingFood(true);

    try {
      const response = await axios.post('https://ecofit-backend.vercel.app/api/auth/log-food', {
        foodDescription: foodInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDashboardData(prev => ({
        ...prev,
        log: response.data.log,
        vitalityPoints: response.data.vitalityPoints !== undefined ? response.data.vitalityPoints : prev.vitalityPoints
      }));

      syncToProgressLedger(response.data.log);
      setShowFoodModal(false);
      setFoodInput('');

      if (response.data.celebrate) {
        setPopupMessage(`🎯 Calorie Target Reached! Your personalized fuel logging has optimized your macro splits. +20 Vitality points awarded to your ledger!`);
      } else {
        setPopupMessage(`Successfully added! Groq AI analyzed your meal. Added ${response.data.addedCalories} kcal, ${response.data.macros.protein}g Protein, ${response.data.macros.carbs}g Carbs, and ${response.data.macros.fats}g Fats.`);
      }
      setShowPopup(true);
    } catch (err) {
      console.error("Error connecting with Groq macro logging endpoint:", err);
    } finally {
      setProcessingFood(false);
    }
  };

  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00' };
  const cardBase = { background: theme.card, borderRadius: '30px', border: 'none', padding: '25px', color: 'white', height: '100%' };

  if (loading || !dashboardData || !dashboardData.log) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '80vh' }} className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" style={{ color: theme.orange }} />
      </div>
    );
  }

  const { log, vitalityPoints, name, goal, weight, height, age } = dashboardData;

  const strokeCircumference = 251.2;
  const currentCalories = log.caloriesConsumed || 0; 
  const targetCalories = log.caloriesTarget || 2000;
  const strokeOffsetValue = strokeCircumference - Math.min((currentCalories / targetCalories), 1) * strokeCircumference;

  const proteinTarget = Math.round((targetCalories * 0.30) / 4) || 150;
  const carbsTarget = Math.round((targetCalories * 0.45) / 4) || 225;
  const fatsTarget = Math.round((targetCalories * 0.25) / 9) || 55;

  const proteinConsumed = log.proteinConsumed || 0;
  const carbsConsumed = log.carbsConsumed || 0;
  const fatsConsumed = log.fatsConsumed || 0;

  const intel = calculateWeatherIntelligence(weather);

  return (
    <Container fluid className="px-3 px-sm-5 pb-5">
      {appWarning && (
        <Alert variant="danger" className="border-0 rounded-4 mb-4 bg-danger bg-opacity-10 text-danger p-3 d-flex align-items-center gap-3">
          <ExclamationTriangleFill size={24} className="flex-shrink-0" />
          <div className="small"><strong>System Wellness Alert:</strong> {appWarning}</div>
        </Alert>
      )}

      <Row className="g-4">
        <Col xs={12} xl={8}>
          <Row className="g-4">
            
            {/* CALORIC MACRO RING COUNTER (FULLY RESTORED) */}
            <Col xs={12} md={6}>
              <Card style={cardBase}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-black text-white-50 text-uppercase m-0" style={{ fontSize: '11px' }}>Dynamic Fuel Balance</h6>
                  <Button variant="link" className="p-0 text-warning d-flex align-items-center justify-content-center btn-action" onClick={() => setShowFoodModal(true)} style={{ textDecoration: 'none' }}>
                    <PlusCircleFill size={22} color={theme.orange} />
                  </Button>
                </div>
                <Row className="align-items-center g-3">
                  <Col xs={12} sm={5} className="position-relative text-center d-flex justify-content-center align-items-center">
                    <div className="position-relative" style={{ width: '110px', height: '110px' }}>
                      <svg width="110" height="110" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#333" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke={theme.orange} strokeWidth="8" fill="none" strokeDasharray={strokeCircumference} strokeDashoffset={strokeOffsetValue} strokeLinecap="round" />
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
                        <div className="fw-black text-white" style={{fontSize: '1.1rem'}}>{currentCalories}</div>
                        <small className="text-white-50 d-block" style={{fontSize: '9px'}}>OF {targetCalories} KCAL</small>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={7}>
                    <div className="mb-2">
                       <div className="d-flex justify-content-between small fw-bold mb-1" style={{fontSize:'10px'}}><span>PRO (PROTEIN)</span><span>{proteinConsumed}g / {proteinTarget}g</span></div>
                       <ProgressBar now={Math.min((proteinConsumed / proteinTarget) * 100, 100)} variant="warning" style={{height:'4px', background: '#333'}} />
                    </div>
                    <div className="mb-2">
                       <div className="d-flex justify-content-between small fw-bold mb-1" style={{fontSize:'10px'}}><span>CARB (CARBOHYDRATES)</span><span>{carbsConsumed}g / {carbsTarget}g</span></div>
                       <ProgressBar now={Math.min((carbsConsumed / carbsTarget) * 100, 100)} variant="info" style={{height:'4px', background: '#333'}} />
                    </div>
                    <div>
                       <div className="d-flex justify-content-between small fw-bold mb-1" style={{fontSize:'10px'}}><span>FAT (DIETARY FATS)</span><span>{fatsConsumed}g / {fatsTarget}g</span></div>
                       <ProgressBar now={Math.min((fatsConsumed / fatsTarget) * 100, 100)} variant="danger" style={{height:'4px', background: '#333'}} />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* DYNAMIC INTEGRATED WEATHER INTELLIGENCE PANEL (RESTORED) */}
            <Col xs={12} md={6}>
              <Card className="border-0 position-relative overflow-hidden" style={{ ...cardBase, background: '#121316' }}>
                {weatherLoading ? (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <Spinner animation="border" variant="warning" size="sm" className="mb-2" />
                    <span className="font-monospace text-white-50 tracking-cyber text-overline small">// CAPTURING METAR FEED...</span>
                  </div>
                ) : weatherError || !weather ? (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center py-4 text-center">
                    <CloudSunFill size={26} className="text-danger opacity-75 mb-2" />
                    <span className="small text-white-50 font-monospace">// METEOROLOGICAL ANOMALY</span>
                  </div>
                ) : (
                  <div className="position-relative z-3 h-100 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center gap-1 font-monospace text-orange fw-black mb-1" style={{ fontSize: '10px' }}>
                          <GeoAltFill size={10} />
                          <span>NODE // {weather.city.toUpperCase()}</span>
                        </div>
                        <h5 className="m-0 text-capitalize fw-bold tracking-tight text-white">
                          {weather.description}
                        </h5>
                      </div>
                      <div>
                        <img 
                          src={`https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`} 
                          alt={weather.condition} 
                          style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                        />
                      </div>
                    </div>

                    <div className="my-2 d-flex align-items-baseline gap-2">
                      <h2 className="fw-black m-0 tracking-tighter display-6 text-white">
                        {weather.temp}°C
                      </h2>
                      <span className="text-white-50 text-uppercase font-monospace small" style={{ fontSize: '10px' }}>
                        Feels {weather.feelsLike}°C
                      </span>
                    </div>

                    <div className="border-top border-secondary pt-2 mt-1 d-flex justify-content-between text-center">
                      <div className="d-flex align-items-center gap-2">
                        <DropletFill size={13} className="text-orange" />
                        <div className="text-start">
                          <div className="text-white-50 font-monospace" style={{ fontSize: '9px' }}>HUMID</div>
                          <div className="fw-black text-white" style={{fontSize: '11px'}}>{weather.humidity}%</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3">
                        <Wind size={13} className="text-orange" />
                        <div className="text-start">
                          <div className="text-white-50 font-monospace" style={{ fontSize: '9px' }}>WIND</div>
                          <div className="fw-black text-white" style={{fontSize: '11px'}}>{weather.windSpeed} m/s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            {/* THE CORE INTELLIGENCE OUTPUT DISPLAY OVERVIEW (RESTORED) */}
            {intel && !weatherLoading && !weatherError && (
              <Col xs={12}>
                <Card style={{ ...cardBase, background: '#131417', border: '1px solid #232429' }} className={intel.bgClass}>
                  <div className="d-flex align-items-center justify-content-between border-bottom border-secondary border-opacity-20 pb-2 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Activity className={intel.colorClass} size={18} />
                      <span className="small font-monospace text-white-50 tracking-wider">// REALTIME WEATHER INTELLIGENCE</span>
                    </div>
                    <span className="badge bg-dark border border-secondary font-monospace text-success px-2 py-1" style={{ fontSize: '9px' }}>
                      ALGORITHM: LIVE
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-white-50 font-monospace d-block mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>TARGET WORKOUT INTENSITY</small>
                    <h4 className={`fw-black tracking-wide m-0 ${intel.colorClass}`}>{intel.intensity}</h4>
                  </div>

                  <div className="bg-black bg-opacity-30 p-3 rounded-4 border border-secondary border-opacity-20">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <ShieldCheck size={15} className="text-success" />
                      <span className="font-monospace text-white-50 small" style={{ fontSize: '10px' }}>DYNAMIC AI PRECAUTION PROTOCOLS</span>
                    </div>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-white-50 small">
                      {intel.tips.map((tip, idx) => (
                        <li key={idx} className="d-flex align-items-start gap-2">
                          <span className={`fw-bold ${intel.colorClass}`}>▸</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Col>
            )}

            {/* RECOVERY TILES */}
            <Col xs={12} md={6}>
              <Card style={cardBase} onClick={() => handleTrackerUpdate('sleep', Math.min((log.sleepDuration || 0) + 0.5, 12))} className="btn-action" style={{ ...cardBase, cursor: 'pointer' }}>
                <div className="d-flex justify-content-between mb-3 align-items-center">
                  <MoonStarsFill className="text-primary" size={20} />
                  <small className="fw-bold text-white-50 text-uppercase small">Sleep Recovery</small>
                </div>
                <h2 className="fw-black m-0 text-white">{log.sleepDuration || 0} / {log.sleepTarget || 8} <small className="fs-6 text-white-50">HRS</small></h2>
                <ProgressBar now={((log.sleepDuration || 0) / (log.sleepTarget || 8)) * 100} variant="primary" style={{height:'6px', background: '#333'}} className="mt-3" />
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card style={cardBase} onClick={() => handleTrackerUpdate('water', 250)} className="btn-action" style={{ ...cardBase, cursor: 'pointer' }}>
                <div className="d-flex justify-content-between mb-3 align-items-center">
                  <DropletFill className="text-info" size={20} />
                  <small className="fw-bold text-white-50 text-uppercase small">Hydration Index</small>
                </div>
                <h2 className="fw-black m-0 text-white">{log.waterConsumed || 0} / {log.waterTarget || 2500} <small className="fs-6 text-white-50">ML</small></h2>
                <ProgressBar now={((log.waterConsumed || 0) / (log.waterTarget || 2500)) * 100} variant="info" style={{height:'6px', background: '#333'}} className="mt-3" />
              </Card>
            </Col>

            {/* FITNESS TRACKER LEDGER & STEP SIMULATION (RESTORED ALL DETAILS) */}
            <Col xs={12}>
              <Card style={cardBase}>
                <Row className="g-4">
                  <Col xs={12} md={6}>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                      <h6 className="fw-black text-white-50 text-uppercase m-0 small">Goal Tracker Ledger</h6>
                      <Button variant="outline-warning" size="sm" className="rounded-pill d-flex align-items-center gap-1 px-3" style={{ fontSize: '11px', fontWeight: '700' }} onClick={() => setShowExerciseModal(true)}>
                        + Log Workout
                      </Button>
                    </div>
                    
                    <div className="mb-4">
                      <div className="d-flex justify-content-between small fw-bold mb-2 flex-wrap">
                        <span><Fire className="me-2 text-danger" />BURNED CALORIES</span>
                        <span>{log.caloriesBurned || 0} / {goal === 'loss' ? 900 : 700} kcal</span>
                      </div>
                      <ProgressBar now={((log.caloriesBurned || 0) / (goal === 'loss' ? 900 : 700)) * 100} variant="danger" style={{height:'8px', background: '#333'}} />
                    </div>
                    
                    <div>
                      <div className="d-flex justify-content-between small fw-bold mb-2 flex-wrap">
                        <span><PersonWalking className="me-2 text-info" />DAILY PEDOMETER STEPS</span>
                        <span>{(log.stepsWalked || 0).toLocaleString()} / {(log.stepsTarget || 10000).toLocaleString()} steps</span>
                      </div>
                      <ProgressBar now={((log.stepsWalked || 0) / (log.stepsTarget || 10000)) * 100} variant="info" style={{height:'8px', background: '#333'} } />
                      <span className="text-warning mt-2 d-block btn-action shadow-none" style={{fontSize:'10px', cursor:'pointer'}} onClick={() => handleTrackerUpdate('steps', 1000)}>
                        + Simulate 1,000 steps (+45 kcal synced to burn metric)
                      </span>
                    </div>
                  </Col>
                  
                  {/* CHART TREND BLOCK GRAPH (RESTORED) */}
                  <Col xs={12} md={6}>
                    <div className="p-4 rounded-4 d-flex flex-column justify-content-between" style={{background: '#0d0d0e', border: '1px solid #222', height: '100%', minHeight: '160px'}}>
                      <div className="d-flex justify-content-between mb-3">
                         <h6 className="fw-black m-0 small text-uppercase text-white-50">Vitality Performance Trend</h6>
                         <span className="fw-black text-orange" style={{color: theme.orange}}>+100%</span>
                      </div>
                      <div className="d-flex align-items-end gap-2" style={{height:'80px'}}>
                         {[40, 65, 45, 85, 55, 75, 95].map((v, i) => (
                           <div key={i} className="flex-grow-1 rounded-pill" style={{height: `${v}%`, background: i === 6 ? theme.orange : '#25262b', transition: '0.5s'}}></div>
                         ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

          </Row>
        </Col>

        {/* SIDE PROFILE METRICS COLUMN */}
        <Col xs={12} xl={4}>
          <Card style={{ ...cardBase, background: theme.orange, color: 'black' }} className="shadow-lg text-center d-flex flex-column align-items-center justify-content-between gap-4">
            <div className="w-100">
              <h3 className="fw-black mb-1 text-capitalize">{name || localName}</h3>
              <div className="badge bg-black text-white rounded-pill mb-3 px-3 py-2 text-uppercase" style={{fontSize: '10px'}}>
                Objective: {goal || 'Maintain'}
              </div>

              <div className="bg-black text-white p-3 rounded-4 mb-3 border border-secondary border-opacity-10 shadow-sm">
                <div className="small text-white-50 text-uppercase" style={{fontSize:'10px', letterSpacing: '0.5px'}}>Total Vitality Points</div>
                <h1 className="fw-black m-0 mt-1" style={{color: theme.orange, fontSize: '2.5rem'}}>{vitalityPoints || 0} <span className="fs-6 text-white fw-normal">pts</span></h1>
              </div>

              <div className="my-3 d-flex justify-content-center">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name || localName)}&background=000&color=fff&size=256`} className="rounded-circle border border-5 border-black shadow-lg img-fluid" style={{ width: '130px', height: '130px', objectFit: 'cover' }} alt="profile-avatar" />
              </div>

              <Row className="g-2 text-white mb-3 px-1">
                <Col xs={4}><div className="bg-black rounded-3 p-2 small"><span className="text-white-50 d-block" style={{fontSize:'9px'}}>WEIGHT</span><strong className="fs-6">{weight || '--'} kg</strong></div></Col>
                <Col xs={4}><div className="bg-black rounded-3 p-2 small"><span className="text-white-50 d-block" style={{fontSize:'9px'}}>HEIGHT</span><strong className="fs-6">{height || '--'} cm</strong></div></Col>
                <Col xs={4}><div className="bg-black rounded-3 p-2 small"><span className="text-white-50 d-block" style={{fontSize:'9px'}}>AGE</span><strong className="fs-6">{age || '24'} yrs</strong></div></Col>
              </Row>
            </div>
            <Button variant="dark" className="w-100 mt-auto py-3 rounded-pill fw-black shadow-lg border-0 text-uppercase text-white" onClick={() => navigate('/progress-report')}>Full Progress Report</Button>
          </Card>
        </Col>
      </Row>

      {/* AI FOOD LOGGER DESCRIPTION SEARCH MODAL */}
      <Modal show={showFoodModal} onHide={() => setShowFoodModal(false)} centered contentClassName="bg-dark text-white border-0 rounded-4 mx-3">
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="fw-black text-uppercase small text-warning">Groq AI Food Intelligent Logger</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleFoodSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-white-50">What did you eat?</Form.Label>
              <InputGroup>
                <Form.Control 
                  type="text" 
                  className="bg-secondary bg-opacity-10 text-white border-secondary rounded-start-3 p-2" 
                  placeholder="e.g., 2 slices of whole wheat bread with peanut butter" 
                  value={foodInput} 
                  onChange={(e) => setFoodInput(e.target.value)} 
                  required 
                />
              </InputGroup>
              <Form.Text className="text-white-50" style={{ fontSize: '11px' }}>
                Groq AI instantly calculates macros and total calories from your natural wording.
              </Form.Text>
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100 py-2 rounded-3 text-black fw-black d-flex align-items-center justify-content-center gap-2" disabled={processingFood}>
              {processingFood ? <Spinner animation="border" size="sm" /> : 'Analyze & Add Fuel'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* WORKOUT LOGGING SPECIFICATIONS MODAL */}
      <Modal show={showExerciseModal} onHide={() => setShowExerciseModal(false)} centered contentClassName="bg-dark text-white border-0 rounded-4 mx-3">
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="fw-black text-uppercase small text-warning">Log Training Metrics</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleExerciseSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-white-50">Category</Form.Label>
              <Form.Select className="bg-secondary bg-opacity-10 text-white border-secondary p-2" value={exerciseCategory} onChange={(e) => setExerciseCategory(e.target.value)}>
                <option value="cardio" className="bg-dark">Cardio / Aerobic Velocity</option>
                <option value="strength" className="bg-dark">Strength / Hypertrophy</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-white-50">Activity Type</Form.Label>
              <Form.Control type="text" className="bg-secondary bg-opacity-10 text-white border-secondary p-2" placeholder="e.g., Running, Bench Press" value={activityType} onChange={(e) => setActivityType(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-white-50">{exerciseCategory === 'cardio' ? 'Duration (Minutes)' : 'Total Sets'}</Form.Label>
              <Form.Control type="number" className="bg-secondary bg-opacity-10 text-white border-secondary p-2" value={durationOrSets} onChange={(e) => setDurationOrSets(e.target.value)} required />
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100 py-2 rounded-3 text-black fw-black" disabled={processingExercise}>
              {processingExercise ? <Spinner animation="border" size="sm" /> : 'Log System Workout'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* REACTIONARY SYSTEM DIALOG ACTION ALERTS */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered contentClassName="bg-dark text-white border-0 rounded-4 mx-3">
        <Modal.Body className="p-4 text-center">
          <div className="text-warning mb-3"><Activity size={40} /></div>
          <p className="mb-4 text-white">{popupMessage}</p>
          <Button variant="outline-warning" className="px-5 rounded-pill" onClick={() => setShowPopup(false)}>Acknowledge</Button>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default HomePage;