import { userChatbot } from '../../lib/agents/userChatbot';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, action } = req.body;
      
      if (action === 'generate') {
        const analysisResult = await userChatbot.analyzeRequirements();
        if (analysisResult.readyToCreate) {
          const poster = await userChatbot.createPoster(analysisResult.requirements);
          res.status(200).json({ poster, message: "Poster created successfully!" });
        } else {
          res.status(400).json({ error: "Not enough information to create a poster yet." });
        }
      } else {
        const chatResponse = await userChatbot.chat(message);
        res.status(200).json(chatResponse);
      }
    } catch (error) {
      console.error('Error in chat API:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}