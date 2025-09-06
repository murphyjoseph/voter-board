const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jdgyuidbdzrwiywuvuui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3l1aWRiZHpyd2l5d3V2dXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjUyNDgsImV4cCI6MjA3MTEwMTI0OH0.9k1vcrlF9pz-TzO5-zcsv8RvvV8U1tPdT8v8SuGewdc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVotesTable() {
  console.log('Testing votes table existence...')

  try {
    // Try to select from votes table
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Votes table error:', error)
      if (error.code === '42P01') {
        console.log('❌ Votes table does not exist!')
        return false
      }
    } else {
      console.log('✅ Votes table exists!')
      console.log('Sample data:', data)
      return true
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
}

async function testIdeasTable() {
  console.log('Testing ideas table...')

  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('id, content, vote_count')
      .limit(3)

    if (error) {
      console.error('Ideas table error:', error)
    } else {
      console.log('✅ Ideas table exists!')
      console.log('Ideas:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

async function main() {
  await testVotesTable()
  await testIdeasTable()
}

main()
