import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="app-nav">
          <h1 className="app-title">Teching Admin Panel</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              🏠 Inicio
            </Link>
            <Link to="/dashboard" className="nav-link">
              📊 Dashboard
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/"
            element={
              <div className="welcome-section">
                <h2 className="welcome-title">
                  Bienvenido al Panel de Administración
                </h2>
                <p className="welcome-subtitle">
                  Gestiona y monitorea tu plataforma TechInng desde un solo lugar.
                  Accede a métricas en tiempo real, estadísticas de usuarios y 
                  análisis detallados del sistema.
                </p>
                
                <div className="welcome-features">
                  <div className="feature-item">
                    <div className="feature-icon">👥</div>
                    <div className="feature-title">Usuarios</div>
                    <div className="feature-desc">Gestión completa</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <div className="feature-title">Analytics</div>
                    <div className="feature-desc">Métricas en tiempo real</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔒</div>
                    <div className="feature-title">Seguridad</div>
                    <div className="feature-desc">Control de accesos</div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <div className="feature-title">Rendimiento</div>
                    <div className="feature-desc">Monitoreo del sistema</div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
