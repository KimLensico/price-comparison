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
// const testAPI = (req, res) => {
//   const {query} = req.body;
//   let url = `https://www.cheapshark.com/api/1.0/deals?title=${query}`
//   superagent.get(url)
//     .then(data=> {
//       let rawData = JSON.parse(data.text);
//       let listOfDeals = rawData.map(game => new Games(game));
//       res.render('results-view', {gamesArray: listOfDeals});
//     })
// }
// app.post('/results', testAPI);
// TESTING END

app.get('/', renderHomepage)

app.post('/results', (req,res) => {
  renderListOfGamesonResultsPage(req,res)
});

function renderHomepage(req, res) {
  res.render('homepage-view');
}

function renderListOfGamesonResultsPage(req, res) {
  const {query} = req.body; // gets query from search bar
  let url = `https://www.cheapshark.com/api/1.0/deals?title=${query}`; // appends serach query to url
  getStoreNameFromID();
  superagent.get(url)
    .then(data => {
      let gamesToBeRendered = data.body;
      let makingAList = gamesToBeRendered.map((game) => (new Games(game)));
      res.render('results-view', { gamesArray : makingAList })
    })
    .catch(err => {
      console.error(err);
      res.render('error-view', { error: err });
    });
}

function getStoreNameFromID() {
  let url = `https://www.cheapshark.com/api/1.0/stores`;
  superagent.get(url)
    .then(data => {
      let rawData = JSON.parse(data.text);
      let sql = `INSERT INTO stores (store_name) VALUES ($1)`;
      rawData.forEach(store => {
        client.query(sql,[store.storeName])
          .then(() => {})
      })
    })
}

app.get('/test', getStoreNameFromID);


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
  gamesArray.push(gamesData);
}

//error message
app.get('*', (req, res) => res.status(404).send('nobody is home'));
