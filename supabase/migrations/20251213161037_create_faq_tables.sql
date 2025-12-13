/*
  # Create FAQ Database Schema

  ## Summary
  Creates tables to store FAQ categories and questions for a modern, searchable FAQ system.

  ## New Tables
  
  ### `faq_categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text) - Category name (e.g., "Portail ASP", "Portail de restitution")
  - `slug` (text, unique) - URL-friendly version of category name
  - `description` (text, nullable) - Optional category description
  - `icon` (text, nullable) - Icon name from lucide-react
  - `order_index` (integer) - Display order of categories
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `faq_questions`
  - `id` (uuid, primary key) - Unique identifier for each question
  - `category_id` (uuid, foreign key) - Reference to faq_categories
  - `question` (text) - The question text
  - `answer` (text) - The answer text (supports markdown)
  - `order_index` (integer) - Display order within category
  - `tags` (text array) - Searchable tags for the question
  - `is_featured` (boolean) - Whether to highlight this question
  - `view_count` (integer) - Number of times viewed
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (FAQ is public information)
  - Restrict write access to authenticated users only

  ## Notes
  - Categories help organize FAQ items logically
  - Questions support markdown for rich formatting
  - Tags enable flexible search functionality
  - View counts can help identify popular questions
*/

-- Create faq_categories table
CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create faq_questions table
CREATE TABLE IF NOT EXISTS faq_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_faq_questions_category_id ON faq_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_questions_tags ON faq_questions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_faq_questions_is_featured ON faq_questions(is_featured) WHERE is_featured = true;

-- Enable Row Level Security
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_questions ENABLE ROW LEVEL SECURITY;

-- Policies for faq_categories (public read access)
CREATE POLICY "Anyone can view FAQ categories"
  ON faq_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON faq_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON faq_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON faq_categories FOR DELETE
  TO authenticated
  USING (true);

-- Policies for faq_questions (public read access)
CREATE POLICY "Anyone can view FAQ questions"
  ON faq_questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON faq_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON faq_questions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete questions"
  ON faq_questions FOR DELETE
  TO authenticated
  USING (true);