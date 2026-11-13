import { Bell, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import type {
  AutomationSignalStatus,
  InternalTaskStatus,
} from "../types/dataModel";
import { SectionPlaceholder } from "../components/SectionPlaceholder";
import { AutomationCenter } from "../features/automation/AutomationCenter";
import { Analytics } from "../features/analytics/Analytics";
import { Dashboard } from "../features/dashboard/Dashboard";
import { Sidebar } from "../components/Sidebar";
import { loadAppData, saveAppData } from "../services/appDataStorage";

const sectionDescriptions: Record<string, string> = {
  "Панель управления":
    "Ключевые показатели адаптации, ранних увольнений и состояния задач.",
  Аналитика:
    "Сравнение увольнений по подразделениям и анализ причин за выбранный период.",
  "Центр автоматизации":
    "Просматривайте сигналы о проблемах адаптации и управляйте внутренними задачами.",
  Сотрудники:
    "Здесь появятся список сотрудников и карточки адаптации после добавления данных.",
};

function App() {
  const [activeSection, setActiveSection] = useState("Панель управления");
  const [appData, setAppData] = useState(loadAppData);
  const [storageError, setStorageError] = useState(false);

  function updateSignalStatus(
    signalId: string,
    status: AutomationSignalStatus,
  ) {
    const updatedData = {
      ...appData,
      automationSignals: appData.automationSignals.map((signal) =>
        signal.id === signalId ? { ...signal, status } : signal,
      ),
    };

    setAppData(updatedData);
    setStorageError(!saveAppData(updatedData));
  }

  function updateTaskStatus(taskId: string, status: InternalTaskStatus) {
    const updatedData = {
      ...appData,
      internalTasks: appData.internalTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    };

    setAppData(updatedData);
    setStorageError(!saveAppData(updatedData));
  }

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
            <button
              type="button"
              aria-label="Поиск"
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Search size={17} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Уведомления"
              className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Bell size={17} strokeWidth={1.8} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>
            <span className="mx-1 h-6 w-px bg-slate-200" />
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">
                HR
              </span>
              <span className="hidden text-xs font-medium text-slate-700 sm:block">
                Демо-аккаунт
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-9 md:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-400">
                Аналитика персонала / Обзор
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">
                {activeSection}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                {sectionDescriptions[activeSection]}
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
              Демонстрационная среда
            </span>
          </div>

          {activeSection === "Панель управления" ? (
            <Dashboard data={appData} />
          ) : activeSection === "Аналитика" ? (
            <Analytics data={appData} />
          ) : activeSection === "Центр автоматизации" ? (
            <AutomationCenter
              data={appData}
              onSignalStatusChange={updateSignalStatus}
              onTaskStatusChange={updateTaskStatus}
            />
          ) : (
            <SectionPlaceholder
              section={activeSection}
              description={sectionDescriptions[activeSection]}
            />
          )}

          {storageError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
            >
              Изменения применены, но браузер не смог сохранить их на этом
              устройстве.
            </p>
          )}

          <footer className="mt-6 flex flex-col gap-1 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Newbie HR · Аналитика персонала</span>
            <span>
              Демонстрационный интерфейс · Реальные данные HR не подключены
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
