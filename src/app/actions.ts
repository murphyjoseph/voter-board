'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitIdea(content: string, authorFingerprint: string, boardId?: string) {
  const supabase = await createClient()

  try {
    // If no boardId provided, get or create a default board
    let finalBoardId = boardId;

    if (!finalBoardId) {
      const { data: boards, error: boardError } = await supabase
        .from('boards')
        .select('id')
        .limit(1);

      if (boardError) {
        return { success: false, error: 'Error accessing boards: ' + boardError.message };
      }

      if (!boards || boards.length === 0) {
        // Create a default board
        const { data: newBoard, error: createError } = await supabase
          .from('boards')
          .insert([
            {
              title: 'General Ideas',
              description: 'Share your ideas and suggestions here'
            }
          ])
          .select('id')
          .single();

        if (createError || !newBoard) {
          return { success: false, error: 'Failed to create default board: ' + (createError?.message || 'Unknown error') };
        }

        finalBoardId = newBoard.id;
      } else {
        finalBoardId = boards[0].id;
      }
    }

    const { data, error } = await supabase
      .from('ideas')
      .insert([
        {
          content: content.trim(),
          author_fingerprint: authorFingerprint,
          board_id: finalBoardId,
          vote_count: 0
        }
      ])
      .select()

    if (error) {
      console.error('Error submitting idea:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the page to show the new idea
    revalidatePath('/')

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to submit idea' }
  }
}

export async function updateIdea(ideaId: string, content: string, authorFingerprint: string) {
  const supabase = await createClient()

  try {
    // First verify the user owns this idea
    const { data: existingIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('author_fingerprint')
      .eq('id', ideaId)
      .single()

    if (fetchError || !existingIdea) {
      return { success: false, error: 'Idea not found' }
    }

    if (existingIdea.author_fingerprint !== authorFingerprint) {
      return { success: false, error: 'Unauthorized to edit this idea' }
    }

    // Update the idea
    const { data, error } = await supabase
      .from('ideas')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ideaId)
      .select()

    if (error) {
      console.error('Error updating idea:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the page to show the updated idea
    revalidatePath('/')

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to update idea' }
  }
}

export async function ensureDefaultBoard() {
  const supabase = await createClient()

  try {
    // Check if any boards exist
    const { data: existingBoards, error: checkError } = await supabase
      .from('boards')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error checking boards:', checkError)
      return { success: false, error: checkError.message }
    }

    // If boards exist, return the first one
    if (existingBoards && existingBoards.length > 0) {
      return { success: true, boardId: existingBoards[0].id }
    }

    // Create a default board
    const { data, error } = await supabase
      .from('boards')
      .insert([
        {
          title: 'General Ideas',
          description: 'Share your ideas and suggestions here'
        }
      ])
      .select()

    if (error) {
      console.error('Error creating default board:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    return { success: true, boardId: data[0].id }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Failed to ensure default board' }
  }
}

export async function submitVote(ideaId: string, voteType: 'up' | 'down', voterFingerprint: string) {
  console.log(`[Server] submitVote called with:`, { ideaId, voteType, voterFingerprint: voterFingerprint.substring(0, 8) + '...' });
  
  const supabase = await createClient()

  try {
    // Convert client vote types to database vote types
    const dbVoteType = voteType === 'up' ? 'upvote' : 'downvote';
    console.log(`[Server] Converted ${voteType} to ${dbVoteType}`);

    // Check if user has already voted on this idea
    console.log(`[Server] Checking for existing vote...`);
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id, vote_type')
      .eq('idea_id', ideaId)
      .eq('voter_fingerprint', voterFingerprint)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error(`[Server] Error checking existing vote:`, checkError);
      return { success: false, error: 'Error checking existing vote: ' + checkError.message };
    }

    console.log(`[Server] Existing vote:`, existingVote);
    let userVoteAfterAction: 'up' | 'down' | null = voteType;

    if (existingVote) {
      console.log(`[Server] User has existing vote: ${existingVote.vote_type}`);
      // User has already voted
      if (existingVote.vote_type === dbVoteType) {
        console.log(`[Server] Same vote type, removing vote (toggle off)`);
        // Same vote type - remove the vote (toggle off)
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) {
          console.error(`[Server] Error removing vote:`, deleteError);
          return { success: false, error: 'Error removing vote: ' + deleteError.message };
        }

        userVoteAfterAction = null; // No vote after removal
        console.log(`[Server] Vote removed`);
      } else {
        console.log(`[Server] Different vote type, updating vote`);
        // Different vote type - update the vote
        const { error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: dbVoteType })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error(`[Server] Error updating vote:`, updateError);
          return { success: false, error: 'Error updating vote: ' + updateError.message };
        }

        console.log(`[Server] Vote updated to ${dbVoteType}`);
      }
    } else {
      console.log(`[Server] No existing vote, creating new vote`);
      // New vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert([
          {
            idea_id: ideaId,
            voter_fingerprint: voterFingerprint,
            vote_type: dbVoteType
          }
        ]);

      if (insertError) {
        console.error(`[Server] Error submitting vote:`, insertError);
        return { success: false, error: 'Error submitting vote: ' + insertError.message };
      }

      console.log(`[Server] New vote created: ${dbVoteType}`);
    }

    // Calculate the actual vote count by counting upvotes and downvotes
    console.log(`[Server] Calculating actual vote count for idea ${ideaId}`);
    const { data: upvotes, error: upvoteError } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'upvote');

    const { data: downvotes, error: downvoteError } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'downvote');

    if (upvoteError || downvoteError) {
      console.error(`[Server] Error counting votes:`, { upvoteError, downvoteError });
      return { success: false, error: 'Error counting votes' };
    }

    const upvoteCount = upvotes?.length || 0;
    const downvoteCount = downvotes?.length || 0;
    const newVoteCount = Math.max(0, upvoteCount - downvoteCount);

    console.log(`[Server] Vote counts - upvotes: ${upvoteCount}, downvotes: ${downvoteCount}, total: ${newVoteCount}`);

    // Update the vote count on the idea
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ vote_count: newVoteCount })
      .eq('id', ideaId);

    if (updateError) {
      console.error(`[Server] Error updating vote count:`, updateError);
      return { success: false, error: 'Error updating vote count: ' + updateError.message };
    }

    console.log(`[Server] Vote count updated successfully to ${newVoteCount}`);
    revalidatePath('/')

    const result = {
      success: true,
      data: {
        newVoteCount,
        userVote: userVoteAfterAction
      }
    };
    console.log(`[Server] Returning result:`, result);
    return result;
  } catch (error) {
    return { success: false, error: 'Unexpected error: ' + (error as Error).message };
  }
}

export async function getUserVoteForIdea(ideaId: string, voterFingerprint: string) {
  const supabase = await createClient()

  try {
    const { data: vote, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('idea_id', ideaId)
      .eq('voter_fingerprint', voterFingerprint)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      return { success: false, error: 'Error getting user vote: ' + error.message };
    }

    // Convert database vote type back to client vote type
    let clientVoteType = null;
    if (vote?.vote_type) {
      clientVoteType = vote.vote_type === 'upvote' ? 'up' : 'down';
    }

    return { success: true, data: clientVoteType };
  } catch (error) {
    return { success: false, error: 'Unexpected error: ' + (error as Error).message };
  }
}
