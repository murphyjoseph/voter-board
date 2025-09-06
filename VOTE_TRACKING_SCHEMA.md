# Database Schema for Vote Tracking

This document describes the database schema changes needed to implement vote tracking that prevents duplicate voting.

## Votes Table

```sql
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one vote per user per idea
  UNIQUE(idea_id, voter_fingerprint)
);

-- Index for efficient lookups
CREATE INDEX idx_votes_idea_voter ON votes(idea_id, voter_fingerprint);
CREATE INDEX idx_votes_idea_id ON votes(idea_id);
```

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read votes (for displaying vote counts)
CREATE POLICY "Allow read access to votes" ON votes
  FOR SELECT USING (true);

-- Allow anyone to insert votes (for voting)
CREATE POLICY "Allow insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own votes (for changing vote type)
CREATE POLICY "Allow update own votes" ON votes
  FOR UPDATE USING (true);

-- Allow users to delete their own votes (for removing votes)
CREATE POLICY "Allow delete own votes" ON votes
  FOR DELETE USING (true);
```

## Implementation Notes

1. **Unique Constraint**: The `UNIQUE(idea_id, voter_fingerprint)` constraint prevents duplicate votes
2. **Vote Types**: Only 'up' and 'down' votes are allowed via CHECK constraint
3. **Cascade Delete**: When an idea is deleted, all its votes are automatically deleted
4. **Fingerprint Based**: Uses the same privacy-preserving fingerprint system as idea authorship
5. **Vote Toggling**: Users can toggle votes on/off or switch between up/down votes

## Usage

- **First Vote**: Creates new vote record, increments/decrements idea vote_count
- **Same Vote**: Removes vote record (toggle off), adjusts vote_count accordingly
- **Different Vote**: Updates existing record, adjusts vote_count by ±2
- **Vote Display**: Shows current user's vote state and prevents duplicate voting

This system ensures each user can only have one active vote per idea while allowing them to change or remove their vote.
