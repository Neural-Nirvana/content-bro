import { useState } from 'react';
import { Box, VStack, Input, Button, Text, useToast } from '@chakra-ui/react';

export default function ChatInterface({ onGeneratePoster, isGenerating }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      setReadyToGenerate(data.readyToCreate);
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePoster = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      });
      const data = await response.json();
      if (data.poster) {
        onGeneratePoster(data.poster);
        setMessages([...messages, { role: 'assistant', content: data.message }]);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate poster. Please provide more information.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error generating poster:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate poster. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box borderWidth={1} borderRadius="md" p={4} height="400px" overflowY="auto">
        {messages.map((msg, index) => (
          <Text key={index} fontWeight={msg.role === 'user' ? 'bold' : 'normal'}>
            {msg.role === 'user' ? 'You: ' : 'AI: '}
            {msg.content}
          </Text>
        ))}
      </Box>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        isDisabled={isLoading}
      />
      <Button onClick={handleSendMessage} isLoading={isLoading}>Send</Button>
      <Button 
        onClick={handleGeneratePoster} 
        isLoading={isLoading || isGenerating} 
        colorScheme="blue"
        isDisabled={!readyToGenerate || isLoading || isGenerating}
      >
        Generate Poster
      </Button>
    </VStack>
  );
}