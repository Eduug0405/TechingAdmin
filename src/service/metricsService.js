import axios from 'axios';

// En desarrollo, usa el proxy configurado en setupProxy.js
const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://teching.tech';

// Datos de prueba para desarrollo (como fallback)
const mockMetrics = {
  users: {
    total: 1250,
    verified: 980,
    active: 750
  },
  authentication: {
    loginsLast24h: 125,
    totalSessions: 890
  },
  trends: {
    devices: {
      desktop: 65,
      mobile: 30,
      tablet: 5
    },
    growth: {
      weekly: 12.5,
      monthly: 8.3
    }
  }
};

// Función para probar la conectividad del servidor
export const testServerConnection = async () => {
  try {
    console.log('🔍 Probando conectividad con:', 'https://teching.tech');
    const res = await axios.get('https://teching.tech', { timeout: 5000 });
    console.log('✅ Servidor responde:', res.status);
    return true;
  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
    return false;
  }
};

// Función para explorar endpoints disponibles
export const testAPIEndpoints = async (token) => {
  const endpoints = [
    '/auth/metrics',
    '/api/auth/metrics', 
    '/metrics',
    '/api/metrics',
    '/admin/metrics',
    '/dashboard/metrics'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `https://teching.tech${endpoint}`;
      console.log(`🔍 Probando endpoint: ${url}`);
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      
      console.log(`✅ Endpoint funciona: ${endpoint} - Status: ${res.status}`);
      return { endpoint, data: res.data };
      
    } catch (error) {
      console.log(`❌ Endpoint falló: ${endpoint} - ${error.response?.status || error.message}`);
    }
  }
  
  return null;
};

export const getMetrics = async (token) => {
  try {
    const url = `${BASE_URL}/auth/metrics`;
    console.log('🌐 Intentando conectar a la API real:', url);
    console.log('🔑 Token:', token ? 'Token presente' : 'Token faltante');
    console.log('🏠 BASE_URL:', BASE_URL);
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('✅ Datos obtenidos de la API real:', res.data);
    return res.data;
    
  } catch (error) {
    console.error('❌ Error al obtener métricas de la API:', error.message);
    console.error('📊 Status:', error.response?.status);
    console.error('📝 Response data:', error.response?.data);
    console.error('🔗 URL que falló:', error.config?.url);
    
    // Si falla la API en desarrollo, usa datos de prueba como fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Usando datos de prueba como fallback en desarrollo');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMetrics;
    }
    
    // En producción, re-lanza el error
    throw error;
  }
};
