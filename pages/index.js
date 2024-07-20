import { useState } from 'react';
import { ChakraProvider, Box, VStack, HStack, Container } from '@chakra-ui/react';
import ChatInterface from '../components/ChatArea';
import PosterDisplay from '../components/PosterPreview';

export default function Home() {
  const [posterData, setPosterData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePosterGeneration = async (requirements) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirements })
      });
      const data = await response.json();
      setPosterData(data);
    } catch (error) {
      console.error('Error generating poster:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={5}>
        <VStack spacing={8} align="stretch">
          <Box as="h1" fontSize="2xl" fontWeight="bold" textAlign="center">
            AI Poster Generator
          </Box>
          <HStack align="start" spacing={8}>
            <Box flex={1}>
              <ChatInterface onGeneratePoster={handlePosterGeneration} isGenerating={isGenerating} />
            </Box>
            <Box flex={1}>
              <PosterDisplay posterData={posterData} isLoading={isGenerating} />
            </Box>
          </HStack>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}