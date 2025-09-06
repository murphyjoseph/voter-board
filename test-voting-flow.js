const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVoting() {
  console.log('Testing voting functionality...')

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

    const testFingerprint = 'test-fingerprint-' + Date.now()

    // Test 1: Submit an upvote
    console.log('\n--- Test 1: Submit upvote ---')
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .insert([
        {
          idea_id: idea.id,
          voter_fingerprint: testFingerprint,
          vote_type: 'up'
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

    // Test 3: Check vote exists
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .eq('idea_id', idea.id)
      .eq('voter_fingerprint', testFingerprint)

    if (votesError) {
      console.error('Error getting votes:', votesError)
    } else {
      console.log('User votes:', votes)
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

testVoting()
