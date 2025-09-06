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
import { EditIdeaForm } from "@/components/EditIdeaForm";
import { useState, useEffect } from "react";
import { isCurrentUserAuthor } from "@/utils/fingerprint";

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
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(idea.content);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    // Check if current user is the author
    setIsAuthor(isCurrentUserAuthor(idea.author_fingerprint));
  }, [idea.author_fingerprint]);

  const handleEditSave = (newContent: string) => {
    setContent(newContent);
    setIsEditing(false);
    // TODO: Update in Supabase
    console.log('Updating idea:', idea.id, newContent);
  };

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
    <>
      {isEditing ? (
        <EditIdeaForm
          ideaId={idea.id}
          currentContent={content}
          onSave={handleEditSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Card.Root>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <HStack justify="space-between" align="start">
                <Text fontSize="md" flex="1">
                  {content}
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
                  {idea.created_at !== idea.updated_at && (
                    <Text as="span" color="blue.500" ml={2}>
                      (edited)
                    </Text>
                  )}
                </Text>
                <VotingActions
                  ideaId={idea.id}
                  currentVoteCount={voteCount}
                  onVoteChange={setVoteCount}
                />
              </Flex>

              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.400">
                  Author: {idea.author_fingerprint.substring(0, 8)}...
                  {isAuthor && (
                    <Badge colorScheme="green" variant="outline" ml={2} fontSize="xs">
                      You
                    </Badge>
                  )}
                </Text>
                {isAuthor && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </Flex>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </>
  );
}
