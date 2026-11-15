
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Check environment variables
if (
    !process.env.ADMIN_ID ||
    !process.env.ADMIN_PASSWORD_HASH ||
    !process.env.JWT_SECRET
) {
    throw new Error('Admin authentication environment variables are missing!');
}

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://saltshare-frontend.onrender.com'
    ]
}));

app.use(express.json());

// HOME API
app.get('/', (req, res) => {
    res.send('Welcome to SaltShare Backend!');
});

// TEST DATABASE
app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Database connection failed'
            });
        }

        res.json({
            success: true,
            message: 'SaltShare MySQL connected successfully!'
        });
    });
});

// ADMIN LOGIN API
app.post('/api/admin/login', async (req, res) => {
    try {
        const { adminId, password } = req.body;

        if (!adminId || !password) {
            return res.status(400).json({
                message: 'Admin ID and password are required'
            });
        }

        if (adminId !== process.env.ADMIN_ID) {
            return res.status(401).json({
                message: 'Invalid Admin ID or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid Admin ID or password'
            });
        }

        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Admin login successful!',
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);

        res.status(500).json({
            message: 'Login failed. Please try again.'
        });
    }
});

// ADMIN AUTHENTICATION MIDDLEWARE
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication required. Please login.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        req.admin = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please login again.'
        });
    }
}

// SAVE INVESTOR ENQUIRY
app.post('/api/enquiries', (req, res) => {
    const { full_name, email, phone, message } = req.body;

    if (!full_name || !email || !phone || !message) {
        return res.status(400).json({
            message: 'Please fill in all fields'
        });
    }

    const sql = `
        INSERT INTO investor_enquiries
        (full_name, email, phone, message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [full_name, email, phone, message], (err, result) => {
        if (err) {
            console.error('Enquiry error:', err);

            return res.status(500).json({
                message: 'Failed to save enquiry'
            });
        }

        res.status(201).json({
            message: 'Enquiry saved successfully!',
            id: result.insertId
        });
    });
});

// GET INVESTOR ENQUIRIES (ADMIN ONLY)
app.get('/api/enquiries', verifyAdmin, (req, res) => {
    const sql = `
        SELECT *
        FROM investor_enquiries
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fetch enquiries error:', err);

            return res.status(500).json({
                message: 'Failed to fetch enquiries'
            });
        }

        res.json(results);
    });
});

// SAVE SHARE INTEREST REQUEST (PUBLIC)
app.post('/api/share-requests', (req, res) => {
    const {
        buyer_name,
        email,
        phone,
        shares_requested
    } = req.body;

    if (
        typeof buyer_name !== 'string' ||
        !buyer_name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        typeof phone !== 'string' ||
        !phone.trim() ||
        shares_requested === undefined ||
        shares_requested === null ||
        shares_requested === ''
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all buyer details.'
        });
    }

    const quantity = Number(shares_requested);

    if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100
    ) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid share quantity between 1 and 100.'
        });
    }

    // Demo price only
    const pricePerShare = 20000;
    const totalAmount = quantity * pricePerShare;

    const sql = `
        INSERT INTO share_purchase_requests
        (
            buyer_name,
            email,
            phone,
            shares_requested,
            price_per_share,
            total_amount
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            buyer_name.trim(),
            email.trim(),
            phone.trim(),
            quantity,
            pricePerShare,
            totalAmount
        ],
        (err, result) => {
            if (err) {
                console.error('Share request error:', err);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to save share request.'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Share interest request saved successfully!',
                requestId: result.insertId,
                sharesRequested: quantity,
                pricePerShare,
                totalAmount
            });
        }
    );
});

// GET SHARE REQUESTS (ADMIN ONLY)
app.get('/api/share-requests', verifyAdmin, (req, res) => {
    const sql = `
        SELECT *
        FROM share_purchase_requests
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fetch share requests error:', err);

            return res.status(500).json({
                message: 'Failed to fetch share requests.'
            });
        }

        res.json(results);
    });
});

// UNKNOWN API ROUTES
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// SERVER ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`SaltShare server running on port ${PORT}`);
});
