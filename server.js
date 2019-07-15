const express = require('express');
const connectDB = require('./config/db');


const app = express();

// Connect to DB 

connectDB();

// Init Body parser via express midleware
app.use(express.json({ extended : false }));
 
// If no port is set by default the port would be 5000
const PORT = process.env.PORT || 5000; 

//Sample endpoint , callback with req, resoponse
app.get('/', (req,res) => res.send('API Running....'));

// DEFINE AND ACCESS THE ROUTES
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

// PORT, Callback
app.listen(PORT, () =>{
    console.log(`Server started at port : ${PORT}`);
});



