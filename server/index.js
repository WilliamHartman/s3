const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const massive = require('massive');
const ctrl = require(`./controllers/controller`);
const cron = require('cron');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const port = 8088;


//middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + './../build'));
app.use(morgan('dev'));

 
//Connection to Azure DB
massive({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
  .then((db) => {
    console.log('Connected to Heroku PostgreSQL Database');
    app.set('db', db);
  })
  .catch((err) => console.log(err));

//Starts the cron job for auto emailing
var cronJob = require('./controllers/cron_controller')(cron, app);


//endpoints
app.get(`/api/test`, ctrl.test);
app.get(`/api/getPlayers`, ctrl.getPlayers)
app.post(`/api/addPlayer`, ctrl.addPlayer)
app.post(`/api/deletePlayer`, ctrl.deletePlayer)
app.get(`/api/getScrimDates`, ctrl.getScrimDates)
app.get(`/api/getTeams`, ctrl.getTeams)
app.get(`/api/getNewTeams`, ctrl.getNewTeams)

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});