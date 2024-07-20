import { Box, Image, Text, VStack, Spinner } from '@chakra-ui/react';

export default function PosterDisplay({ posterData, isLoading }) {
  if (isLoading) {
    return (
      <Box height="400px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!posterData) {
    return (
      <Box height="400px" display="flex" alignItems="center" justifyContent="center">
        <Text>No poster generated yet. Start a conversation to create one!</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box borderWidth={1} borderRadius="md" p={4}>
        <Image src={posterData.imageUrl} alt="Generated poster background" />
      </Box>
      <Box borderWidth={1} borderRadius="md" p={4}>
        <Text fontWeight="bold">Generated Content:</Text>
        <Text whiteSpace="pre-wrap">{posterData.content}</Text>
      </Box>
      <Box borderWidth={1} borderRadius="md" p={4}>
        <Text fontWeight="bold">Generated HTML:</Text>
        <Text as="pre" fontSize="sm" whiteSpace="pre-wrap">{posterData.html}</Text>
      </Box>
      <Box borderWidth={1} borderRadius="md" p={4}>
        <Text fontWeight="bold">Generated CSS:</Text>
        <Text as="pre" fontSize="sm" whiteSpace="pre-wrap">{posterData.css}</Text>
      </Box>
    </VStack>
  );
}