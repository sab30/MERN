const express = require('express');

const app = express();

// If no port is set by default the port would be 5000
const PORT = process.env.PORT || 5000; 

//Sample endpoint , callback with req, resoponse
app.get('/', (req,res) => res.send('API Running....'));

// PORT, Callback
app.listen(PORT, () =>{
    console.log(`Server started at port : ${PORT}`);
});



