import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  FolderOpen,
  Shield,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  crimeStatistics,
  crimeReports,
  caseManagement,
} from "@/utils/dumm-data.js";

export default function DashboardPage() {
  const { user } = useAuth();

  const openCases = caseManagement.filter((c) => c.status !== "Closed").length;
  const openReports = crimeReports.filter((r) => r.status !== "Closed").length;
  const criticalCases = caseManagement.filter(
    (c) => c.priority === "Critical"
  ).length;

  const recentCases = [...caseManagement]
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 5);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {user?.name}. Here&apos;s what&apos;s happening in the
        system.
      </p>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Crime Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crimeReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {openReports} open reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCases}</div>
            <p className="text-xs text-muted-foreground">
              {criticalCases} critical priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Officers On Duty
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              4 investigators available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              8 new users this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Line Chart: Crime Trends */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Crime Trends</CardTitle>
            <CardDescription>
              Monthly crime report submissions for the past year
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={crimeStatistics.monthlyCrimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Crime Types */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Crime Types</CardTitle>
            <CardDescription>
              Distribution of reported crimes by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={crimeStatistics.crimeTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases & Case Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Cases List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Case Activity</CardTitle>
            <CardDescription>
              Latest updates on active investigations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map((caseItem) => {
                const caseReport = crimeReports.find(
                  (r) => r.id === caseItem.crimeReportId
                );
                return (
                  <div
                    key={caseItem.id}
                    className="flex items-center space-x-4 rounded-md border p-4"
                  >
                    <div
                      className={`
                      rounded-full p-2
                      ${
                        caseItem.priority === "Critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : caseItem.priority === "High"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }
                    `}
                    >
                      {caseItem.priority === "Critical" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {caseItem.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {caseReport?.type} • Updated {caseItem.lastUpdated}
                      </p>
                    </div>
                    <div
                      className={`
                      rounded-full px-2 py-1 text-xs font-medium
                      ${
                        caseItem.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : caseItem.status === "Closed"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      }
                    `}
                    >
                      {caseItem.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Case Status Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Case Status</CardTitle>
            <CardDescription>
              Current status of all reported cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] flex flex-col">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={crimeStatistics.caseStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {crimeStatistics.caseStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col rounded-md bg-muted p-3">
                  <span className="text-xs text-muted-foreground">
                    Year over Year
                  </span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      +{crimeStatistics.yearComparison.change}%
                    </span>
                    <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex flex-col rounded-md bg-muted p-3">
                  <span className="text-xs text-muted-foreground">
                    Solved Rate
                  </span>
                  <span className="text-2xl font-bold">
                    {crimeStatistics.solvedRate.solved}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
