import { submitVote, getUserVoteForIdea } from '@/app/actions'
import { generateFingerprint } from '@/utils/fingerprint'

// Test script for vote tracking functionality
// Run this in the browser console to test voting

export async function testVoting() {
  const testIdeaId = 'your-idea-id-here' // Replace with an actual idea ID
  const fingerprint = generateFingerprint()

  console.log('Testing vote tracking with fingerprint:', fingerprint)

  // Test 1: Check initial vote state
  console.log('\n--- Test 1: Initial Vote State ---')
  const initialVote = await getUserVoteForIdea(testIdeaId, fingerprint)
  console.log('Initial vote:', initialVote)

  // Test 2: Submit upvote
  console.log('\n--- Test 2: Submit Upvote ---')
  const upvoteResult = await submitVote(testIdeaId, 'up', fingerprint)
  console.log('Upvote result:', upvoteResult)

  // Test 3: Check vote state after upvote
  console.log('\n--- Test 3: Vote State After Upvote ---')
  const afterUpvote = await getUserVoteForIdea(testIdeaId, fingerprint)
  console.log('Vote after upvote:', afterUpvote)

  // Test 4: Try to upvote again (should toggle off)
  console.log('\n--- Test 4: Toggle Upvote Off ---')
  const toggleResult = await submitVote(testIdeaId, 'up', fingerprint)
  console.log('Toggle result:', toggleResult)

  // Test 5: Check vote state after toggle
  console.log('\n--- Test 5: Vote State After Toggle ---')
  const afterToggle = await getUserVoteForIdea(testIdeaId, fingerprint)
  console.log('Vote after toggle:', afterToggle)

  // Test 6: Submit downvote
  console.log('\n--- Test 6: Submit Downvote ---')
  const downvoteResult = await submitVote(testIdeaId, 'down', fingerprint)
  console.log('Downvote result:', downvoteResult)

  // Test 7: Change to upvote
  console.log('\n--- Test 7: Change to Upvote ---')
  const changeResult = await submitVote(testIdeaId, 'up', fingerprint)
  console.log('Change to upvote result:', changeResult)

  console.log('\n--- Test Complete ---')
}

// Instructions for use:
// 1. First create the votes table in Supabase using SUPABASE_SETUP.md
// 2. Replace 'your-idea-id-here' with an actual idea ID from your database
// 3. Run testVoting() in the browser console
// 4. Check the console output to verify vote tracking works correctly
