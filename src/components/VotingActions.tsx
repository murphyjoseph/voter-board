'use client'

import {
  Button,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";

interface VotingActionsProps {
  ideaId: string;
  currentVoteCount: number;
  onVoteChange?: (newCount: number) => void;
}

export function VotingActions({ ideaId, currentVoteCount, onVoteChange }: VotingActionsProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    setIsVoting(true);
    try {
      // TODO: Implement actual voting logic with Supabase
      const newCount = voteType === 'up'
        ? currentVoteCount + 1
        : Math.max(0, currentVoteCount - 1);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (onVoteChange) {
        onVoteChange(newCount);
      }

      console.log(`Vote ${voteType} successful for idea ${ideaId}`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <HStack gap={2}>
      <Button
        size="sm"
        variant="outline"
        colorScheme="green"
        onClick={() => handleVote('up')}
        disabled={isVoting}
      >
        👍 Upvote
      </Button>
      <Button
        size="sm"
        variant="outline"
        colorScheme="red"
        onClick={() => handleVote('down')}
        disabled={isVoting}
      >
        👎 Downvote
      </Button>
    </HStack>
  );
}
