const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_AGENT_ID = process.env.MISTRAL_AGENT_ID;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('OB ChatBot Relay is running.');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.mistral.ai/agents/chat',
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

app.listen(port, '0.0.0.0', () => {
  console.log(`OB ChatBot Relay is running on http://0.0.0.0:${port}`);
});
