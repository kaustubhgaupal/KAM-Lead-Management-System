const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const usersRouter = require('./routes/users'); 
const leadsRouter = require('./routes/leads'); 
const contactsRouter = require('./routes/contacts'); 
const interactionsRouter = require('./routes/interactions'); 
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const dashboardRoutes = require('./routes/dashboard');
require('dotenv').config({ path: '../.env' });





const methodOverride = require('method-override');


const app = express();
const port = 5000; 

// Connect to the database
connectDB();

// Middleware to serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(cookieParser());


// Middleware to parse incoming request bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Path to views directory




// Enable CORS
app.use(cors());
app.get('/', (req, res) => {
    res.render('index',{
        title: 'Login - MyApp' 
    }); // Render index.ejs
});
// Define the routers
app.use('/users', usersRouter);
app.use('/leads', leadsRouter);
app.use('/contacts', contactsRouter);
app.use('/interactions', interactionsRouter);
app.use('/dashboard', dashboardRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
