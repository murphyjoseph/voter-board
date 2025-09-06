const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function simulateServerAction() {
  console.log('Simulating the server action voting flow...')

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
    const ideaId = idea.id
    const voteType = 'up'  // Client vote type
    const voterFingerprint = 'test-server-action-' + Date.now()

    console.log('Testing with:', { ideaId, voteType, voterFingerprint })
    console.log('Original idea:', idea)

    // Simulate the server action logic
    const dbVoteType = voteType === 'up' ? 'upvote' : 'downvote'
    console.log(`Converted ${voteType} to ${dbVoteType}`)

    // Check for existing vote
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id, vote_type')
      .eq('idea_id', ideaId)
      .eq('voter_fingerprint', voterFingerprint)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing vote:', checkError)
      return
    }

    console.log('Existing vote:', existingVote)

    let voteChange = 0

    if (!existingVote) {
      // New vote
      console.log('Creating new vote...')
      const { error: insertError } = await supabase
        .from('votes')
        .insert([
          {
            idea_id: ideaId,
            voter_fingerprint: voterFingerprint,
            vote_type: dbVoteType
          }
        ])

      if (insertError) {
        console.error('Error inserting vote:', insertError)
        return
      }

      voteChange = voteType === 'up' ? 1 : -1
      console.log('New vote created, change:', voteChange)
    }

    // Update vote count
    console.log('Getting current vote count...')
    const { data: currentIdea, error: getError } = await supabase
      .from('ideas')
      .select('vote_count')
      .eq('id', ideaId)
      .single()

    if (getError) {
      console.error('Error getting current vote count:', getError)
      return
    }

    console.log('Current vote count:', currentIdea.vote_count)
    const newVoteCount = Math.max(0, (currentIdea.vote_count || 0) + voteChange)
    console.log('New vote count:', newVoteCount)

    const { error: updateError } = await supabase
      .from('ideas')
      .update({ vote_count: newVoteCount })
      .eq('id', ideaId)

    if (updateError) {
      console.error('Error updating vote count:', updateError)
      return
    }

    console.log('✅ Vote count updated successfully!')

    // Verify the change
    const { data: finalIdea, error: verifyError } = await supabase
      .from('ideas')
      .select('id, content, vote_count')
      .eq('id', ideaId)
      .single()

    if (verifyError) {
      console.error('Error verifying update:', verifyError)
    } else {
      console.log('Final idea state:', finalIdea)
    }

    // Clean up
    console.log('Cleaning up...')
    await supabase.from('votes').delete().eq('voter_fingerprint', voterFingerprint)
    await supabase.from('ideas').update({ vote_count: idea.vote_count }).eq('id', ideaId)
    console.log('✅ Cleanup completed')

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

simulateServerAction()
