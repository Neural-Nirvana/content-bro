import { userChatbot } from '../../lib/agents/userChatbot';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { requirements } = req.body;
      const poster = await userChatbot.createPoster(requirements);
      res.status(200).json(poster);
    } catch (error) {
      console.error('Error in generate poster API:', error);
      res.status(500).json({ error: 'An error occurred while generating the poster.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}