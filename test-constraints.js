const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkVotesTableConstraints() {
  console.log('Checking votes table constraints...')

  try {
    // Try different vote_type values to see what's accepted
    const testCases = ['up', 'down', 'upvote', 'downvote', '1', '-1']

    for (const voteType of testCases) {
      console.log(`\nTesting vote_type: '${voteType}'`)

      const { data, error } = await supabase
        .from('votes')
        .insert([
          {
            idea_id: '94a66369-de09-423b-a4a3-327314815ac5', // Use the existing idea ID
            voter_fingerprint: `test-constraint-${Date.now()}-${voteType}`,
            vote_type: voteType
          }
        ])
        .select()

      if (error) {
        console.log(`❌ '${voteType}' failed:`, error.message)
      } else {
        console.log(`✅ '${voteType}' succeeded:`, data)
        // Clean up successful inserts
        await supabase
          .from('votes')
          .delete()
          .eq('voter_fingerprint', `test-constraint-${Date.now()}-${voteType}`)
      }
    }

    // Also check what the actual constraint allows by querying system tables
    console.log('\nChecking table info...')
    const { data: tableInfo, error: infoError } = await supabase
      .from('information_schema.check_constraints')
      .select('constraint_name, check_clause')
      .eq('table_name', 'votes')

    if (infoError) {
      console.log('Could not fetch constraint info:', infoError.message)
    } else {
      console.log('Table constraints:', tableInfo)
    }

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

checkVotesTableConstraints()
