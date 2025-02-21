require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');


app.use(session({
  secret: 'bac13156adadw',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

app.use('/product', productRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);



//  login page  code
mongoose.connect('mongodb+srv://vijaykumar:vijaykumar123@varunaejs.5ruts.mongodb.net/?retryWrites=true&w=majority&appName=varunaejs')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', function (req, res) {
    res.render('index');
})
app.get('/aboutVaruna', function(req,res){
    res.render('aboutVaruna')
})
app.get('/aboutCompany', function(req,res){
    res.render('aboutCompany')
})
app.get('/bod', function(req,res){
    res.render('bod')
})
app.get('/milestone', function(req,res){
    res.render('milestone')
})
app.get('/infrastructure', function(req,res){
    res.render('infrastructure')
})
app.get('/companyPolicy', function(req,res){
    res.render('companyPolicy')
})
app.get('/qualityPolicy', function(req,res){
    res.render('qualityPolicy')
})




// product links / route is not available now coming soon



app.get('/agriculture', function(req,res){
    res.render('agriculture')
})
app.get('/commercial', function(req,res){
    res.render('commercial')
})
app.get('/domesticResidental', function(req,res){
    res.render('domesticResidental')
})
app.get('/industrial', function(req,res){
    res.render('industrial')
})
app.get('/solar', function(req,res){
    res.render('solar')
})




app.get('/career', function(req,res){
    res.render('career')
})
app.get('/jobOpenings', function(req,res){
    res.render('jobOpenings')
})
app.get('/purchaseExcecutive', function(req,res){
    res.render('purchaseExcecutive')
})
app.get('/executive', function(req,res){
    res.render('executive')
})
app.get('/branchManager', function(req,res){
    res.render('branchManager')
})
app.get('/areaSalesManager', function(req,res){
    res.render('areaSalesManager')
})
app.get('/lifeAtVaruna', function(req,res){
    res.render('lifeAtVaruna')
})





app.get('/media', function(req,res){
    res.render('media')
})
app.get('/events', function(req,res){
    res.render('events')
})
app.get('/news', function(req,res){
    res.render('news')
})
app.get('/launchOptiqua', function(req,res){
    res.render('launchOptiqua')
})
app.get('/gallery', function(req,res){
    res.render('gallery')
})


const authMiddleware = async (req, res, next) => {
  try {
    const { email } = req.cookies;

    if (!email) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (user.role !== requiredRole) {
      return res.send('Something went wrong');
    }

    next();
  };
};

app.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.cookie('email', email, { httpOnly: true });

    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else if (user.role === 'crm') {
      return res.redirect('/crm');
    } else if (user.role === 'ce') {
      return res.redirect('/ce');
    } else {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/crm', authMiddleware, roleMiddleware('crm'), (req, res) => {
  res.render("crm");
});

app.get('/ce', authMiddleware, roleMiddleware('ce'), (req, res) => {
  res.render("ce");
});

// login page code ended here



app.get('/csr', function(req,res){
    res.render('csr')
})



app.get('/suggestion', function(req,res){
    res.render('suggestion')
})



app.get('/contact', function(req,res){
    res.render('contact')
})
app.get('/address', function(req,res){
    res.render('address')
})
app.get('/serviceCenter', function(req,res){
    res.render('serviceCenter')
})
app.get('/complaintForm', function(req,res){
    res.render('complaintForm')
})
app.get('/warrantyRegistration', function(req,res){
    res.render('warrantyRegistration')
})
app.get('/writeToUs', function(req,res){
    res.render('writeToUs')
})
app.get('/globalHead', function(req,res){
    res.render('globalHead')
})




app.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server is running on port 3000');
    }
});