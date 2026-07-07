import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  PersonCircle, 
  TrophyFill, 
  LightningChargeFill, 
  Fire, 
  GeoAltFill, 
  AwardFill,
  ArrowUpRight,
  HexagonFill
} from 'react-bootstrap-icons';
import XPBar from '../components/XPBar'; // Import our new 3D XP Bar

const Profile = () => {
  const user = {
    username: "Alex_Eco",
    level: 12,
    vp: 4250,
    nextLevelVp: 5000,
    rank: "#4",
    streak: 7,
    weight: "75kg",
    height: "180cm",
    location: "Global"
  };

  const achievements = [
    { id: 1, title: "Early Bird", icon: "🌅", color: "#ffc107" },
    { id: 2, title: "Protein King", icon: "🥩", color: "#ff4400" },
    { id: 3, title: "Eco Warrior", icon: "🌱", color: "#00ff88" },
    { id: 4, title: "Pose Master", icon: "🧘", color: "#00d4ff" },
  ];

  return (
    <Container className="py-5">
      {/* --- HERO SECTION (Cyberpunk Style) --- */}
      <Card className="border-0 shadow-lg bg-dark text-white rounded-4 mb-4 overflow-hidden position-relative" 
            style={{ border: '1px solid rgba(255, 102, 0, 0.3)' }}>
        
        {/* Neon Background Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #000 0%, #ff6600 200%)', 
          padding: '60px 0', 
          textAlign: 'center' 
        }}>
          <div className="position-relative d-inline-block">
            <PersonCircle size={110} className="mb-3 border border-4 border-warning rounded-circle shadow" />
            <div className="position-absolute bottom-0 end-0">
               <HexagonFill size={40} className="text-warning" />
               <span className="position-absolute top-50 start-50 translate-middle text-dark fw-black small">
                 {user.level}
               </span>
            </div>
          </div>
          <h2 className="fw-black text-uppercase mb-1 tracking-widest" style={{ letterSpacing: '4px' }}>
            {user.username}
          </h2>
          <p className="small opacity-75 mb-0 text-warning"><GeoAltFill/> {user.location} Elite Athlete</p>
        </div>

        <Card.Body className="px-5 py-4 bg-black">
          {/* Using our custom 3D XP Bar here */}
          <XPBar currentXP={user.vp} level={user.level} totalXPRequired={user.nextLevelVp} />
        </Card.Body>
      </Card>

      {/* --- BENTO BOX STATS --- */}
      <Row className="g-3 mb-4">
        {[
          { icon: <LightningChargeFill size={24}/>, val: user.vp, label: "Total XP", color: "#ff6600" },
          { icon: <TrophyFill size={24}/>, val: user.rank, label: "Global Rank", color: "#ffc107" },
          { icon: <Fire size={24}/>, val: user.streak, label: "Day Streak", color: "#ff4400" },
          { icon: <AwardFill size={24}/>, val: user.weight, label: "Weight", color: "#00d4ff" }
        ].map((stat, idx) => (
          <Col xs={6} md={3} key={idx}>
            <Card className="h-100 border-0 shadow-sm rounded-4 text-center p-3 bg-dark text-white shadow-hover"
                  style={{ border: `1px solid ${stat.color}44` }}>
              <div style={{ color: stat.color }} className="mb-2 mx-auto">{stat.icon}</div>
              <h4 className="fw-bold mb-0">{stat.val}</h4>
              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>{stat.label}</small>
            </Card>
          </Col>
        ))}
      </Row>

      {/* --- ACTIVITY & BADGES --- */}
      <Row className="g-4">
        {/* Weekly Heatmap */}
        <Col md={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-4 bg-dark text-white" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-uppercase tracking-tighter">Vitality Heatmap</h5>
              <small className="text-warning fw-bold">Active <ArrowUpRight/></small>
            </div>
            <div className="d-flex justify-content-between align-items-center px-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center">
                  <div 
                    className={`rounded-3 mb-2 shadow-sm ${i < 5 ? 'bg-warning' : 'bg-secondary'}`} 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      opacity: i === 4 ? 1 : 0.3,
                      boxShadow: i < 5 ? '0 0 15px #ff660066' : 'none' 
                    }}
                  ></div>
                  <small className="text-muted fw-bold">{day}</small>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Achievement Badges */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-4 bg-dark text-white" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <h5 className="fw-bold mb-3 text-uppercase">Trophy Room</h5>
            <div className="d-flex flex-wrap gap-2">
              {achievements.map(badge => (
                <div key={badge.id} 
                     className="p-2 rounded-3 text-center" 
                     style={{ 
                       width: 'calc(50% - 8px)', 
                       backgroundColor: 'rgba(255,255,255,0.05)',
                       border: `1px solid ${badge.color}44` 
                     }}>
                  <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}>{badge.icon}</span>
                  <div className="small fw-bold mt-1 text-white-50" style={{ fontSize: '10px' }}>{badge.title}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;