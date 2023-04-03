// Import all dependencies
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');  //router
const app = express();
const path = require('path');
const multer = require('multer');
const compression = require('compression');
app.use(cors());
app.use(compression());

//Config env file & require connection file
dotenv.config({ path: './config.env' });
require('./db/conn');
const port = process.env.PORT;

//Require Model
const G1db = require('./models/G1Schema');
const G2db = require('./models/G2Schema');
const Gdb = require('./models/GSchema');

//Middlewares
const authenticate = require('./middleware/authenticate');
const adminAuthenticate = require('./middleware/adminAuthenticate');
const userData = require('./middleware/userData');
const G1Data = require('./middleware/G1Data');
const G2Data = require('./middleware/G2Data');
const GData = require('./middleware/GData');
const showImg = require('./middleware/showImg');
const Subscription = require('./middleware/Subscription');

// const { Code } = require('mongodb'); //grouterroute


//Router routes
const P1Route = require('./routes/P1Route');
const P2Route = require('./routes/P2Route');
const E1Route = require('./routes/Exam1Route');
const E2Route = require('./routes/Exam2Route');
const E3Route = require('./routes/Exam3Route');
const g1FinalTestRoute = require('./routes/g1FinalTestRoute');
const userAuthRoute = require('./routes/userAuthRoute');
const Subscriptions = require('./models/subscriptions');

app.use('/register', userAuthRoute);
app.use('/admin', userAuthRoute);
app.use('/login', userAuthRoute);
app.use('/message', userAuthRoute);
app.use('/logout', userAuthRoute);
app.use('/forgot-password', userAuthRoute);
app.use('/Resetpassword', userAuthRoute);
app.use('/P1', P1Route);
app.use('/P2', P2Route);
app.use('/E1', E1Route);
app.use('/E2', E2Route);
app.use('/E3', E3Route);
app.use('/FinalAd', g1FinalTestRoute);

// These mehtods are used to get data and cookies from front-end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname , 'public'),{
    maxAge: 31536000, //cache for a year
    etag: false,   //disabel etag(weak cache) for better performance
    lastModified: false //disable it for better performance
}));

// app.use('/', rootRoute);
app.get('/', (req, res) => {
    //Dynamic content will be set to cache headers for resoponse.
    res.set('Cache-Control' , 'public, max-age=3600'); //cache for 1 hour

    //generate and send json response
    const data = {/*...*/};
    res.json(data);

    res.sendFile(path.join(__dirname , 'public' , 'index.html'));
})
//In order to check the cached version of static file
//To server current files only
//read version number from file 
const fs = require('fs');
const version = fs.readFileSync('./public/version.txt', 'utf-8').trim();
//serve versioned css file
app.get('/styles.css', (req,res)=>{
    res.sendFile(path.join(__dirname,'public', `styles.${version}.css`));
});

//Get Images
app.get('/showImages', showImg, (req, res) => {

})
//User details
app.get('/userData', userData, (req,res)=>{

})
//G1
app.put('/G1Update', async (req, res) => {
    try {
        const name = "G1";
        const id = req.body.id;
        await G1db.findByIdAndUpdate(id, {
            G1Overview: req.body.G1Overview,
            P1 : req.body.P1,
            P2 : req.body.P2,
            Exam1 : req.body.Exam1,
            Exam2 : req.body.Exam2,
            Exam3 : req.body.Exam3,
            Final : req.body.Final,
        })
        // res.redirect(localStorage.getItem('lastUrl'));
        res.status(200);
        
    } catch (error) {
        res.status(400).send(error);
    }
})
//G2
app.put('/G2Update', async (req, res) => {
    try {
        const name = "G2";
        const id = req.body.id;
        await G2db.findByIdAndUpdate(id, {
            G2Overview: req.body.G2Overview,
        })
        res.status(200);
    } catch (error) {
        res.status(400).send(error);
    }
})
//G
app.put('/GUpdate', async (req, res) => {
    try {
        const name = "G";
        const id = req.body.id;
        await Gdb.findByIdAndUpdate(id, {
            GOverview: req.body.GOverview
        })
        res.status(200);
        
    } catch (error) {
        res.status(400).send(error);
    }
})

//G1data
app.get('/G1Data', G1Data, (req, res) => {})

//G2data
app.get('/G2Data', G2Data, (req, res) => {})

//Gdata
app.get('/GData', GData, (req, res) => {})

//Authentication
app.get('/auth', authenticate, (req, res) => {})

//Admin Auth
app.get('/adminAuth', adminAuthenticate, (req, res) => {})

//Post Admin Dashboard
app.post('/adminDashboard', (req, res) => { res.redirect('./adminDashboard'); })

//Subscriptions
app.post('/subscribe', Subscription , (req,res)=>{})

//Handle the wrong routes 
app.use('/*' , (req,res) =>{
    res.sendFile(path.join(__dirname , 'public' , 'index.html'));
});

// Run Server
app.listen(port, () => {
    console.log(`server listening at ${port}`);
})