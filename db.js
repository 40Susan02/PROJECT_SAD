const mysql = require('mysql2');

// Database Configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Susan500$!!', // तपाईंको MySQL password यहाँ राख्नुहोस्
    database: 'pandit_sewa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully');
        connection.release();
    }
});

module.exports = promisePool;