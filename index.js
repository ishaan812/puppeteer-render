const express = require("express");
const { scrapeLogic } = require("./gitcoinScrapeLogic");
const { aiScrapeLogic } = require("./aiScrapeLogic");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  const url = req.query.url;
  try {
    const data = await scrapeLogic(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/aiscrape", async (req, res) => {
  const url = req.query.url;
  try {
    const data = await aiScrapeLogic(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
