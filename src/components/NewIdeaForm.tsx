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

interface NewIdeaFormProps {
  boardId?: string;
  onSubmit?: (content: string) => void;
}

export function NewIdeaForm({ boardId, onSubmit }: NewIdeaFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // For now, just call the onSubmit prop
      // Later you can add actual Supabase submission logic
      if (onSubmit) {
        onSubmit(content);
      }
      setContent('');
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack gap={4} align="stretch">
          <Heading size="md">Submit a New Idea</Heading>

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
