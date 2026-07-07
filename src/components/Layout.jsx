import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { 
  BellFill, Gear, BoxArrowRight, HouseFill, CameraFill, 
  PlayBtn, LightningFill, GridFill, ExclamationTriangleFill, 
  CheckCircleFill, Activity 
} from 'react-bootstrap-icons';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Notifications System State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', text: 'Welcome back! Target metrics have been calibrated for today.', time: 'Just now', unread: true },
    { id: 2, type: 'success', text: 'Telemetry sync with your AI Coaching profile is optimal.', time: '10m ago', unread: false }
  ]);

  const theme = { bg: '#0a0a0b', card: '#1a1b1e', orange: '#ff6b00', dock: '#161618' };
  const isActive = (path) => location.pathname === path;
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Notification Flyout Markup
  const notificationPopover = (
    <Popover id="notification-ledger" style={{ background: '#141517', border: '1px solid #2d2e33', borderRadius: '16px', width: '320px', zIndex: 1050 }} className="shadow-2xl">
      <Popover.Header className="bg-transparent border-bottom border-secondary border-opacity-20 text-white d-flex justify-content-between align-items-center py-3 px-3">
        <strong className="text-uppercase tracking-wider font-monospace" style={{ fontSize: '11px', color: theme.orange }}>System Notifications</strong>
        {unreadCount > 0 && (
          <Button variant="link" className="p-0 text-white-50 small font-monospace text-decoration-none" style={{ fontSize: '10px' }} onClick={markAllNotificationsRead}>
            Clear Badge
          </Button>
        )}
      </Popover.Header>
      <Popover.Body className="p-0" style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-white-50 font-monospace small">// NO INCOMING MESSAGES</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-3 border-bottom border-secondary border-opacity-10 d-flex gap-3 position-relative" style={{ backgroundColor: n.unread ? 'rgba(255, 107, 0, 0.04)' : 'transparent' }}>
              <div className="mt-1 flex-shrink-0">
                {n.type === 'danger' ? <ExclamationTriangleFill className="text-danger" size={14} /> : n.type === 'success' ? <CheckCircleFill className="text-success" size={14} /> : <Activity className="text-info" size={14} />}
              </div>
              <div className="w-100">
                <p className="m-0 text-white small" style={{ lineHeight: '1.4', fontSize: '12px' }}>{n.text}</p>
                <small className="text-white-50 font-monospace d-block mt-1" style={{ fontSize: '9px' }}>{n.time}</small>
              </div>
              {n.unread && (
                <span className="position-absolute rounded-circle bg-warning" style={{ width: '6px', height: '6px', top: '15px', right: '15px' }}></span>
              )}
            </div>
          ))
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', display: 'flex', color: 'white', overflowX: 'hidden' }}>
      
      {/* GLOBAL SIDEBAR DOCK */}
      <div className="d-none d-md-flex" style={{ width: '90px', backgroundColor: theme.dock, flexDirection: 'column', alignItems: 'center', padding: '25px 0', borderRight: '1px solid #222', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div className="mb-5 text-center w-100 d-flex flex-column align-items-center" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div style={{ background: theme.orange, width: '45px', height: '45px', borderRadius: '12px' }} className="d-flex align-items-center justify-content-center shadow-lg">
            <LightningFill size={25} color="black" />
          </div>
          <small className="fw-black mt-2 d-block" style={{ fontSize: '10px', color: theme.orange, letterSpacing: '1px' }}>ECO FIT</small>
        </div>
        
        <div className="d-flex flex-column align-items-center gap-5 mt-4 opacity-50 w-100">
          <HouseFill size={22} onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: isActive('/dashboard') ? theme.orange : 'white', opacity: isActive('/dashboard') ? 1 : 0.6 }} />
          <CameraFill size={22} onClick={() => navigate('/food-analysis')} style={{ cursor: 'pointer', color: isActive('/food-analysis') ? theme.orange : 'white', opacity: isActive('/food-analysis') ? 1 : 0.6 }} title="AI Food Scanner" />
          <PlayBtn size={22} onClick={() => navigate('/workouts')} style={{ cursor: 'pointer', color: isActive('/workouts') ? theme.orange : 'white', opacity: isActive('/workouts') ? 1 : 0.6 }} />
          <LightningFill size={22} onClick={() => navigate('/coach')} style={{ cursor: 'pointer', color: isActive('/coach') ? theme.orange : 'white', opacity: isActive('/coach') ? 1 : 0.6 }} /> 
          <GridFill size={22} onClick={() => navigate('/more')} style={{ cursor: 'pointer', color: isActive('/more') ? theme.orange : 'white', opacity: isActive('/more') ? 1 : 0.6 }} />
        </div>
        
        <div className="mt-auto opacity-25 d-flex justify-content-center w-100" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ cursor: 'pointer' }}>
          <BoxArrowRight size={22} />
        </div>
      </div>

      {/* GLOBAL BODY CONTAINER CONTAINER */}
      <div style={{ flex: 1 }} className="ms-0 ms-md-5 ps-0 ps-md-4 d-flex flex-column min-vh-100">
        
        {/* APP RUNTIME HEADERS */}
        <header className="p-4 px-3 px-sm-5 d-flex flex-row justify-content-between align-items-center gap-3 w-100">
          <div className="d-flex flex-row align-items-center justify-content-start gap-3 gap-sm-4 fw-bold small text-uppercase tracking-wider flex-wrap w-100 text-nowrap">
            <span className={isActive('/dashboard') ? "text-white border-bottom border-warning border-3 pb-2" : "text-white-50"} style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>ECO FIT DASHBOARD</span>
            <span className={isActive('/workouts') ? "text-white border-bottom border-warning border-3 pb-2" : "text-white-50"} style={{ cursor: 'pointer' }} onClick={() => navigate('/workouts')}>WORKOUTS</span>
            <span className={isActive('/coach') ? "text-white border-bottom border-warning border-3 pb-2" : "text-white-50"} style={{ cursor: 'pointer' }} onClick={() => navigate('/coach')}>AI COACH</span>
            <span className={isActive('/scanner') ? "text-white border-bottom border-warning border-3 pb-2" : "text-white-50"} style={{ cursor: 'pointer' }} onClick={() => navigate('/scanner')}>AI POSE TRACKER</span>
            <span className={isActive('/food-analysis') ? "text-white border-bottom border-warning border-3 pb-2" : "text-white-50"} style={{ cursor: 'pointer' }} onClick={() => navigate('/food-analysis')}>AI FOOD SCANNER</span>
          </div>
          
          <div className="d-flex gap-3 gap-sm-4 align-items-center ms-auto">
             <OverlayTrigger trigger="click" placement="bottom-end" overlay={notificationPopover} rootClose>
               <div className="position-relative" style={{ cursor: 'pointer' }}>
                 <BellFill size={20} className={unreadCount > 0 ? "text-white" : "text-white-50"} />
                 {unreadCount > 0 && (
                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning d-flex align-items-center justify-content-center" style={{ fontSize: '8px', width: '14px', height: '14px', padding: '0', marginTop: '-2px' }}>
                     {unreadCount}
                   </span>
                 )}
               </div>
             </OverlayTrigger>

             <Gear size={20} className="text-white-50" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} />
             <BoxArrowRight size={20} className="text-white-50 d-block d-md-none" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ cursor: 'pointer' }} />
          </div>
        </header>

        <main className="flex-grow-1">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;