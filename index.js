const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Replace this with your real Mistral API key
const MISTRAL_API_KEY = 'your-mistral-api-key-here';

// Replace with your OB ChatBot Agent ID
const MISTRAL_AGENT_ID = '8HEi3W2CHrrkzhq5BwZ8UnjMgDCu3x2V';

app.use(cors());
app.use(bodyParser.json());

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
    console.error('Error from Mistral API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from chatbot.' });
  }
});

app.listen(port, () => {
  console.log(`OB ChatBot Relay is running on port ${port}`);
});