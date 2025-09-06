'use client'

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Separator,
} from "@chakra-ui/react";
import { IdeasSection } from "@/components/IdeasSection";
import { AppConceptsShowcase } from "@/components/AppConceptsShowcase";
import { UIPatternShowcase } from "@/components/UIPatternShowcase";

interface Idea {
  id: string;
  board_id: string;
  content: string;
  author_fingerprint: string;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

interface Board {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ClientHomeProps {
  ideas: Idea[] | null;
  boards: Board[] | null;
}

export function ClientHome({ ideas, boards }: ClientHomeProps) {
  const [autoOpenForm, setAutoOpenForm] = useState(false);

  const handleSubmitIdeaClick = () => {
    setAutoOpenForm(true);
  };

  const handleFormToggle = (isOpen: boolean) => {
    if (!isOpen) {
      setAutoOpenForm(false);
    }
  };

  return (
    <Container maxW="container.xl" p={{ base: 4, lg: 16 }} margin="0 auto">
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Welcome to the Hackreation Voter Board
          </Heading>
          <Heading size="md" mb={2} color="gray.600">
            Theme: Everyday Tools Reimagined (view below for examples and more information)
          </Heading>
        </Box>

        {/* Ideas Section */}
        <IdeasSection
          ideas={ideas}
          boardId={boards?.[0]?.id}
          autoOpenForm={autoOpenForm}
          onFormToggle={handleFormToggle}
        />

        <Separator my={8} />

        {/* App Concepts Showcase */}
        <AppConceptsShowcase onSubmitIdeaClick={handleSubmitIdeaClick} />

        <Separator my={8} />

        {/* UI Pattern Showcase */}
        <UIPatternShowcase />
      </VStack>
    </Container>
  );
}
