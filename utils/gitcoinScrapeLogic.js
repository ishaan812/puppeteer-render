
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
require("dotenv").config();

const scrapeLogic = async (url) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
    const data1 = await page.content();

    if (!data1) {
      throw new Error("Failed to load page content");
    }

    const $ = cheerio.load(data1);
    let title = "";
    let currentFundingReceived = "";
    let contributors = "";
    let timeLeft = "";
    let createdOnText = "";
    const textContent = [];
    const hrefs = [];

    const image = $("img.h-32.w-full.object-cover.lg\\:h-80.rounded.md\\:rounded-3xl");
    const src = image.attr("src");
    const alt = image.attr("alt");

    $("*").each((index, element) => {
      const text = $(element).text().trim();
      if (text.startsWith("Created on")) {
        createdOnText = text;
        return false; // Break the loop once found
      }
    });

    $("h1, h2, h3, h4, p").each((index, element) => {
      const content = $(element).text().trim();
      switch (index) {
        case 0:
          currentFundingReceived = content;
          break;
        case 1:
          contributors = content;
          break;
        case 2:
          timeLeft = content;
          break;
        case 3:
          title = content;
          break;
        default:
          textContent.push(content);
      }
    });

    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && (href.includes("github.com") || href.includes("twitter.com"))) {
        hrefs.push(href);
      }
    });

    const data = {
      title,
      currentFundingReceived,
      contributors,
      timeLeft,
      textContent,
      src,
      filteredHrefs: hrefs,
      createdOnText,
    };
    console.log("Data", data);
    return { ...data, url };
  } catch (error) {
    console.error(`Something went wrong while running Puppeteer: ${error}`);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };

