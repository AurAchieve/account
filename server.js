require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client, Account } = require('node-appwrite');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID);

// API endpoint to complete password reset
app.post('/api/reset-password', async (req, res) => {
    const { userId, secret, password, passwordConfirm } = req.body;

    // Validation
    if (!userId || !secret || !password || !passwordConfirm) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing required fields' 
        });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({ 
            success: false, 
            message: 'Passwords do not match' 
        });
    }

    if (password.length < 8) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 8 characters long' 
        });
    }

    try {
        const account = new Account(client);
        
        // Complete password recovery
        await account.updateRecovery(userId, secret, password, passwordConfirm);
        
        res.json({ 
            success: true, 
            message: 'Password reset successful! You can now log in with your new password.' 
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Failed to reset password. The link may be invalid or expired.' 
        });
    }
});

// Serve the password reset page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Password reset server running on http://localhost:${PORT}`);
});
