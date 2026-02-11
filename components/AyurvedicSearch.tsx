import React, { useState } from 'react';
import { searchAyurveda } from '../services/geminiService';
import { AyurvedicSearchResponse } from '../types';
import { HerbIllustration } from './icons/HerbIllustration';

const AyurvedicSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<AyurvedicSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResponse(null);

    try {
      const response = await searchAyurveda(query);
      setSearchResponse(response);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Ayurvedic Knowledge Hub</h2>
        <p className="text-lg text-text-secondary">Explore verified Ayurvedic insights powered by Google Search.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for herbs, conditions, treatments..."
            className="flex-grow w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent focus:outline-none transition duration-200 shadow-sm bg-brand-surface"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-brand-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Search'}
          </button>
        </form>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">{error}</div>}

        {!isLoading && !searchResponse && !error && (
           <div className="text-center py-16 px-4 bg-brand-surface rounded-xl shadow-sm border border-gray-200">
              <HerbIllustration className="mx-auto h-40 w-40 mb-4"/>
              <p className="text-text-secondary text-lg">Discover the wisdom of Ayurveda with real-time web results. Enter a topic above to begin.</p>
          </div>
        )}

        {searchResponse && (
          <div className="space-y-6 animate-fade-in-up">
              <div className="bg-brand-surface rounded-xl shadow-md border border-gray-200 p-8">
                  <div className="prose prose-slate max-w-none text-text-primary leading-relaxed whitespace-pre-wrap mb-8">
                      {searchResponse.content}
                  </div>
                  
                  {searchResponse.sources.length > 0 && (
                      <div className="border-t pt-6">
                          <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Sources from Google Search:</h4>
                          <div className="flex flex-wrap gap-2">
                              {searchResponse.sources.map((source, idx) => (
                                  <a 
                                      key={idx} 
                                      href={source.uri} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs bg-brand-background hover:bg-brand-accent-light hover:text-brand-accent px-3 py-1.5 rounded-full border border-gray-200 transition-colors duration-200 flex items-center gap-1"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                      {source.title}
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AyurvedicSearch;