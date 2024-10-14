const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const client = require("../openAIClient");

const aiScrapeLogic = async (url) => {
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
    $('script, style, iframe').remove();
    const bodyText = $('body').text();
    const chatCompletion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `This is a website content. I want to create a slideshow as a replacement to the website content. 
          - Make 3-4 slides,
          - Make the slides concise and add relevant info use details only from the data given but make it more marketing focused and exciting from the website data given by the user.
          - Dont produce anything that is not in the data given by the user.
          Give output in the json format of: {slides: [...]}`,
        },
        {
          role: "user",
          content: bodyText,
        },
      ],
      response_format: { "type": "json_object" }
    });
    console.log(chatCompletion.choices[0].message.content);
    const res = JSON.parse(chatCompletion.choices[0].message.content);
    const colors = await page.evaluate(() => {
      const getComputedBackgroundColor = (element) => {
        const styles = window.getComputedStyle(element);
        return styles.backgroundColor || styles.color;
      };

      // Get the body background color (usually the primary color)
      const bodyColor = getComputedBackgroundColor(document.body);

      // Get the color of buttons or headers (potential secondary color)
      const primaryElement = document.querySelector('h1, h2, h3, .primary-button');
      const secondaryElement = document.querySelector('h4, h5, h6, .secondary-button');

      const primaryColor = primaryElement ? getComputedBackgroundColor(primaryElement) : null;
      const secondaryColor = secondaryElement ? getComputedBackgroundColor(secondaryElement) : null;

      return {
        bodyColor,
        primaryColor,
        secondaryColor,
      };
    });
    return { res, colors };
  } catch (error) {
    console.error(error);
    throw new Error("Error while scraping");
  } finally {
    await browser.close();
  }
};

module.exports = { aiScrapeLogic };
