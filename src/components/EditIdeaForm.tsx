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
import { updateIdea } from "@/app/actions";
import { generateFingerprint } from "@/utils/fingerprint";

interface EditIdeaFormProps {
  ideaId: string;
  currentContent: string;
  onSave?: (content: string) => void;
  onCancel?: () => void;
}

export function EditIdeaForm({ ideaId, currentContent, onSave, onCancel }: EditIdeaFormProps) {
  const [content, setContent] = useState(currentContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content.trim() || content === currentContent) return;

    setIsSaving(true);
    setError(null);

    try {
      const fingerprint = generateFingerprint();
      const result = await updateIdea(ideaId, content, fingerprint);

      if (result.success) {
        if (onSave) {
          onSave(content);
        }
        console.log('Idea updated successfully:', result.data);
      } else {
        setError(result.error || 'Failed to update idea');
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      setError('Failed to update idea. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = content.trim() !== currentContent.trim();

  return (
    <Card.Root bg="blue.50" borderColor="blue.200" borderWidth="1px">
      <Card.Body>
        <VStack gap={4} align="stretch">
          <Heading size="sm" color="blue.700">
            Edit Idea
          </Heading>

          {error && (
            <Box p={3} bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md">
              <Text color="red.600" fontSize="sm">{error}</Text>
            </Box>
          )}

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minHeight="100px"
            resize="vertical"
            placeholder="Update your idea..."
          />

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              {content.length}/500 characters
            </Text>
            <HStack gap={2}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges || content.length > 500 || !content.trim()}
                loading={isSaving}
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
