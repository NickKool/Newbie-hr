import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DepartmentDepartureDistribution,
  DepartureReasonDistribution,
  MonthlyHiringDepartureTrend,
} from "../analytics/metrics";

const chartColors = [
  "#6366f1",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#8b5cf6",
];
const axisStyle = { fontSize: 11, fill: "#94a3b8" };
const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
};

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

type DashboardChartsProps = {
  monthlyTrend: MonthlyHiringDepartureTrend[];
  departmentDepartures: DepartmentDepartureDistribution[];
  departureReasons: DepartureReasonDistribution[];
  earlyDepartureByDepartment: DepartmentDepartureDistribution[];
};

export function DashboardCharts({
  monthlyTrend,
  departmentDepartures,
  departureReasons,
  earlyDepartureByDepartment,
}: DashboardChartsProps) {
  const monthlyData = monthlyTrend.map((item) => ({
    ...item,
    month: item.month.slice(0, 3),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        title="Динамика найма и увольнений"
        description="Количество событий по месяцам за последние 12 месяцев"
      >
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis
                dataKey="month"
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "#334155", fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  color: "#64748b",
                  paddingTop: 12,
                }}
              />
              <Bar
                dataKey="hires"
                name="Принято"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="departures"
                name="Уволено"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={18}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Увольнения по подразделениям"
        description="Все увольнения и ранние увольнения до 90 дней"
      >
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentDepartures}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="departmentName"
                width={78}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  color: "#64748b",
                  paddingTop: 12,
                }}
              />
              <Bar
                dataKey="departures"
                name="Все увольнения"
                fill="#94a3b8"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="earlyDepartures"
                name="Ранние"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Причины увольнений"
        description="Распределение по указанным причинам"
      >
        <div className="flex h-[250px] items-center justify-center gap-5">
          <div className="h-full min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departureReasons}
                  dataKey="departures"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="82%"
                  paddingAngle={3}
                >
                  {departureReasons.map((item, index) => (
                    <Cell
                      key={item.reason}
                      fill={chartColors[index % chartColors.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`${value}`, "Увольнений"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-[145px] shrink-0 space-y-3">
            {departureReasons.map((item, index) => (
              <li
                key={item.reason}
                className="flex items-start gap-2 text-[11px] text-slate-500"
              >
                <span
                  className="mt-0.5 size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="min-w-0 flex-1 leading-4">{item.reason}</span>
                <span className="font-semibold text-slate-700">
                  {item.departures}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>

      <ChartCard
        title="Доля ранних увольнений по отделам"
        description="Ранние увольнения среди всех увольнений подразделения"
      >
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={earlyDepartureByDepartment}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value: number) => `${value}%`}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="departmentName"
                width={78}
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [
                  typeof value === "number"
                    ? `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value)}%`
                    : "Нет данных",
                  "Доля ранних увольнений",
                ]}
              />
              <Bar
                dataKey="earlyDepartureRate"
                name="Доля ранних увольнений"
                fill="#6366f1"
                radius={[0, 5, 5, 0]}
                maxBarSize={22}
              >
                {earlyDepartureByDepartment.map((item) => (
                  <Cell
                    key={item.departmentId}
                    fill={
                      item.departmentId === "department-warehouse"
                        ? "#f59e0b"
                        : "#818cf8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
