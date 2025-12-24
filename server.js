const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Pandit Sewa API is running',
        timestamp: new Date().toISOString()
    });
});

// Get all pandits with user details
app.get('/api/pandits', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                u.name,
                u.email,
                u.phone,
                p.expertise,
                p.experience,
                p.rating,
                p.fee,
                p.image_url,
                p.bio,
                p.available
            FROM pandits p
            INNER JOIN users u ON p.user_id = u.id
            WHERE p.available = TRUE
            ORDER BY p.rating DESC
        `);
        
        res.json({ 
            success: true, 
            data: rows,
            count: rows.length
        });
    } catch (error) {
        console.error('Error fetching pandits:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch pandits',
            error: error.message 
        });
    }
});

// Get single pandit by ID
app.get('/api/pandits/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                u.name,
                u.email,
                u.phone,
                p.expertise,
                p.experience,
                p.rating,
                p.fee,
                p.image_url,
                p.bio,
                p.available
            FROM pandits p
            INNER JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pandit not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: rows[0] 
        });
    } catch (error) {
        console.error('Error fetching pandit:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch pandit',
            error: error.message 
        });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { 
            customer_name,
            customer_phone,
            pandit_id, 
            puja_type, 
            puja_date, 
            puja_time, 
            location,
            notes
        } = req.body;
        
        // Validate required fields
        if (!customer_name || !customer_phone || !pandit_id || !puja_type || !puja_date || !puja_time || !location) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Check if customer exists, if not create
        let [customerRows] = await db.query(
            'SELECT id FROM users WHERE phone = ? AND role = "customer"',
            [customer_phone]
        );
        
        let customer_id;
        
        if (customerRows.length === 0) {
            // Create new customer
            const [customerResult] = await db.query(
                'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [customer_name, customer_phone, `${customer_phone}@temp.com`, 'temp_password', 'customer']
            );
            customer_id = customerResult.insertId;
        } else {
            customer_id = customerRows[0].id;
        }
        
        // Get pandit fee
        const [panditRows] = await db.query('SELECT fee FROM pandits WHERE id = ?', [pandit_id]);
        const total_amount = panditRows.length > 0 ? panditRows[0].fee : 5000;
        
        // Create booking
        const [result] = await db.query(
            `INSERT INTO bookings 
            (customer_id, pandit_id, puja_type, puja_date, puja_time, location, total_amount, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_id, pandit_id, puja_type, puja_date, puja_time, location, total_amount, notes || '', 'confirmed']
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Booking created successfully',
            booking_id: result.insertId,
            total_amount: total_amount
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create booking',
            error: error.message 
        });
    }
});

// Get booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                pu.name as pandit_name,
                pu.phone as pandit_phone,
                p.expertise as pandit_expertise
            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN pandits p ON b.pandit_id = p.id
            INNER JOIN users pu ON p.user_id = pu.id
            WHERE b.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: rows[0] 
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch booking',
            error: error.message 
        });
    }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                b.*,
                u.name as customer_name,
                pu.name as pandit_name
            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN pandits p ON b.pandit_id = p.id
            INNER JOIN users pu ON p.user_id = pu.id
            ORDER BY b.created_at DESC
        `);
        
        res.json({ 
            success: true, 
            data: rows,
            count: rows.length
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookings',
            error: error.message 
        });
    }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'assigned', 'on_the_way', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status' 
            });
        }
        
        const [result] = await db.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update status',
            error: error.message 
        });
    }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM bookings WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Booking not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Booking deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete booking',
            error: error.message 
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🕉️  Pandit Sewa API Server        ║
║   🚀 Running on port ${PORT}            ║
║   📍 http://localhost:${PORT}          ║
╚═══════════════════════════════════════╝
    `);
});