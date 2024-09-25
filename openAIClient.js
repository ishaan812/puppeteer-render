const OpenAI = require('openai');

const client = new OpenAI(process.env.OPENAI_API_KEY);

module.exports = client;
