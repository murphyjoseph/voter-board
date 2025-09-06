import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitVote, getUserVoteForIdea } from '@/app/actions'

// Mock Supabase to simulate real database behavior
const mockVotes = new Map() // Store votes as [ideaId-fingerprint]: voteType
const mockIdeas = new Map() // Store ideas as [ideaId]: { vote_count }

const mockSupabaseClient = {
  from: vi.fn((table) => {
    if (table === 'votes') {
      return {
        select: vi.fn((fields) => ({
          eq: vi.fn((field, value) => {
            if (field === 'idea_id') {
              return {
                eq: vi.fn((field2, value2) => {
                  if (field2 === 'voter_fingerprint') {
                    return {
                      single: vi.fn(() => {
                        const key = `${value}-${value2}`
                        const vote = mockVotes.get(key)
                        if (vote) {
                          return Promise.resolve({
                            data: { id: key, vote_type: vote },
                            error: null
                          })
                        } else {
                          return Promise.resolve({
                            data: null,
                            error: { code: 'PGRST116' }
                          })
                        }
                      })
                    }
                  }
                  // For counting votes
                  if (field2 === 'vote_type') {
                    const votes = Array.from(mockVotes.entries())
                      .filter(([key, voteType]) => 
                        key.startsWith(`${value}-`) && voteType === value2
                      )
                    return Promise.resolve({
                      data: votes.map((_, index) => ({ id: index })),
                      error: null
                    })
                  }
                  return { single: vi.fn() }
                })
              }
            }
            return { eq: vi.fn() }
          })
        })),
        insert: vi.fn((data) => {
          const record = data[0]
          const key = `${record.idea_id}-${record.voter_fingerprint}`
          
          // Check for unique constraint violation
          if (mockVotes.has(key)) {
            return Promise.resolve({
              data: null,
              error: { message: 'duplicate key value violates unique constraint' }
            })
          }
          
          mockVotes.set(key, record.vote_type)
          return Promise.resolve({ data: [record], error: null })
        }),
        update: vi.fn((data) => ({
          eq: vi.fn((field, value) => {
            if (mockVotes.has(value)) {
              mockVotes.set(value, data.vote_type)
            }
            return Promise.resolve({ data: [], error: null })
          })
        })),
        delete: vi.fn(() => ({
          eq: vi.fn((field, value) => {
            mockVotes.delete(value)
            return Promise.resolve({ data: [], error: null })
          })
        }))
      }
    }
    
    if (table === 'ideas') {
      return {
        update: vi.fn((data) => ({
          eq: vi.fn((field, value) => {
            mockIdeas.set(value, { vote_count: data.vote_count })
            return Promise.resolve({ data: [], error: null })
          })
        }))
      }
    }
    
    return {}
  })
}

// Mock the Supabase server client
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Voting Behavior Validation', () => {
  beforeEach(() => {
    mockVotes.clear()
    mockIdeas.clear()
    vi.clearAllMocks()
  })

  it('should allow a user to vote once and prevent duplicate votes', async () => {
    const ideaId = 'test-idea-1'
    const userFingerprint = 'user123'

    // Test 1: User votes up for the first time
    console.log('Testing first upvote...')
    const result1 = await submitVote(ideaId, 'up', userFingerprint)
    
    expect(result1.success).toBe(true)
    if (result1.success && 'data' in result1) {
      expect(result1.data.userVote).toBe('up')
      expect(result1.data.newVoteCount).toBe(1)
    }

    // Test 2: User tries to vote up again (should toggle off)
    console.log('Testing duplicate upvote (toggle off)...')
    const result2 = await submitVote(ideaId, 'up', userFingerprint)
    
    expect(result2.success).toBe(true)
    if (result2.success && 'data' in result2) {
      expect(result2.data.userVote).toBe(null) // Vote removed
      expect(result2.data.newVoteCount).toBe(0) // Count back to 0
    }

    // Test 3: User votes down
    console.log('Testing downvote...')
    const result3 = await submitVote(ideaId, 'down', userFingerprint)
    
    expect(result3.success).toBe(true)
    if (result3.success && 'data' in result3) {
      expect(result3.data.userVote).toBe('down')
      expect(result3.data.newVoteCount).toBe(0) // 0 upvotes, 1 downvote = max(0, 0-1) = 0
    }

    // Test 4: User changes to upvote
    console.log('Testing vote change...')
    const result4 = await submitVote(ideaId, 'up', userFingerprint)
    
    expect(result4.success).toBe(true)
    if (result4.success && 'data' in result4) {
      expect(result4.data.userVote).toBe('up')
      expect(result4.data.newVoteCount).toBe(1) // 1 upvote, 0 downvotes = 1
    }
  })

  it('should handle multiple users voting correctly', async () => {
    const ideaId = 'test-idea-2'
    const user1 = 'user1'
    const user2 = 'user2'

    // User 1 upvotes
    const result1 = await submitVote(ideaId, 'up', user1)
    expect(result1.success).toBe(true)
    if (result1.success && 'data' in result1) {
      expect(result1.data.newVoteCount).toBe(1)
    }

    // User 2 also upvotes
    const result2 = await submitVote(ideaId, 'up', user2)
    expect(result2.success).toBe(true)
    if (result2.success && 'data' in result2) {
      expect(result2.data.newVoteCount).toBe(2)
    }

    // User 1 changes to downvote
    const result3 = await submitVote(ideaId, 'down', user1)
    expect(result3.success).toBe(true)
    if (result3.success && 'data' in result3) {
      expect(result3.data.newVoteCount).toBe(1) // 1 up, 1 down = max(0, 1-1) = 0, but user2 still has upvote
    }

    // User 2 removes vote
    const result4 = await submitVote(ideaId, 'up', user2)
    expect(result4.success).toBe(true)
    if (result4.success && 'data' in result4) {
      expect(result4.data.userVote).toBe(null)
      expect(result4.data.newVoteCount).toBe(0) // 0 up, 1 down = 0
    }
  })

  it('should correctly retrieve user vote status', async () => {
    const ideaId = 'test-idea-3'
    const userFingerprint = 'user456'

    // Initially no vote
    const initialVote = await getUserVoteForIdea(ideaId, userFingerprint)
    expect(initialVote.success).toBe(true)
    expect(initialVote.data).toBe(null)

    // After upvoting
    await submitVote(ideaId, 'up', userFingerprint)
    const afterUpvote = await getUserVoteForIdea(ideaId, userFingerprint)
    expect(afterUpvote.success).toBe(true)
    expect(afterUpvote.data).toBe('up')

    // After changing to downvote
    await submitVote(ideaId, 'down', userFingerprint)
    const afterDownvote = await getUserVoteForIdea(ideaId, userFingerprint)
    expect(afterDownvote.success).toBe(true)
    expect(afterDownvote.data).toBe('down')

    // After removing vote
    await submitVote(ideaId, 'down', userFingerprint) // Toggle off
    const afterRemove = await getUserVoteForIdea(ideaId, userFingerprint)
    expect(afterRemove.success).toBe(true)
    expect(afterRemove.data).toBe(null)
  })
})
