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
