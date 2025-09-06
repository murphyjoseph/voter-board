'use client'

import {
  Box,
  Heading,
  Button,
  VStack,
  SimpleGrid,
  Flex,
  Card,
  Text
} from "@chakra-ui/react";
import { IdeaCard } from "@/components/IdeaCard";
import { NewIdeaForm } from "@/components/NewIdeaForm";
import { useState, useEffect, useRef } from "react";

interface Idea {
  id: string;
  board_id: string;
  content: string;
  author_fingerprint: string;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

interface IdeasSectionProps {
  ideas: Idea[] | null;
  boardId?: string;
  autoOpenForm?: boolean;
  onFormToggle?: (isOpen: boolean) => void;
}

export function IdeasSection({ ideas, boardId, autoOpenForm, onFormToggle }: IdeasSectionProps) {
  const [showForm, setShowForm] = useState(autoOpenForm || false);
  const formRef = useRef<HTMLDivElement>(null);

  // Update form state when autoOpenForm prop changes
  useEffect(() => {
    if (autoOpenForm) {
      setShowForm(true);
      if (onFormToggle) {
        onFormToggle(true);
      }

      // Scroll to form after a brief delay
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 600);
    }
  }, [autoOpenForm, onFormToggle]);

  const handleNewIdea = (content: string, fingerprint: string) => {
    console.log('New idea submitted:', content, 'by fingerprint:', fingerprint);
  };

  const handleSubmitSuccess = () => {
    setShowForm(false);
    if (onFormToggle) {
      onFormToggle(false);
    }
  };

  const toggleForm = () => {
    const newState = !showForm;
    setShowForm(newState);
    if (onFormToggle) {
      onFormToggle(newState);
    }
  };

  return (
    <Box ref={formRef}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Ideas</Heading>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={toggleForm}
        >
          {showForm ? 'Cancel' : 'Submit New Idea'}
        </Button>
      </Flex>

      <VStack gap={4} align="stretch">
        {showForm && (
          <NewIdeaForm
            boardId={boardId}
            onSubmit={handleNewIdea}
            onSuccess={handleSubmitSuccess}
          />
        )}

        {ideas && ideas.length > 0 ? (
          <SimpleGrid columns={1} gap={4}>
            {ideas
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
          </SimpleGrid>
        ) : (
          <Card.Root>
            <Card.Body>
              <VStack gap={4} py={8}>
                <Text color="gray.500" textAlign="center">
                  No ideas submitted yet
                </Text>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setShowForm(true)}
                >
                  Be the first to submit an idea!
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}
      </VStack>
    </Box>
  );
}
