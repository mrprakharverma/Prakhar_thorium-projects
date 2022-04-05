const express = require ('express');
const app = express();
const route = require('./routes/route');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const multer = require('multer')

app.use (bodyParser.json());
app.use (bodyParser.urlencoded({extended:true}));
app.use(multer().any())
mongoose.connect("mongodb+srv://group13:UEEqzwKeluhyT2uM@cluster0.hkvjs.mongodb.net/Prakhar_project3?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})
.then(() => console.log("mongoDB is running on port 3000"))
.catch(err=> console.log(err))
app.use('/',route);
app.listen(process.env.PORT || 3000, function(){
    console.log('express app running on port'+(process.env.PORT || 3000))
});