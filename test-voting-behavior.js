// Test voting behavior manually
const { createClient } = require('@supabase/supabase-js')

async function testVotingBehavior() {
  // Create a test client (you'll need to provide actual credentials)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-url',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key'
  )

  console.log('Testing voting behavior...')

  // Test data
  const testIdeaId = 'test-idea-1'
  const testFingerprint = 'test-user-fingerprint'

  try {
    // Check initial vote count
    const { data: initialVotes } = await supabase
      .from('votes')
      .select('*')
      .eq('idea_id', testIdeaId)

    console.log('Initial votes:', initialVotes?.length || 0)

    // Test 1: First upvote
    console.log('\n1. Testing first upvote...')
    await supabase
      .from('votes')
      .insert({
        idea_id: testIdeaId,
        voter_fingerprint: testFingerprint,
        vote_type: 'upvote'
      })

    const { data: afterFirstVote } = await supabase
      .from('votes')
      .select('*')
      .eq('idea_id', testIdeaId)
      .eq('voter_fingerprint', testFingerprint)

    console.log('Votes after first upvote:', afterFirstVote?.length)

    // Test 2: Try to vote again (should fail or update)
    console.log('\n2. Testing duplicate vote...')
    const { error } = await supabase
      .from('votes')
      .insert({
        idea_id: testIdeaId,
        voter_fingerprint: testFingerprint,
        vote_type: 'upvote'
      })

    if (error) {
      console.log('Good: Duplicate vote blocked:', error.message)
    } else {
      console.log('Warning: Duplicate vote allowed!')
    }

    // Cleanup
    await supabase
      .from('votes')
      .delete()
      .eq('idea_id', testIdeaId)
      .eq('voter_fingerprint', testFingerprint)

    console.log('\nTest completed!')

  } catch (error) {
    console.error('Test error:', error.message)
  }
}

testVotingBehavior()
