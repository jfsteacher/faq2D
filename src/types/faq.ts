export interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  created_at: string;
}

export interface FAQQuestion {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  order_index: number;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface FAQCategoryWithQuestions extends FAQCategory {
  questions: FAQQuestion[];
}
