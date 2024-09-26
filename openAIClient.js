const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // API key from the environment variable
});

module.exports = client;
