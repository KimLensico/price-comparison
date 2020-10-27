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
  let url = `https://www.cheapshark.com/api/1.0/deals?title=grand-theft-auto-v`;
  superagent.get(url)
    .then(data => res.send(JSON.parse(data.text)))
}

app.get('/test', testAPI);
// TESTING END

app.get('/', renderHomepage)

app.get('/results', (req,res) => {
  renderListOfGamesonResultsPage(req,res)
});
app.post('/', resultsPageFormDataHandler)
function renderHomepage(req, res) {
  res.render('homepage-view');
}

function resultsPageFormDataHandler(req, res) {
  const { title, thumbnail, steamRating, dealRating, storeID } = req.body
  let sql = 'INSERT INTO games (title, thumbnail, steamRating, dealRating, storeID) VALUES ($1, $2, $3, $4, $5) RETURNING id;'
  //controller / destructuring
  let sqlArr = [ title, thumbnail, steamRating, dealRating, storeID ];

  client.query(sql, sqlArr)//this asks the sql client for the information
  console.log(client.query, sql, sqlArr[1]);
  //request asks postgres
}

function renderListOfGamesonResultsPage(req, res) {
  console.log(req.body);
  let query =`?title=${req.body}`;
  let url = `https://www.cheapshark.com/api/1.0/deals${query}`;
  superagent.get(url)
    .then(data => {
      let gamesToBeRendered = data.body;
      let makingAList = gamesToBeRendered.map((game) => (new Games(game)));
      console.log(makingAList);
      res.render('results-view', { gamesArray : makingAList })
    })
    .catch(err => {
      console.error(err);
      res.render('error-view', { error: err });
    });
}
app.get('/results', renderResultsView)

function renderResultsView(req, res) {
  res.render('results-view')
}

function Games(gamesData) {
  this.title = gamesData.title;
  this.thumbnail = gamesData.thumb;
  this.steamRating = gamesData.steamRatingPercent;
  this.dealRating = gamesData.dealRating;
  this.storeID = gamesData.storeID;
  this.salePrice = gamesData.salePrice;
  this.normalPrice = gamesData.normalPrice;
  gamesArray.push(gamesData);
}

//error message
app.get('*', (req, res) => res.status(404).send('nobody is home'));
