import { userChatbot } from '../../lib/agents/userChatbot';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { description } = req.body;
      const imageUrl = await userChatbot.generateImage(description);
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error in generate image API:', error);
      res.status(500).json({ error: 'An error occurred while generating the image.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}