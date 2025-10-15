import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import {
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Timer as Timeline,
  ShoppingBag,
} from "lucide-react";

import { GoalCard } from "../Modules";

import axiosConn from "@/axioscon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Calendar } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Schema for goal validation
const goalSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  targetDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid target date",
  }),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid start date",
  }),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ABANDONED"]),
  progress: z.number().min(0).max(100).default(0),
});

const MyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const form = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      targetDate: format(new Date(), "yyyy-MM-dd"),
      actualStartDate: "",
      actualEndDate: "",
      status: "NOT_STARTED",
      progress: 0,
    },
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = () => {
    axiosConn
      .post("/goal/search", {})
      .then(({ data }) => {
        if (data.success) {
          const formattedGoals = data.data.map((goal) => ({
            id: goal.userGoalId,
            title: goal.title,
            description: goal.description,
            startDate: goal.startDate,
            targetDate: goal.endDate,
            actualStartDate: goal.actualStartDate,
            actualEndDate: goal.actualEndDate,
            status: goal.status,
            progress: goal.progress || 0,
            createdAt: goal.createdAt,
          }));
          setGoals(formattedGoals);
        }
      })
      .catch((error) => {
        console.error("Error loading goals:", error);
      });
  };

  const onSubmit = (data) => {
    let progress = data.progress;

    // Automatically adjust progress based on status
    if (data.status === "COMPLETED") {
      progress = 100;
    } else if (data.status === "NOT_STARTED") {
      progress = 0;
    }

    const requestBody = {
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.targetDate).toISOString(),
      actualStartDate: data.actualStartDate
        ? new Date(data.actualStartDate).toISOString()
        : null,
      actualEndDate: data.actualEndDate
        ? new Date(data.actualEndDate).toISOString()
        : null,
      status: data.status,
      progress: progress,
    };

    if (editingGoal) {
      requestBody.userGoalId = editingGoal.id;
    }

    axiosConn
      .post("/goal/createOrUpdate", requestBody)
      .then((res) => {
        fetchGoals();
        setIsOpen(false);
        setEditingGoal(null);
        form.reset();
      })
      .catch((error) => {
        console.error("Error saving goal:", error);
      });
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description,
      startDate: format(new Date(goal.startDate), "yyyy-MM-dd"),
      targetDate: format(new Date(goal.targetDate), "yyyy-MM-dd"),
      actualStartDate: goal.actualStartDate
        ? format(new Date(goal.actualStartDate), "yyyy-MM-dd")
        : "",
      actualEndDate: goal.actualEndDate
        ? format(new Date(goal.actualEndDate), "yyyy-MM-dd")
        : "",
      status: goal.status,
      progress: goal.progress,
    });
    setIsOpen(true);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[30ch]">
                My Goals
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto sm:flex-initial"></div>
      </header>

      <div className="p-4 mx-auto  ">
        {/* Header Section */}
        <Card className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  rounded-2xl text-white shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-wide flex items-center justify-center gap-3">
              <ShoppingBag className="w-8 h-8" />
              My Goals
            </CardTitle>
          </CardHeader>
        </Card>

        <div className=" ">
          <GoalsAnalyticsDashboard goalsData={goals} />
          <div className="flex justify-between items-center my-6">
            {/* <h2 className="text-2xl font-bold">My Goals</h2> */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setEditingGoal(null);
                    form.reset();
                  }}
                >
                  Add New Goal
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col h-full p-0">
                <div className="px-6 py-6 h-full flex flex-col">
                  <SheetHeader className="px-0">
                    <SheetTitle>
                      {editingGoal ? "Edit Goal" : "Create New Goal"}
                    </SheetTitle>
                    <SheetDescription>
                      {editingGoal
                        ? "Update your existing goal"
                        : "Add a new goal to track your progress"}
                    </SheetDescription>
                  </SheetHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex-1 overflow-y-auto space-y-4 py-4 px-2  h-[calc(100svh-5em)]"
                    >
                      <div className="">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter goal title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter goal description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="progress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Progress (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="actualStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Actual Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="actualEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Actual End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full p-2 border rounded-md"
                                >
                                  <option value="NOT_STARTED">
                                    Not Started
                                  </option>
                                  <option value="IN_PROGRESS">
                                    In Progress
                                  </option>
                                  <option value="COMPLETED">Completed</option>
                                  <option value="ABANDONED">Abandoned</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex-shrink-0 py-4 mt-auto border-t sticky bottom-0 bg-white">
                        <SheetFooter className="w-full">
                          <Button type="submit" className="w-full">
                            {editingGoal ? "Update Goal" : "Create Goal"}
                          </Button>
                        </SheetFooter>
                      </div>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onGoalUpdate={fetchGoals}
                onEditGoal={handleEdit}
              />
            ))}
          </div>

          {/* Details Sheet has been moved to GoalCard component */}
        </div>{" "}
      </div>
    </div>
  );
};

export default MyGoals;

const GoalsAnalyticsDashboard = ({ goalsData }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalGoals = goalsData.length;
    const inProgressGoals = goalsData.filter(
      (g) => g.status === "IN_PROGRESS"
    ).length;
    const notStartedGoals = goalsData.filter(
      (g) => g.status === "NOT_STARTED"
    ).length;
    const averageProgress = totalGoals > 0 
      ? Math.round(goalsData.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
      : 0;

    // Progress distribution
    const progressDistribution = [
      { range: "0%", count: goalsData.filter((g) => g.progress === 0).length },
      {
        range: "1-25%",
        count: goalsData.filter((g) => g.progress > 0 && g.progress <= 25)
          .length,
      },
      {
        range: "26-50%",
        count: goalsData.filter((g) => g.progress > 25 && g.progress <= 50)
          .length,
      },
      {
        range: "51-75%",
        count: goalsData.filter((g) => g.progress > 50 && g.progress <= 75)
          .length,
      },
      {
        range: "76-100%",
        count: goalsData.filter((g) => g.progress > 75).length,
      },
    ];

    // Timeline data
    const timelineData = goalsData
      .filter((g) => g.actualStartDate)
      .map((g) => ({
        date: new Date(g.actualStartDate).toLocaleDateString(),
        goalId: g.userGoalId,
        title: g.title,
        progress: g.progress,
        status: g.status,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Status distribution
    const statusData = [
      { name: "In Progress", value: inProgressGoals, color: "#3b82f6" },
      { name: "Not Started", value: notStartedGoals, color: "#ef4444" },
      { name: "Completed", value: 0, color: "#10b981" },
    ];

    return {
      totalGoals,
      inProgressGoals,
      notStartedGoals,
      averageProgress,
      progressDistribution,
      timelineData,
      statusData,
    };
  }, [goalsData]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  const TimelineItem = ({ goal, index }) => (
    <div className="flex items-start space-x-4 pb-8">
      <div className="flex-shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            goal.status === "IN_PROGRESS"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {goal.status === "IN_PROGRESS" ? (
            <Target className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {goal.title}
            </h4>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                goal.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {goal.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">{goal.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{goal.date}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {goal.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Goals"
          value={analytics.totalGoals}
          icon={Target}
          color="text-purple-600"
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgressGoals}
          icon={TrendingUp}
          color="text-blue-600"
        />
        <StatCard
          title="Not Started"
          value={analytics.notStartedGoals}
          icon={Clock}
          color="text-orange-600"
        />
        <StatCard
          title="Average Progress"
          value={`${analytics.averageProgress}%`}
          icon={CheckCircle}
          color="text-green-600"
        />
      </div>
    </div>
  );
};
