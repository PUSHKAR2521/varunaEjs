require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const products = require('./routes/products');
const crmRoutes = require('./routes/crmRoutes');  // New CRM Routes
const ceRoutes = require('./routes/ceRoutes');    // New CE Routes
const suggestionRoutes = require('./routes/suggestion'); // Ensure the correct path
const { authenticateUser, authorizeRole } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(session({
    secret: 'bac13156adadw',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/auth/crm', crmRoutes);  // CRM Routes
app.use('/auth/ce', ceRoutes);    // CE Routes
app.use('/product', products);    // CE Routes
app.use('/', suggestionRoutes); // Ensure this line is present

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Home Page
app.get('/', (req, res) => res.render('index'));



app.get('/aboutVaruna', function (req, res) {
    res.render('aboutVaruna')
})
app.get('/aboutCompany', function (req, res) {
    res.render('aboutCompany')
})
app.get('/bod', function (req, res) {
    res.render('bod')
})
app.get('/milestone', function (req, res) {
    res.render('milestone')
})
app.get('/infrastructure', function (req, res) {
    res.render('infrastructure')
})
app.get('/companyPolicy', function (req, res) {
    res.render('companyPolicy')
})
app.get('/qualityPolicy', function (req, res) {
    res.render('qualityPolicy')
})



app.get('/agriculture', function (req, res) {
    res.render('agriculture')
})
app.get('/commercial', function (req, res) {
    res.render('commercial')
})
app.get('/domesticResidental', function (req, res) {
    res.render('domesticResidental')
})
app.get('/industrial', function (req, res) {
    res.render('industrial')
})
app.get('/solar', function (req, res) {
    res.render('solar')
})

app.get('/career', function (req, res) {
    res.render('career')
})
app.get('/jobOpenings', function (req, res) {
    res.render('jobOpenings')
})
app.get('/purchaseExcecutive', function (req, res) {
    res.render('purchaseExcecutive')
})
app.get('/executive', function (req, res) {
    res.render('executive')
})
app.get('/branchManager', function (req, res) {
    res.render('branchManager')
})
app.get('/areaSalesManager', function (req, res) {
    res.render('areaSalesManager')
})
app.get('/lifeAtVaruna', function (req, res) {
    res.render('lifeAtVaruna')
})





app.get('/media', function (req, res) {
    res.render('media')
})
app.get('/events', function (req, res) {
    res.render('events')
})
app.get('/news', function (req, res) {
    res.render('news')
})
app.get('/launchOptiqua', function (req, res) {
    res.render('launchOptiqua')
})
app.get('/gallery', function (req, res) {
    res.render('gallery')
})

app.get('/csr', function (req, res) {
    res.render('csr')
})

app.get('/contact', function (req, res) {
    res.render('contact')
})
app.get('/address', function (req, res) {
    res.render('address')
})
app.get('/serviceCenter', function (req, res) {
    res.render('serviceCenter')
})
app.get('/complaintForm', function (req, res) {
    res.render('complaintForm')
})
app.get('/warrantyRegistration', function (req, res) {
    res.render('warrantyRegistration')
})
app.get('/writeToUs', function (req, res) {
    res.render('writeToUs')
})
app.get('/globalHead', function (req, res) {
    res.render('globalHead')
})

app.get('/suggestion', (req, res) => res.render('suggestion'));



app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server is running on port 3000');
    }
});