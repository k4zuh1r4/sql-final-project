import express from 'express'

import {getID, addEntry, removeEntry, percentageReport, countryCount } from './DatabaseManager.js';
const app = express();
app.use(express.json()); //middleware to parse JSON data
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
    res.render("homepage.ejs");

});
app.get("/film_list", async (req, res) => {
    const id = req.query.searchTerm;
    const results = await getID(id);
    res.render("index.ejs", {
        resultsOutput: results
    });
}); //root route

app.use(express.static("webfront"))

app.get("/film_list/:id", async (req, res) => {
    const id = req.params.id;
    const results = await getID(id);
    res.render("index.ejs", {
        resultsOutput: results
    });
});


app.get("/percentage", async (req, res) => {
    const results = await percentageReport();
    res.render("stats.ejs", {
        resultsOutput: results
    });
});

app.post("/entry_add", async (req, res) => {
    const {show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description} = req.body;
    const results = await addEntry(show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description);
    res.status(201).send(results); //201 means created.
});

app.get("/leaderboards", async (req, res) => {
    const results = await countryCount();
    res.render("leaderboards.ejs", {
        resultsOutput: results
    });
});
app.post("/entry_remove/:id", async (req, res) => {
    const id = req.params.id;
    const results = await removeEntry(id)
    res.send(results);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("404ErrorPage.ejs");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

