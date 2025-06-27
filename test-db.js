// Test Railway MySQL connection
const mysql = require('mysql2/promise');

const DATABASE_URL = 'mysql://root:TWRVcujEljKPGhGPQsBldRrwGoOudXZP@interchange.proxy.rlwy.net:46988/railway';

async function testConnection() {
  try {
    console.log('Testing Railway MySQL connection...');
    
    // Test with Railway public URL (untuk external access)
    const publicURL = DATABASE_URL.replace('mysql.railway.internal', 'viaduct.proxy.rlwy.net');
    console.log('Using public URL:', publicURL.replace(/:[^:]*@/, ':****@'));
    
    const connection = await mysql.createConnection(publicURL);
    console.log('✅ Database connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log('✅ Categories count:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Try alternative connection string format
    console.log('\nTrying alternative connection...');
    try {
      const altConnection = await mysql.createConnection({
        host: 'viaduct.proxy.rlwy.net',
        user: 'root',
        password: 'TWRVcujEljKPGhGPQsBldRrwGoOudXZP',
        database: 'railway',
        port: 3306,
        ssl: { rejectUnauthorized: false }
      });
      console.log('✅ Alternative connection successful!');
      await altConnection.end();
    } catch (altError) {
      console.error('❌ Alternative connection also failed:', altError.message);
    }
  }
}

testConnection();
