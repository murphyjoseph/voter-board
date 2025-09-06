const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupAndSync() {
  console.log('Cleaning up test votes and syncing vote counts...')

  try {
    // Delete all test votes
    console.log('Removing test votes...')
    await supabase.from('votes').delete().like('voter_fingerprint', 'test-%')

    // Get all ideas and recalculate their vote counts
    const { data: ideas, error: ideasError } = await supabase
      .from('ideas')
      .select('id, content, vote_count')

    if (ideasError) {
      console.error('Error getting ideas:', ideasError)
      return
    }

    console.log(`Found ${ideas.length} ideas, recalculating vote counts...`)

    for (const idea of ideas) {
      // Count actual votes for this idea
      const { data: upvotes } = await supabase
        .from('votes')
        .select('id', { count: 'exact' })
        .eq('idea_id', idea.id)
        .eq('vote_type', 'upvote')

      const { data: downvotes } = await supabase
        .from('votes')
        .select('id', { count: 'exact' })
        .eq('idea_id', idea.id)
        .eq('vote_type', 'downvote')

      const actualVoteCount = Math.max(0, (upvotes?.length || 0) - (downvotes?.length || 0))

      console.log(`Idea "${idea.content.substring(0, 30)}...": ${idea.vote_count} → ${actualVoteCount}`)

      // Update the vote count if it's different
      if (idea.vote_count !== actualVoteCount) {
        await supabase
          .from('ideas')
          .update({ vote_count: actualVoteCount })
          .eq('id', idea.id)

        console.log(`  ✅ Updated vote count`)
      } else {
        console.log(`  ✅ Vote count is correct`)
      }
    }

    console.log('\n✅ Cleanup and sync completed!')

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

cleanupAndSync()
