'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, FileCode2, Clapperboard, Box, Command } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchResultCard } from '@/components/ui/SearchResultCard';
import { EmptySearch } from '@/components/ui/EmptyState';
import { SearchResultSkeleton } from '@/components/ui/Skeleton';
import { useProjects } from '@/hooks/useProjects';
import { useProjectSearch } from '@/hooks/useSearch';
import type { SearchResult, SearchFilter } from '@/types';

const FILTERS = [
  { value: 'all', label: 'All', icon: Search },
  { value: 'script', label: 'Scripts', icon: FileCode2 },
  { value: 'scene', label: 'Scenes', icon: Clapperboard },
  { value: 'prefab', label: 'Prefabs', icon: Box },
] as const;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get('project');

  const { data: projects = [] } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (queryProjectId) {
      setSelectedProjectId(queryProjectId);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [queryProjectId, projects, selectedProjectId]);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults = [], isLoading: loading } = useProjectSearch(
    selectedProjectId,
    debouncedQuery
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const filteredResults = searchResults.filter(
    (r) => filter === 'all' || r.type === filter
  );

  const hasSearched = debouncedQuery.trim().length > 0;

  return (
    <AppLayout breadcrumbs={[{ label: 'Search' }]}>
      <div className="page-content max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-[22px] font-700 text-neutral-900 tracking-tight mb-1"
              style={{ fontWeight: 700 }}
            >
              Search
            </h1>
            <p className="text-[13.5px] text-neutral-500">
              Search across all indexed scripts, scenes, and prefabs.
            </p>
          </div>
          {projects.length > 0 && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-[13px] bg-white border border-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:border-brand-400 text-neutral-700 dark:bg-neutral-50"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search scripts, scenes, prefabs…"
            className="input-base pl-11 pr-10 py-3 text-[14.5px] rounded-xl"
            style={{ fontSize: '14.5px', height: '50px' }}
            autoFocus
            id="search-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {/* Keyboard hint */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none" style={{ display: query ? 'none' : 'flex' }}>
            <span className="flex items-center justify-center w-5 h-5 rounded bg-neutral-100 text-neutral-400 text-[10px] font-mono">
              <Command size={10} />
            </span>
            <span className="text-[11px] text-neutral-400">K</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {FILTERS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                filter === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
              style={filter === value ? { background: '#4f46e5' } : {}}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}

          {hasSearched && !loading && (
            <span className="ml-auto text-[12.5px] text-neutral-400">
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <SearchResultSkeleton />
        ) : hasSearched && filteredResults.length === 0 ? (
          <EmptySearch />
        ) : filteredResults.length > 0 ? (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                query={query}
              />
            ))}
          </div>
        ) : (
          /* Pre-search state */
          <div className="text-center py-16">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#f3f4f6' }}
            >
              <Search size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-neutral-700 mb-2">
              Search your project
            </h3>
            <p className="text-[13.5px] text-neutral-400 max-w-xs mx-auto">
              Type to search scripts, scenes, prefabs, and more across all your indexed projects.
            </p>

            {/* Example searches */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['PlayerController', 'enemy AI', 'MainMenu', 'inventory'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full border border-neutral-200 text-[12.5px] text-neutral-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <AppLayout breadcrumbs={[{ label: 'Search' }]}>
        <div className="page-content text-center py-20 text-neutral-400">Loading search…</div>
      </AppLayout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
