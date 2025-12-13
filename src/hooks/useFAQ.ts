import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FAQCategory, FAQQuestion, FAQCategoryWithQuestions } from '../types/faq';

export function useFAQ() {
  const [categories, setCategories] = useState<FAQCategoryWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFAQData() {
      try {
        setLoading(true);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('faq_categories')
          .select('*')
          .order('order_index');

        if (categoriesError) throw categoriesError;

        const { data: questionsData, error: questionsError } = await supabase
          .from('faq_questions')
          .select('*')
          .order('order_index');

        if (questionsError) throw questionsError;

        const categoriesWithQuestions: FAQCategoryWithQuestions[] = (categoriesData || []).map(
          (category: FAQCategory) => ({
            ...category,
            questions: (questionsData || []).filter(
              (q: FAQQuestion) => q.category_id === category.id
            ),
          })
        );

        setCategories(categoriesWithQuestions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchFAQData();
  }, []);

  return { categories, loading, error };
}
