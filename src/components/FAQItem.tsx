import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQQuestion } from '../types/faq';

interface FAQItemProps {
  question: FAQQuestion;
}

export function FAQItem({ question }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => {
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.*?)\*\* ?: ?(.*)/);
        if (match) {
          return (
            <li key={index} className="ml-4">
              <strong className="text-blue-700">{match[1]}</strong>
              {match[2] && ` : ${match[2]}`}
            </li>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4">
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        const match = line.match(/^\d+\. \*\*(.*?)\*\* ?:? ?(.*)/);
        if (match) {
          return (
            <div key={index} className="mt-2">
              <strong className="text-blue-700">{match[1]}</strong>
              {match[2] && ` : ${match[2]}`}
            </div>
          );
        }
      }
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className={line ? 'mt-2' : 'mt-1'}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="text-blue-700">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }
      if (line.startsWith('http')) {
        return (
          <a
            key={index}
            href={line}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline block mt-2"
          >
            {line}
          </a>
        );
      }
      return line ? (
        <p key={index} className="mt-2">
          {line}
        </p>
      ) : (
        <div key={index} className="h-2" />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900 flex-1">{question.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-slate-700 leading-relaxed space-y-1">
            {renderAnswer(question.answer)}
          </div>
          {question.tags && question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
