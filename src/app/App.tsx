import { Bell, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { SectionPlaceholder } from '../components/SectionPlaceholder'
import { Sidebar } from '../components/Sidebar'

const sectionDescriptions: Record<string, string> = {
  'Панель управления': 'Здесь появится обзор адаптации и опыта новых сотрудников после подключения демонстрационных данных.',
  Аналитика: 'Здесь будут доступны тенденции по подразделениям и причины увольнений.',
  'Центр автоматизации': 'Здесь появятся сигналы и внутренняя очередь HR-задач после реализации автоматизаций.',
  Сотрудники: 'Здесь появятся список сотрудников и карточки адаптации после добавления данных.',
}

function App() {
  const [activeSection, setActiveSection] = useState('Панель управления')

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 md:flex">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="min-w-0 flex-1">
        <header className="flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur md:px-9">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Рабочая область</span>
            <span>/</span>
            <span className="font-medium text-slate-700">{activeSection}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Поиск" className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
              <Search size={17} strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="Уведомления" className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
              <Bell size={17} strokeWidth={1.8} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>
            <span className="mx-1 h-6 w-px bg-slate-200" />
            <button type="button" className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100">
              <span className="flex size-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">HR</span>
              <span className="hidden text-xs font-medium text-slate-700 sm:block">Демо-аккаунт</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-9 md:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">Аналитика персонала / Обзор</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">{activeSection}</h1>
              <p className="mt-1.5 text-sm text-slate-500">Понятный обзор адаптации новых сотрудников.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
              Демонстрационная среда
            </span>
          </div>

          <SectionPlaceholder section={activeSection} description={sectionDescriptions[activeSection]} />

          <footer className="mt-6 flex flex-col gap-1 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Newbie HR · Аналитика персонала</span>
            <span>Демонстрационный интерфейс · Реальные данные HR не подключены</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
