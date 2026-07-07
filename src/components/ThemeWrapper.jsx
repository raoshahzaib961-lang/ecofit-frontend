import React from 'react';
import { createGlobalStyle } from 'styled-components';

const CyberTheme = createGlobalStyle`
  :root {
    --neon-orange: #ff6600;
    --dark-bg: #0a0a0a;
    --glass-bg: rgba(20, 20, 20, 0.8);
  }

  body {
    background-color: var(--dark-bg) !important;
    color: #ffffff !important;
    font-family: 'Inter', sans-serif;
  }

  /* 3D Glass Card Effect */
  .card, .modal-content {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 102, 0, 0.3) !important;
    border-radius: 20px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 
                inset 0 0 15px rgba(255, 102, 0, 0.05) !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }

  .card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 0 25px rgba(255, 102, 0, 0.4) !important;
    border: 1px solid var(--neon-orange) !important;
  }

  /* Neon Orange Buttons */
  .btn-success, .btn-primary {
    background: linear-gradient(45deg, #ff6600, #ff4400) !important;
    border: none !important;
    box-shadow: 0 0 15px rgba(255, 102, 0, 0.4) !important;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 1px;
  }

  /* Sidebar 3D Glow */
  nav, .sidebar {
    background: rgba(0, 0, 0, 0.9) !important;
    border-right: 2px solid var(--neon-orange) !important;
    box-shadow: 5px 0 20px rgba(255, 102, 0, 0.2);
  }

  /* Text Glow */
  h1, h2, h3 {
    text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
  }
`;

const ThemeWrapper = ({ children }) => {
  return (
    <>
      <CyberTheme />
      {children}
    </>
  );
};

export default ThemeWrapper;