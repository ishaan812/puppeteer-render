const express = require("express");
const cron = require("node-cron");
const { scrapeLogic } = require("./utils/gitcoinScrapeLogic");
const { aiScrapeLogic } = require("./utils/aiScrapeLogic");
const { fetchVaultData } = require("./utils/enzymeCronLogic");
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

cron.schedule('*/30 * * * *', async () => {
  try {
    console.log("Running the cron job...");
    const data = await fetchVaultData("0x1b83ba4527c837d462d5b78d65a097dabae5ea89");
    console.log(data);
  } catch (error) {
    console.error("Cron job error:", error.message || error);
  }
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
