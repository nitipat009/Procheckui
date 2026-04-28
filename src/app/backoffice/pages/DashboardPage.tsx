import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Eye, Users, Search, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/Shell";

const RANGES = [
  { key: "today", label: "วันนี้" },
  { key: "7d", label: "7 วัน" },
  { key: "30d", label: "30 วัน" },
  { key: "custom", label: "Custom" },
];

const traffic = Array.from({ length: 14 }, (_, i) => ({
  id: `t${i}`,
  day: `${i + 1}/4`,
  visits: 800 + Math.round(Math.random() * 600),
  unique: 500 + Math.round(Math.random() * 400),
}));

const keywords = [
  { id: "k1", name: "AIS 5G ไม่อั้น", count: 4820 },
  { id: "k2", name: "True เน็ตบ้าน 1Gbps", count: 3641 },
  { id: "k3", name: "dtac roaming Japan", count: 2987 },
  { id: "k4", name: "NT Fiber 500", count: 2341 },
  { id: "k5", name: "AIS Fibre 3", count: 2102 },
];

const popularPackages = [
  { id: "p1", name: "AIS Max Speed Unlimited 5G", count: 8421 },
  { id: "p2", name: "True 5G Unlimited Plus", count: 7299 },
  { id: "p3", name: "dtac SUPER Save 599", count: 5894 },
  { id: "p4", name: "NT Fiber Pro 1Gbps", count: 4127 },
  { id: "p5", name: "AIS Fibre 3 Plus", count: 3891 },
];

const devices = [
  { id: "d1", name: "Mobile", value: 62 },
  { id: "d2", name: "Desktop", value: 28 },
  { id: "d3", name: "Tablet", value: 10 },
];
const sources = [
  { id: "s1", name: "Organic", value: 48 },
  { id: "s2", name: "Direct", value: 32 },
  { id: "s3", name: "Referral", value: 20 },
];

const COLORS = ["#F6F3E4", "rgba(246,243,228,0.75)", "rgba(246,243,228,0.55)", "rgba(246,243,228,0.35)"];

function Card({ children, className = "" }: any) {
  return <div className={`nbtc-panel rounded-xl p-5 ${className}`}>{children}</div>;
}

function Kpi({ icon: Icon, label, value, delta }: any) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-medium text-gray-900 mt-1">{value}</div>
          {delta && (
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {delta}
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B5ED7] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const [range, setRange] = useState("7d");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="ภาพรวมการใช้งาน platform"
        actions={
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  range === r.key ? "bg-[#0B5ED7] text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={Eye} label="ผู้เข้าชมทั้งหมด" value="124,932" delta="+12.4% vs prev" />
        <Kpi icon={Users} label="Unique Visitors" value="48,217" delta="+8.1%" />
        <Kpi icon={Search} label="การค้นหา" value="32,541" delta="+15.2%" />
        <Kpi icon={TrendingUp} label="หน้าที่ดูมากสุด" value="/search-result" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <div className="text-sm font-medium text-gray-900 mb-3">Traffic Overview</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line key="line-visits" type="monotone" dataKey="visits" stroke="#F6F3E4" strokeWidth={2} dot={false} name="Visits" />
                <Line key="line-unique" type="monotone" dataKey="unique" stroke="rgba(246,243,228,0.7)" strokeWidth={2} dot={false} name="Unique" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-gray-900 mb-3">Device</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {devices.map((d, i) => (
                    <Cell key={`device-${d.name}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm font-medium text-gray-900 mb-3">คำค้นหายอดนิยม</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={keywords} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
                <Tooltip />
                <Bar dataKey="count" fill="#F6F3E4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-gray-900 mb-3">แพ็กเกจยอดนิยม</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={popularPackages} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                <Tooltip />
                <Bar dataKey="count" fill="rgba(246,243,228,0.7)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-gray-900 mb-3">Traffic by Source</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sources} dataKey="value" nameKey="name" outerRadius={85}>
                  {sources.map((s, i) => (
                    <Cell key={`source-${s.name}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
