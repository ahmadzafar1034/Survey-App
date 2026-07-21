"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CalendarClock,
  TrendingUp,
  Download,
  LogOut,
  Home,
  School,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useSurveyStore } from "@/lib/survey-store";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

type Stats = {
  success: boolean;
  total: number;
  today: number;
  last7Days: { date: string; count: number }[];
  universityBreakdown: { label: string; count: number }[];
  genderBreakdown: { label: string; count: number }[];
  fieldBreakdown: { label: string; count: number }[];
};

type ResponsesData = {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rows: Array<{
    id: string;
    submittedAt: string;
    ipAddress: string;
    q1_3_name: string | null;
    q1_4_age: number | null;
    q1_5_gender: string | null;
    q1_1_university: string | null;
    q1_1_university_other: string | null;
    q1_2_field: string | null;
    q1_7_semester: string | null;
  }>;
};

const UNIVERSITY_LABELS: Record<string, string> = {
  "1": "Fatima Jinnah Women University",
  "2": "Arid Agriculture University",
  "3": "COMSATS University",
  "4": "IIUI",
  "5": "Quaid e Azam University",
  "6": "University of Gujrat",
  "7": "FAST NUCES",
  "8": "NUST",
  "9": "Air University Islamabad",
  "10": "University of Haripur",
  "11": "Other",
};
const FIELD_LABELS: Record<string, string> = {
  "1": "CS & IT",
  "2": "Engineering",
  "3": "Business",
  "4": "Social Sciences",
  "5": "Natural Sciences",
  "6": "Medical & Health",
  "7": "Arts, Design & Arch.",
  "8": "Law",
  "9": "Agriculture",
  "10": "Other",
};
const GENDER_LABELS: Record<string, string> = {
  "1": "Male",
  "2": "Female",
};

const PIE_COLORS = [
  "#102d4d", "#1b5c8c", "#3a87bf", "#5fa8d3", "#f0a04b",
  "#e74c3c", "#9b59b6", "#27ae60", "#34495e", "#f1c40f",
];

export function AdminDashboard() {
  const { adminToken, setAdminToken, setStage } = useSurveyStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [responses, setResponses] = useState<ResponsesData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        setAdminToken(null);
        setStage("welcome");
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      toast.error("Failed to load statistics.");
    }
  }, [adminToken, setAdminToken, setStage]);

  const fetchResponses = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/responses?page=${page}&pageSize=20`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        setAdminToken(null);
        setStage("welcome");
        return;
      }
      const data = await res.json();
      setResponses(data);
    } catch (e) {
      toast.error("Failed to load responses.");
    } finally {
      setLoading(false);
    }
  }, [adminToken, page, setAdminToken, setStage]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const handleExport = async () => {
    if (!adminToken) return;
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) {
        toast.error("Export failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-responses-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CSV exported (Excel-compatible).");
    } catch (e) {
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setStage("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!adminToken) {
    // Should never happen — admin route guard. But just in case.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Not authenticated.</p>
            <Button
              className="mt-3"
              onClick={() => setStage("welcome")}
            >
              Back to home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const today = new Date();
  const last7 = stats?.last7Days || [];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <div>
              <div className="text-sm font-semibold leading-tight">
                Admin Dashboard
              </div>
              <div className="text-xs text-muted-foreground">
                Survey 2026 · National Survey Team
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchStats();
                fetchResponses();
              }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStage("welcome")}
            >
              <Home className="h-3.5 w-3.5 mr-1.5" /> Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Responses
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {stats?.total ?? "—"}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                All-time submissions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Today&apos;s Responses
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {stats?.today ?? "—"}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Since {today.toLocaleDateString()} 00:00
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Last 7 Days Total
                  </div>
                  <div className="text-3xl font-bold mt-1">
                    {last7.reduce((a, b) => a + b.count, 0)}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Rolling weekly submissions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily submissions chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Submissions (Last 7 Days)</CardTitle>
            <CardDescription>
              Number of surveys submitted per day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4dde9" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => {
                      const dt = new Date(d);
                      return dt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    stroke="#4a5b73"
                    fontSize={12}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#4a5b73"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #d4dde9",
                      borderRadius: 8,
                    }}
                    labelFormatter={(d) => new Date(d).toLocaleDateString()}
                  />
                  <Bar
                    dataKey="count"
                    fill="#102d4d"
                    radius={[4, 4, 0, 0]}
                    name="Submissions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <School className="h-4 w-4" /> University Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.universityBreakdown && stats.universityBreakdown.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.universityBreakdown}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) =>
                          entry.count > 0 ? `${entry.label}` : ""
                        }
                      >
                        {stats.universityBreakdown.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Gender Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.genderBreakdown && stats.genderBreakdown.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.genderBreakdown}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.label}: ${entry.count}`}
                      >
                        {stats.genderBreakdown.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Field of Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.fieldBreakdown && stats.fieldBreakdown.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.fieldBreakdown}
                      layout="vertical"
                      margin={{ left: 30, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#d4dde9" />
                      <XAxis type="number" stroke="#4a5b73" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        stroke="#4a5b73"
                        fontSize={11}
                        width={100}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#1b5c8c"
                        radius={[0, 4, 4, 0]}
                        name="Responses"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyChart />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Responses table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Responses</CardTitle>
            <CardDescription>
              Latest survey submissions. Use the CSV export for full data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : responses && responses.rows.length > 0 ? (
              <>
                <div className="overflow-x-auto rounded border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="whitespace-nowrap">Submitted</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Semester</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responses.rows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(r.submittedAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {r.q1_3_name || "—"}
                          </TableCell>
                          <TableCell>{r.q1_4_age ?? "—"}</TableCell>
                          <TableCell>
                            {r.q1_5_gender
                              ? GENDER_LABELS[r.q1_5_gender] || "—"
                              : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.q1_1_university === "11"
                              ? r.q1_1_university_other || "Other"
                              : r.q1_1_university
                              ? UNIVERSITY_LABELS[r.q1_1_university] || "—"
                              : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {r.q1_2_field
                              ? FIELD_LABELS[r.q1_2_field] || "—"
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {r.q1_7_semester ? (
                              <Badge variant="outline">
                                Sem {r.q1_7_semester}
                              </Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-muted-foreground">
                    Page {responses.page} of {responses.totalPages} ·{" "}
                    {responses.total} total
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={responses.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={responses.page >= responses.totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(responses.totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No responses yet. Be the first to submit the survey!
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border bg-card py-4 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground">
          © 2026 National Survey Team · Admin Dashboard
        </div>
      </footer>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}
