const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

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



// 
app.get('/loginpage', function(req,res){
    res.render('loginMain')
})





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