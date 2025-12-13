import { useState, useMemo } from 'react';
import { BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useFAQ } from './hooks/useFAQ';
import { SearchBar } from './components/SearchBar';
import { FAQCategory } from './components/FAQCategory';
import { FAQCategoryWithQuestions } from './types/faq';

function App() {
  const { categories, loading, error } = useFAQ();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => {
        const filteredQuestions = category.questions.filter(
          (question) =>
            question.question.toLowerCase().includes(query) ||
            question.answer.toLowerCase().includes(query) ||
            question.tags.some((tag) => tag.toLowerCase().includes(query))
        );

        return {
          ...category,
          questions: filteredQuestions,
        };
      })
      .filter((category) => category.questions.length > 0);
  }, [categories, searchQuery]);

  const featuredQuestions = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.questions.filter((q) => q.is_featured).map((q) => ({ ...q, category: cat }))
    );
  }, [categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement de la FAQ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-900 text-center mb-2">
            Erreur de chargement
          </h2>
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                FAQ - Évaluations Nationales
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Trouvez rapidement les réponses à vos questions
              </p>
            </div>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une question, un mot-clé..."
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {searchQuery && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              <strong>{filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)}</strong>{' '}
              résultat(s) trouvé(s) pour "<strong>{searchQuery}</strong>"
            </p>
          </div>
        )}

        {!searchQuery && featuredQuestions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-600 rounded"></span>
              Questions fréquentes
            </h2>
            <div className="grid gap-3">
              {featuredQuestions.map((q) => (
                <a
                  key={q.id}
                  href={`#${q.category.slug}`}
                  className="block p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
                >
                  <p className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                    {q.question}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{q.category.name}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-600 rounded"></span>
              Navigation rapide
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.slug}`}
                  className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {category.questions.length} question(s)
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <FAQCategory key={category.id} category={category} />
          ))}
        </div>

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-slate-500">
              Essayez avec des mots-clés différents ou parcourez les catégories ci-dessus.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-slate-600 text-sm">
          <p>
            Source : <a href="https://faq2d.depp.education.fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
              https://faq2d.depp.education.fr/
            </a>
          </p>
          <p className="mt-2">Mise à jour : Décembre 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
