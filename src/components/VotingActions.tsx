'use client'

import {
  Button,
  VStack
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateFingerprint } from "@/utils/fingerprint";
import { submitVote, getUserVoteForIdea } from "@/app/actions";

interface VotingActionsProps {
  ideaId: string;
  currentVoteCount: number;
  onVoteChange?: (newCount: number) => void;
}

export function VotingActions({ ideaId, currentVoteCount, onVoteChange }: VotingActionsProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user's existing vote on component mount
  useEffect(() => {
    const loadUserVote = async () => {
      try {
        const fingerprint = generateFingerprint();
        const result = await getUserVoteForIdea(ideaId, fingerprint);

        if (result.success) {
          const voteData = result.data;
          setUserVote(voteData === 'up' || voteData === 'down' ? voteData : null);
        }
      } catch (error) {
        console.error('Error loading user vote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserVote();
  }, [ideaId]);

  const handleVote = async (voteType: 'up' | 'down') => {
    console.log(`Attempting to vote ${voteType} on idea ${ideaId}`);
    setIsVoting(true);
    try {
      const fingerprint = generateFingerprint();
      console.log('Using fingerprint:', fingerprint);

      const result = await submitVote(ideaId, voteType, fingerprint);
      console.log('Vote result:', result);

      if (result.success && 'data' in result) {
        console.log('Vote successful, updating UI:', {
          newVoteCount: result.data.newVoteCount,
          userVote: result.data.userVote
        });
        setUserVote(result.data.userVote);
        if (onVoteChange) {
          onVoteChange(result.data.newVoteCount);
        }
        // Force a page refresh to ensure UI is updated
        router.refresh();
        console.log(`Vote ${voteType} successful for idea ${ideaId}`);
      } else {
        const errorMsg = 'error' in result ? result.error : 'Unknown error';
        console.error('Error voting:', errorMsg);
        alert(`Voting error: ${errorMsg}`); // Temporary error display
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert(`Network error: ${error}`); // Temporary error display
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <VStack gap={2}>
      <Button
        size="sm"
        variant={userVote === 'up' ? "solid" : "outline"}
        colorScheme="green"
        onClick={() => handleVote('up')}
        disabled={isVoting || isLoading}
      >
        ⬆️
      </Button>
      <Button
        size="sm"
        variant={userVote === 'down' ? "solid" : "outline"}
        colorScheme="red"
        onClick={() => handleVote('down')}
        disabled={isVoting || isLoading}
      >
        ⬇️
      </Button>
    </VStack>
  );
}
