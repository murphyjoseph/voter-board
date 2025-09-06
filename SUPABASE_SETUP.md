# Supabase Database Setup Instructions

## Step 1: Create the Votes Table

Go to your Supabase dashboard and run this SQL in the SQL Editor:

```sql
-- Create the votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  voter_fingerprint TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one vote per user per idea
  UNIQUE(idea_id, voter_fingerprint)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_votes_idea_voter ON votes(idea_id, voter_fingerprint);
CREATE INDEX idx_votes_idea_id ON votes(idea_id);
```

## Step 2: Set up Row Level Security

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

## Step 3: Verify the Setup

You can test the table creation by running this query:

```sql
-- Check if the table was created correctly
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'votes'
ORDER BY ordinal_position;
```

## How Vote Tracking Works

1. **First Vote**: User clicks upvote/downvote → Creates vote record → Updates idea vote_count
2. **Toggle Vote**: User clicks same vote → Removes vote record → Adjusts vote_count
3. **Change Vote**: User clicks opposite vote → Updates vote record → Adjusts vote_count by ±2
4. **Visual Feedback**: Buttons show current vote state (solid vs outline)
5. **Prevent Duplicates**: Unique constraint ensures one vote per user per idea

## Testing

After creating the table, you can test the voting system:

1. Visit an idea in the app
2. Click upvote → Button should become solid green and show "Upvoted"
3. Click upvote again → Should remove vote and return to outline "Upvote"
4. Click downvote → Should show solid red "Downvoted"
5. Refresh page → Vote state should persist

The fingerprint system ensures users can't vote multiple times while maintaining privacy.
