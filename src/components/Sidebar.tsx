import { ArrowUpRight, Hexagon, Settings2 } from 'lucide-react'
import { navigationItems } from '../features/navigation/navigationItems'

type SidebarProps = {
  activeSection: string
  onNavigate: (section: string) => void
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-7">
      <a className="mb-6 flex items-center gap-3 px-2 md:mb-10" href="#dashboard" aria-label="Newbie HR home">
        <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
          <Hexagon size={21} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-[15px] font-semibold tracking-tight text-slate-900">Newbie HR</span>
          <span className="mt-0.5 block text-xs text-slate-500">People intelligence</span>
        </span>
      </a>

      <p className="mb-3 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:block">
        Workspace
      </p>
      <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto md:flex-col">
        {navigationItems.map(({ label, icon: Icon }) => {
          const isActive = activeSection === label

          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(label)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Automation Center' && (
                <span className="ml-auto hidden size-1.5 rounded-full bg-slate-300 md:block" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto hidden rounded-xl border border-slate-200 bg-slate-50/80 p-4 md:block">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800">Demo workspace</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Ready</span>
        </div>
        <p className="text-xs leading-5 text-slate-500">A private space for exploring onboarding insights.</p>
        <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-800">
          Workspace settings <Settings2 size={13} />
        </button>
      </div>

      <div className="mt-5 hidden items-center justify-between border-t border-slate-100 px-2 pt-5 md:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">HR</div>
          <div>
            <p className="text-xs font-medium text-slate-800">HR workspace</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Demo account</p>
          </div>
        </div>
        <ArrowUpRight size={15} className="text-slate-400" />
      </div>
    </aside>
  )
}
