import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { TicketList } from './pages/TicketList';
import { TicketDetail } from './pages/TicketDetail';
import { TagManager } from './pages/TagManager';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

function AppContent() {
  const [globalSearch, setGlobalSearch] = useState('');
  const [showTagManager, setShowTagManager] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-md-cream">
      {/* Eyebrow — sunbeam strip */}
      <div
        className="sticky top-0 z-[60] flex h-[var(--eyebrow-mobile)] items-center justify-center border-b-2 border-md-graphite bg-md-sunbeam sm:h-[var(--eyebrow-desktop)]"
        role="banner"
      >
        <p className="px-4 text-center text-eyebrow font-bold uppercase tracking-wider text-md-ink">
          任务与标签，一眼看清 —{' '}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="underline decoration-2 underline-offset-2 hover:text-md-graphite"
          >
            返回列表
          </button>
        </p>
      </div>

      <header className="sticky top-[var(--eyebrow-mobile)] z-50 border-b-2 border-md-graphite bg-md-cream sm:top-[var(--eyebrow-desktop)]">
        <div className="mx-auto flex h-[var(--header-mobile)] max-w-[1600px] items-center gap-4 px-4 sm:h-[var(--header-desktop)] sm:px-6">
          <Link
            to="/"
            className="shrink-0 text-ui font-bold uppercase tracking-wide text-md-ink transition-colors hover:text-md-sky-strong"
          >
            Ticket 台
          </Link>

          <div className="min-w-0 flex-1 max-w-xl">
            <label htmlFor="global-search" className="sr-only">
              搜索任务
            </label>
            <Input
              id="global-search"
              type="search"
              placeholder="搜索标题或描述…"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              autoComplete="off"
              className="h-10 py-2 text-sm"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowTagManager(true)}
              className="hidden font-semibold normal-case sm:inline-flex"
            >
              管理标签
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowTagManager(true)}
              className="sm:hidden font-semibold"
              aria-label="管理标签"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate('/', { state: { openCreateTicket: true } })}
            >
              + 新建
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 overflow-auto">
          <Routes>
            <Route path="/" element={<TicketList globalSearch={globalSearch} />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>

      {showTagManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-md-graphite/40"
            onClick={() => setShowTagManager(false)}
            aria-hidden
          />
          <div className="relative z-50 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-struct border-2 border-md-graphite bg-md-cloud shadow-md-lift">
            <TagManager onClose={() => setShowTagManager(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
