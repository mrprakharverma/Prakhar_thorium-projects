const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://group13:UEEqzwKeluhyT2uM@cluster0.hkvjs.mongodb.net/Prakhar_project2?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})

.then(() => console.log('mongodb is conncected'))
.catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {

    console.log('Express app running on port ' + (process.env.PORT || 3000))

});