const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCorrectVotingBehavior() {
  console.log('Testing correct voting behavior...')

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
    const testFingerprint = 'test-correct-voting-' + Date.now()

    console.log('Testing with idea:', idea)
    console.log('Original vote count:', idea.vote_count)

    // Clean up any existing votes for this test
    await supabase.from('votes').delete().eq('voter_fingerprint', testFingerprint)

    console.log('\n--- Test 1: First upvote ---')
    // Simulate the corrected voting logic
    await supabase.from('votes').insert([{
      idea_id: ideaId,
      voter_fingerprint: testFingerprint,
      vote_type: 'upvote'
    }])

    // Count votes
    const { data: upvotes1 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'upvote')

    const { data: downvotes1 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'downvote')

    const voteCount1 = (upvotes1?.length || 0) - (downvotes1?.length || 0)
    console.log(`After upvote: upvotes=${upvotes1?.length || 0}, downvotes=${downvotes1?.length || 0}, total=${voteCount1}`)

    console.log('\n--- Test 2: Change to downvote ---')
    // Change vote to downvote
    await supabase.from('votes')
      .update({ vote_type: 'downvote' })
      .eq('idea_id', ideaId)
      .eq('voter_fingerprint', testFingerprint)

    // Count votes again
    const { data: upvotes2 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'upvote')

    const { data: downvotes2 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'downvote')

    const voteCount2 = (upvotes2?.length || 0) - (downvotes2?.length || 0)
    console.log(`After downvote: upvotes=${upvotes2?.length || 0}, downvotes=${downvotes2?.length || 0}, total=${voteCount2}`)

    console.log('\n--- Test 3: Remove vote (toggle off) ---')
    // Remove vote
    await supabase.from('votes')
      .delete()
      .eq('idea_id', ideaId)
      .eq('voter_fingerprint', testFingerprint)

    // Count votes again
    const { data: upvotes3 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'upvote')

    const { data: downvotes3 } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'downvote')

    const voteCount3 = (upvotes3?.length || 0) - (downvotes3?.length || 0)
    console.log(`After removing vote: upvotes=${upvotes3?.length || 0}, downvotes=${downvotes3?.length || 0}, total=${voteCount3}`)

    // Test expected behavior
    console.log('\n--- Expected vs Actual ---')
    console.log('✅ First upvote should show: total = original + 1')
    console.log('✅ Change to downvote should show: total = original - 1')
    console.log('✅ Remove vote should show: total = original')

    console.log('\n--- Multiple user test ---')
    // Test with multiple users
    const user1 = testFingerprint + '-user1'
    const user2 = testFingerprint + '-user2'

    // User 1 upvotes
    await supabase.from('votes').insert([{
      idea_id: ideaId,
      voter_fingerprint: user1,
      vote_type: 'upvote'
    }])

    // User 2 downvotes
    await supabase.from('votes').insert([{
      idea_id: ideaId,
      voter_fingerprint: user2,
      vote_type: 'downvote'
    }])

    // Count final votes
    const { data: finalUpvotes } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'upvote')

    const { data: finalDownvotes } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('idea_id', ideaId)
      .eq('vote_type', 'downvote')

    const finalVoteCount = (finalUpvotes?.length || 0) - (finalDownvotes?.length || 0)
    console.log(`Final: upvotes=${finalUpvotes?.length || 0}, downvotes=${finalDownvotes?.length || 0}, total=${finalVoteCount}`)

    // Cleanup
    console.log('\n--- Cleanup ---')
    await supabase.from('votes').delete().eq('voter_fingerprint', user1)
    await supabase.from('votes').delete().eq('voter_fingerprint', user2)
    console.log('✅ Cleanup completed')

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testCorrectVotingBehavior()
