/*
  # Add profile fields for enhanced user profiles

  1. New Columns
    - `bio` (text) - User's personal biography/description
    - `preferred_name` (text) - How the user prefers to be addressed

  2. Changes
    - Add bio column to user_profile table
    - Add preferred_name column to user_profile table
    - Both fields are optional (nullable)
*/

-- Add bio column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profile' AND column_name = 'bio'
  ) THEN
    ALTER TABLE user_profile ADD COLUMN bio text;
  END IF;
END $$;

-- Add preferred_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profile' AND column_name = 'preferred_name'
  ) THEN
    ALTER TABLE user_profile ADD COLUMN preferred_name text;
  END IF;
END $$;