'use client'

import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Flex
} from "@chakra-ui/react";
import { VotingActions } from "@/components/VotingActions";
import { useState } from "react";

interface Idea {
  id: string;
  board_id: string;
  content: string;
  author_fingerprint: string;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [voteCount, setVoteCount] = useState(idea.vote_count);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoteColor = (count: number) => {
    if (count > 10) return "green";
    if (count > 5) return "blue";
    if (count > 0) return "yellow";
    return "gray";
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="start">
            <Text fontSize="md" flex="1">
              {idea.content}
            </Text>
            <Badge
              colorScheme={getVoteColor(voteCount)}
              variant="solid"
              ml={2}
            >
              {voteCount} votes
            </Badge>
          </HStack>

          <Flex justify="space-between" align="center">
            <Text fontSize="xs" color="gray.500">
              Posted {formatDate(idea.created_at)}
            </Text>
            <VotingActions
              ideaId={idea.id}
              currentVoteCount={voteCount}
              onVoteChange={setVoteCount}
            />
          </Flex>

          <Text fontSize="xs" color="gray.400">
            Author: {idea.author_fingerprint.substring(0, 8)}...
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
