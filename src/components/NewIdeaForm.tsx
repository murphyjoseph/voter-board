'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  VStack,
  Textarea,
  HStack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import { generateFingerprint } from "@/utils/fingerprint";
import { submitIdea } from "@/app/actions";

interface NewIdeaFormProps {
  boardId?: string;
  onSubmit?: (content: string, fingerprint: string) => void;
  onSuccess?: () => void;
}

export function NewIdeaForm({ boardId, onSubmit, onSuccess }: NewIdeaFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      const fingerprint = generateFingerprint();
      
      // Use server action to submit to database
      const result = await submitIdea(content, fingerprint, boardId);
      
      if (result.success) {
        setContent('');
        if (onSuccess) {
          onSuccess();
        }
        console.log('Idea submitted successfully:', result.data);
      } else {
        setError(result.error || 'Failed to submit idea');
      }
      
      // Also call the original onSubmit prop if provided
      if (onSubmit) {
        onSubmit(content, fingerprint);
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      setError('Failed to submit idea. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack gap={4} align="stretch">
          <Heading size="md">Submit a New Idea</Heading>

          {error && (
            <Box p={3} bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md">
              <Text color="red.600" fontSize="sm">{error}</Text>
            </Box>
          )}

          <Textarea
            placeholder="Share your idea..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minHeight="120px"
            resize="vertical"
          />

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              {content.length}/500 characters
            </Text>
            <HStack gap={2}>
              <Button
                variant="ghost"
                onClick={() => setContent('')}
                size="sm"
              >
                Clear
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 500}
                loading={isSubmitting}
                size="sm"
              >
                Submit Idea
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
