const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// User registration endpoint
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    // TODO: Implement user registration logic (e.g., save to database)
    res.status(201).send({ message: 'User registered successfully' });
});

// User authentication endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // TODO: Implement user authentication logic
    res.status(200).send({ message: 'User logged in successfully' });
});

// Brevo email integration
const transporter = nodemailer.createTransport({
    service: 'Brevo', // Use your email service
    auth: {
        user: 'your-email@example.com', // Your email
        pass: 'your-email-password' // Your email password
    }
});

app.post('/send-mail', (req, res) => {
    const { to, subject, text } = req.body;
    const mailOptions = {
        from: 'your-email@example.com',
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send({ message: 'Email sent: ' + info.response });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});