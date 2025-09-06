const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVotingWithCorrectTypes() {
  console.log('Testing voting with correct database types...')

  try {
    // Get the first idea
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('id, content, vote_count')
      .limit(1)

    if (ideasError || !ideas || ideas.length === 0) {
      console.error('No ideas found:', ideasError)
      return
    }

    const idea = ideas[0]
    console.log('Testing with idea:', idea)

    const testFingerprint = 'test-voting-' + Date.now()

    // Test 1: Submit an upvote with correct type
    console.log('\n--- Test 1: Submit upvote with "upvote" ---')
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          idea_id: idea.id,
          voter_fingerprint: testFingerprint,
          vote_type: 'upvote'  // Use correct database type
        }
      ])
      .select()

    if (voteError) {
      console.error('Error inserting vote:', voteError)
    } else {
      console.log('✅ Vote inserted successfully:', voteData)

      // Update vote count
      const newVoteCount = (idea.vote_count || 0) + 1
      const { error: updateError } = await supabase
        .from('ideas')
        .update({ vote_count: newVoteCount })
        .eq('id', idea.id)

      if (updateError) {
        console.error('Error updating vote count:', updateError)
      } else {
        console.log('✅ Vote count updated to:', newVoteCount)
      }
    }

    // Test 2: Check current state
    console.log('\n--- Test 2: Check current state ---')
    const { data: updatedIdea, error: getError } = await supabase
      .from('ideas')
      .select('id, content, vote_count')
      .eq('id', idea.id)
      .single()

    if (getError) {
      console.error('Error getting updated idea:', getError)
    } else {
      console.log('Updated idea:', updatedIdea)
    }

    // Test 3: Simulate changing vote to downvote
    console.log('\n--- Test 3: Change to downvote ---')
    const { error: changeError } = await supabase
      .from('votes')
      .update({ vote_type: 'downvote' })
      .eq('idea_id', idea.id)
      .eq('voter_fingerprint', testFingerprint)

    if (changeError) {
      console.error('Error changing vote:', changeError)
    } else {
      console.log('✅ Vote changed to downvote')

      // Update vote count (should decrease by 2: remove +1, add -1)
      const finalVoteCount = idea.vote_count - 1  // Back to original
      const { error: updateError2 } = await supabase
        .from('ideas')
        .update({ vote_count: finalVoteCount })
        .eq('id', idea.id)

      if (updateError2) {
        console.error('Error updating vote count:', updateError2)
      } else {
        console.log('✅ Vote count updated to:', finalVoteCount)
      }
    }

    // Cleanup
    console.log('\n--- Cleanup ---')
    await supabase.from('votes').delete().eq('voter_fingerprint', testFingerprint)
    await supabase.from('ideas').update({ vote_count: idea.vote_count }).eq('id', idea.id)
    console.log('✅ Cleanup completed')

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testVotingWithCorrectTypes()
