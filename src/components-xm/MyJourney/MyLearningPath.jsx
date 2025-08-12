import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ExternalLink,
  Terminal,
  BookOpen,
  Calendar,
  Users,
  Clock,
  MapPin,
  User,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/zustland/store.js";
import React, { useEffect, useState } from "react";
import axiosConn from "@/axioscon.js";
import { Link, Outlet } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderOne } from "@/components/ui/loader.jsx";

export function MyLearningPath() {
  const {
    userDetail,
    userEnrolledCourseIdList,
    fetchUserEnrolledCourseIdList,
  } = useAuthStore();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [courseList, setCourseList] = useState({});
  const [loading, setLoading] = useState(false); // local loader

  const [apiQuery, setApiQuery] = useState({
    limit: limit,
    offset: offset,
    getThisData: {
      datasource: "UserEnrollment",
      attributes: [],
      where: { userId: userDetail?.userId, courseId: { $ne: null } },
      include: [
        {
          datasource: "Course",
          as: "course",
          required: false,
          order: [],
          attributes: [],
          where: {},
        },
      ],
    },
  });

  useEffect(() => {
    fetchCourses();
  }, [apiQuery]);

  const fetchCourses = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery)
      .then((res) => {
        console.log(res.data.data?.results?.map((a) => a.course));
        setCourseList(res.data.data?.results?.map((a) => a.course));
        setTotalCount(res.data.data.totalCount);
        setOffset(res.data.data.offset);
        setLimit(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount1, setTotalCount1] = useState(0);
  const [limit1, setLimit1] = useState(5);
  const [offset1, setOffset1] = useState(0);
  const [courseList1, setCourseList1] = useState({});

  const [apiQuery1, setApiQuery1] = useState({
    limit: limit1,
    offset: offset1,
    getThisData: {
      datasource: "UserEnrollment",
      attributes: [],
      where: { userId: userDetail?.userId, webinarId: { $ne: null } },
      include: [
        {
          datasource: "Webinar",
          as: "webinar",
          required: false,
          order: [],
          attributes: [],
          where: {},
        },
      ],
    },
  });

  useEffect(() => {
    fetchWebinar();
  }, [apiQuery1]);

  const fetchWebinar = () => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery1)
      .then((res) => {
        console.log(res.data);
        setCourseList1(res.data.data?.results?.map((a) => a.webinar));
        setTotalCount1(res.data.data.totalCount);
        setOffset1(res.data.data.offset);
        setLimit1(res.data.data.limit);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount2, setTotalCount2] = useState(0);
  const [limit2, setLimit2] = useState(5);
  const [offset2, setOffset2] = useState(0);
  const [mockInterviewHistoryList, setMockInterviewHistoryList] = useState([]);

  const [apiQuery2, setApiQuery2] = useState({
    limit: limit2,
    offset: offset2,
    getThisData: {
      datasource: "InterviewReq",
      attributes: [],
      where: { userId: userDetail?.userId },
    },
  });

  useEffect(() => {
    fetchMockInterviewHistory();
  }, [apiQuery2]);

  const fetchMockInterviewHistory = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery2)
      .then((res) => {
        console.log(res.data);
        setMockInterviewHistoryList(res.data.data?.results);
        setTotalCount2(res.data.data.totalCount);
        setOffset2(res.data.data.offset);
        setLimit2(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount3, setTotalCount3] = useState(0);
  const [limit3, setLimit3] = useState(5);
  const [offset3, setOffset3] = useState(0);
  const [counsellingHistoryList, setCounsellingHistoryList] = useState([]);

  const [apiQuery3, setApiQuery3] = useState({
    limit: limit3,
    offset: offset3,
    getThisData: {
      datasource: "Counselling",
      attributes: [],
      where: { userId: userDetail?.userId },
    },
  });

  useEffect(() => {
    fetchCounsellingHistory();
  }, [apiQuery3]);

  const fetchCounsellingHistory = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/searchCourse", apiQuery3)
      .then((res) => {
        console.log(res.data);
        setCounsellingHistoryList(res.data.data?.results);
        setTotalCount3(res.data.data.totalCount);
        setOffset3(res.data.data.offset);
        setLimit3(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [totalCount4, setTotalCount4] = useState(0);
  const [limit4, setLimit4] = useState(5);
  const [offset4, setOffset4] = useState(0);
  const [scheduledMeetList, setScheduledMeetList] = useState([]);

  useEffect(() => {
    fetchScheduledMeetHistory();
  }, [offset4]);

  const fetchScheduledMeetHistory = () => {
    setLoading(true);
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/fetchScheduledCourseMeet", {
        page: offset4,
        limit: limit4,
      })
      .then((res) => {
        console.log(res.data);
        setScheduledMeetList(res.data?.data?.results);
        setTotalCount4(res.data.data.totalCount);
        setOffset4(res.data.data.offset);
        setLimit4(res.data.data.limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const [historySelection, setHistorySelection] = useState("CourseHistory");

  const getStatusBadge = (status) => {
    const variants = {
      ENROLLED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PENDING: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100svh] w-full bg-gradient-to-br from-slate-50 to-gray-100">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4 md:p-6  mx-auto">
        <Card className="w-full rounded-sm border-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-700 text-white shadow-2xl mb-8  ">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-center tracking-wider">
              MY JOURNEY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer bg-white text-black hover:bg-black hover:text-white">Courses</Badge>
                <Badge variant="outline" className="cursor-pointer bg-white text-black hover:bg-black hover:text-white">Wishlist</Badge>
                <Badge variant="outline" className="cursor-pointer bg-white text-black hover:bg-black hover:text-white">Orders</Badge>
            </div>
          </CardContent>
        </Card>

        <Outlet></Outlet>
      </div>
    </div>
  );
}
