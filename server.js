'use strict';

//server constants
let gamesArray = [];

// require third party dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// setting up front end viewport & configs
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// connecting database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

// to make sure server is listening
app.listen(PORT, () => {
  console.log(`Server is listening at: ${PORT}`);
})

// TESTING BEGIN: to make sure we can grab API data
const testAPI = (req, res) => {
  let url = `https://www.cheapshark.com/api/1.0/deals`;
  superagent.get(url)
    .then(data => res.send(JSON.parse(data.text)))
}

app.get('/test', testAPI);
// TESTING END

app.get('/', (req,res) => {
  RenderListOfGamesonHomepage(req,res)
});

function renderHomepage(req, res) {
  res.render('homepage-view');
}

function RenderListOfGamesonHomepage(req, res) {
  let url = `https://www.cheapshark.com/api/1.0/deals`;
  superagent.get(url)
    .then(data => {
      let gamesToBeRendered = data.body;
      let makingAList = gamesToBeRendered.map((game) => (new Games(game)));
      res.render('homepage-view', { gamesArray : makingAList })
    })
    .catch(err => {
      console.error(err);
      res.render('error-view', { error: err });
    });
}

function Games(gamesData) {
  this.title = gamesData.title;
  this.thumbnail = gamesData.thumb;
  this.steamRating = gamesData.steamRatingPercent;
  this.dealRating = gamesData.dealRating;
  this.storeID = gamesData.storeID;
  gamesArray.push(gamesData);
}

//error message
app.get('*', (req, res) => res.status(404).send('nobody is home'));