import React, { useEffect, useState } from 'react';
import { getMetrics } from '../service/metricsService';
import './Dashboard.css';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = 'TU_TOKEN_AQUI'; // ← reemplaza por uno real
    setLoading(true);
    getMetrics(token)
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando métricas del sistema...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <p className="loading-text">Error al cargar las métricas</p>
        </div>
      </div>
    );
  }

  // Calcular estadísticas adicionales
  const verificationRate = metrics.users?.total ? 
    Math.round((metrics.users.verified / metrics.users.total) * 100) : 0;
  
  const activeRate = metrics.users?.total ? 
    Math.round((metrics.users.active / metrics.users.total) * 100) : 0;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Teching Admin Panel</h1>
        <p className="dashboard-subtitle">Panel de control y métricas del sistema</p>
      </header>

      <div className="dashboard-content">
        <div className="metrics-grid">
          {/* Tarjeta de Usuarios Totales */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">👥</div>
              <h3 className="metric-title">Usuarios Totales</h3>
            </div>
            <div className="metric-value">{metrics.users?.total || 0}</div>
            <p className="metric-description">Total de usuarios registrados</p>
            <div className="metric-trend trend-positive">
              ↗ {activeRate}% activos
            </div>
          </div>

          {/* Tarjeta de Usuarios Verificados */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">✅</div>
              <h3 className="metric-title">Verificados</h3>
            </div>
            <div className="metric-value">{metrics.users?.verified || 0}</div>
            <p className="metric-description">Usuarios con email verificado</p>
            <div className="metric-trend trend-positive">
              ↗ {verificationRate}% del total
            </div>
          </div>

          {/* Tarjeta de Logins Recientes */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">🔐</div>
              <h3 className="metric-title">Logins 24h</h3>
            </div>
            <div className="metric-value">{metrics.authentication?.loginsLast24h || 0}</div>
            <p className="metric-description">Inicios de sesión en las últimas 24 horas</p>
            <div className="metric-trend trend-positive">
              ↗ {metrics.authentication?.totalSuccessfulLogins || 0} total
            </div>
          </div>

          {/* Tarjeta de Tokens Activos */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">🎟️</div>
              <h3 className="metric-title">Tokens Activos</h3>
            </div>
            <div className="metric-value">{metrics.tokens?.active || 0}</div>
            <p className="metric-description">Tokens de acceso válidos</p>
            <div className="metric-trend trend-neutral">
              → {metrics.tokens?.total || 0} emitidos
            </div>
          </div>

          {/* Tarjeta de Sistema */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">⚡</div>
              <h3 className="metric-title">Sistema</h3>
            </div>
            <div className="metric-value">
              {metrics.system?.uptime ? 
                Math.round(metrics.system.uptime / 3600) : 0}h
            </div>
            <p className="metric-description">Tiempo activo del servidor</p>
            <div className="metric-trend trend-positive">
              ↗ Node.js {metrics.system?.nodeVersion || 'N/A'}
            </div>
          </div>

          {/* Tarjeta de Dispositivos */}
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">📱</div>
              <h3 className="metric-title">Dispositivos</h3>
            </div>
            <div className="metric-value">
              {Object.values(metrics.trends?.devices || {}).reduce((a, b) => a + b, 0)}
            </div>
            <p className="metric-description">Dispositivos conectados</p>
            <div className="device-stats">
              <div className="device-stat">
                <div className="device-stat-label">Desktop</div>
                <div className="device-stat-value">{metrics.trends?.devices?.desktop || 0}</div>
              </div>
              <div className="device-stat">
                <div className="device-stat-label">Mobile</div>
                <div className="device-stat-value">{metrics.trends?.devices?.mobile || 0}</div>
              </div>
              <div className="device-stat">
                <div className="device-stat-label">Tablet</div>
                <div className="device-stat-value">{metrics.trends?.devices?.tablet || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de información adicional */}
        <div className="charts-section">
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">📊 Resumen de Autenticación</h3>
              <div className="metrics-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                <div style={{textAlign: 'center'}}>
                  <div className="device-stat-label">Logins Exitosos</div>
                  <div className="device-stat-value" style={{color: '#10b981'}}>
                    {metrics.authentication?.totalSuccessfulLogins || 0}
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div className="device-stat-label">Logins Fallidos</div>
                  <div className="device-stat-value" style={{color: '#ef4444'}}>
                    {metrics.authentication?.failedLogins || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">🎯 Estado de Usuarios</h3>
              <div className="metrics-grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                <div style={{textAlign: 'center'}}>
                  <div className="device-stat-label">No Verificados</div>
                  <div className="device-stat-value" style={{color: '#f59e0b'}}>
                    {metrics.users?.unverified || 0}
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div className="device-stat-label">Tasa Verificación</div>
                  <div className="device-stat-value" style={{color: '#8b5cf6'}}>
                    {verificationRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
