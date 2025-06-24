require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY?.trim();
const MISTRAL_AGENT_ID = process.env.MISTRAL_AGENT_ID?.trim();

if (!MISTRAL_API_KEY || !MISTRAL_AGENT_ID) {
  console.error('❌ Missing MISTRAL_API_KEY or MISTRAL_AGENT_ID. Check your environment variables.');
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).send('✅ OB ChatBot Relay is healthy.');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('📨 Received message:', userMessage);
  console.log('🔐 Using Agent ID:', MISTRAL_AGENT_ID);

  try {
    const response = await axios.post(
  'https://api.mistral.ai/v1/chat/agent',
  {
    agent_id: MISTRAL_AGENT_ID,
    messages: [{ role: 'user', content: userMessage }]
  },
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('❌ Mistral API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from chatbot.' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`✅ OB ChatBot Relay is running at http://${HOST}:${PORT}`);
});

app.get('/health', (req, res) => {
  res.status(200).send('✅ OB ChatBot Relay is healthy.');
});
