import React from 'react';
import { motion } from 'framer-motion';
import { LightningChargeFill } from 'react-bootstrap-icons';

const XPBar = ({ currentXP, level, totalXPRequired }) => {
  const progress = Math.min((currentXP / totalXPRequired) * 100, 100);

  return (
    <div className="xp-container mb-4" style={{ perspective: '1000px' }}>
      <div className="d-flex justify-content-between align-items-end mb-2">
        <h5 className="fw-black text-uppercase m-0" style={{ color: '#ff6600', letterSpacing: '2px' }}>
          Level {level}
        </h5>
        <span className="text-muted small fw-bold">{currentXP} / {totalXPRequired} XP</span>
      </div>

      {/* Main 3D Track */}
      <div style={{
        height: '24px',
        width: '100%',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '3px',
        border: '1px solid rgba(255, 102, 0, 0.2)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Glowing Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff4400, #ff8800)',
            borderRadius: '10px',
            boxShadow: '0 0 15px #ff6600, 0 0 5px #fff',
            position: 'relative'
          }}
        >
          {/* Animated Shine Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />
        </motion.div>
      </div>
      
      <div className="mt-2 small text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '1px' }}>
        <LightningChargeFill className="text-warning me-1" /> 
        {totalXPRequired - currentXP} XP until Level {level + 1}
      </div>
    </div>
  );
};

export default XPBar;