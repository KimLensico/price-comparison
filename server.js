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
client.connect()//makes sure express connects to the database and then connects to the port so that express doesnt start collecting requests before it connects to the database
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at: ${PORT}`);
    })
  })
client.on('error', err => console.log(err));

// to make sure server is listening

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


app.post('/results', (req, res) => {
  renderListOfGamesonResultsPage(req, res)
});

//rendering gamesList on homepage
app.get('/results', (req, res) => {
  renderListOfGamesonResultsPage(req, res)
});

app.post('/add-game', resultsPageFormDataHandler)

app.get('/', retrievePopularData);

function resultsPageFormDataHandler(req, res) {
  const { title, thumbnail, steamRating, dealRating, storeID, normalPrice, salePrice } = req.body
  let sql = 'INSERT INTO games (title, thumbnail, game_rating, deal_rating, store_id, normal_price, sale_price) VALUES ($1, $2, $3, $4, $5, $6, $7);';
  //controller / destructuring
  let sqlArr = [title, thumbnail, steamRating, dealRating, storeID, normalPrice, salePrice]
  client.query(sql, sqlArr)//this asks the sql client for the information
    .then(item => {
      res.redirect(`/`)
    })
    .catch(err => console.error(err));
  //request asks postgres
}

function retrievePopularData(req, res) {
  let SQL = 'SELECT * FROM popular_titles;';
  let obj = {}
  client.query(SQL)
    .then(data => {
      obj.popularArray = data.rows;
      SQL = 'SELECT * FROM games;';
      client.query(SQL)
        .then(data => {
          obj.gamesArray = data.rows
          res.render('homepage-view', { obj: obj })
        })
    })
    .catch(err => console.error(err))
}

function renderListOfGamesonResultsPage(req, res) {
  const { query } = req.body;
  let url = `https://www.cheapshark.com/api/1.0/deals?title=${query}`;
  superagent.get(url)
    .then(data => {
      let gamesToBeRendered = data.body;
      let makingAList = gamesToBeRendered.map((game) => (new Games(game)));
      res.render('results-view', { gamesArray: makingAList })
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
  this.salePrice = gamesData.salePrice;
  this.normalPrice = gamesData.normalPrice;
  gamesArray.push(gamesData);
}

//error message
app.get('*', (req, res) => res.status(404).send('nobody is home'));
