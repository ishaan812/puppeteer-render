import OpenAI from 'openai';

const client = new OpenAI(process.env.OPENAI_API_KEY);

export default client;
