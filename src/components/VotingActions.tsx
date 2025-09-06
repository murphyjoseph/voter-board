'use client'

import {
  Button,
  HStack
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
    console.log(`[Client] === VOTING DEBUG START ===`);
    console.log(`[Client] Attempting to vote ${voteType} on idea ${ideaId}`);
    console.log(`[Client] Current state:`, { 
      isVoting, 
      isLoading, 
      userVote, 
      currentVoteCount 
    });
    
    if (isVoting) {
      console.log(`[Client] Already voting, skipping...`);
      return;
    }
    
    if (isLoading) {
      console.log(`[Client] Still loading, skipping...`);
      return;
    }
    
    setIsVoting(true);
    console.log(`[Client] Set isVoting to true`);
    
    try {
      const fingerprint = generateFingerprint();
      console.log(`[Client] Using fingerprint: ${fingerprint.substring(0, 8)}...`);

      console.log(`[Client] Calling submitVote server action...`);
      const result = await submitVote(ideaId, voteType, fingerprint);
      console.log(`[Client] Vote result:`, result);

      if (result.success && 'data' in result) {
        console.log(`[Client] Vote successful, updating UI:`, {
          newVoteCount: result.data.newVoteCount,
          userVote: result.data.userVote,
          previousUserVote: userVote
        });
        
        // Update local state
        setUserVote(result.data.userVote);
        
        // Update parent component vote count
        if (onVoteChange) {
          console.log(`[Client] Calling onVoteChange with new count: ${result.data.newVoteCount}`);
          onVoteChange(result.data.newVoteCount);
        }
        
        // Force a page refresh to ensure UI is updated
        console.log(`[Client] Refreshing page...`);
        router.refresh();
        
        console.log(`[Client] Vote ${voteType} completed successfully for idea ${ideaId}`);
      } else {
        const errorMsg = 'error' in result ? result.error : 'Unknown error';
        console.error(`[Client] Voting failed:`, errorMsg);
        alert(`Voting error: ${errorMsg}`);
      }
    } catch (error) {
      console.error(`[Client] Network error during voting:`, error);
      alert(`Network error: ${error}`);
    } finally {
      console.log(`[Client] === VOTING DEBUG END ===`);
      console.log(`[Client] Setting isVoting to false`);
      setIsVoting(false);
    }
  };

  console.log(`[VotingActions] Rendering with:`, {
    ideaId,
    currentVoteCount,
    userVote,
    isVoting,
    isLoading
  });

  return (
    <HStack gap={2}>
      <Button
        size="sm"
        variant={userVote === 'up' ? "solid" : "outline"}
        colorScheme="green"
        onClick={() => {
          console.log(`[Client] Upvote button clicked for idea ${ideaId}`);
          handleVote('up');
        }}
        disabled={isVoting || isLoading}
        data-testid="upvote-button"
      >
        ⬆️ {userVote === 'up' ? 'Upvoted' : 'Upvote'}
      </Button>
      <Button
        size="sm"
        variant={userVote === 'down' ? "solid" : "outline"}
        colorScheme="red"
        onClick={() => {
          console.log(`[Client] Downvote button clicked for idea ${ideaId}`);
          handleVote('down');
        }}
        disabled={isVoting || isLoading}
        data-testid="downvote-button"
      >
        ⬇️ {userVote === 'down' ? 'Downvoted' : 'Downvote'}
      </Button>
    </HStack>
  );
}
