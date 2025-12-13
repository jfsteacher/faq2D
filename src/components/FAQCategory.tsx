import * as Icons from 'lucide-react';
import { FAQCategoryWithQuestions } from '../types/faq';
import { FAQItem } from './FAQItem';

interface FAQCategoryProps {
  category: FAQCategoryWithQuestions;
}

export function FAQCategory({ category }: FAQCategoryProps) {
  const IconComponent = category.icon && (Icons as any)[category.icon]
    ? (Icons as any)[category.icon]
    : Icons.HelpCircle;

  if (category.questions.length === 0) {
    return null;
  }

  return (
    <div id={category.slug} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
          {category.description && (
            <p className="text-slate-600 text-sm mt-1">{category.description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {category.questions.map((question) => (
          <FAQItem key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
