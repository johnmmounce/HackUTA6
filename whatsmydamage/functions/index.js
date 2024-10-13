const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');

// Cloud Function to handle API call
exports.getChatResponse = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    try {
      // Make the call to OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Replace with your actual OpenAI API key
            'Content-Type': 'application/json',
          }
        }
      );

      // Respond with the result from OpenAI API
      res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch response from OpenAI.' });
    }
  });
});
