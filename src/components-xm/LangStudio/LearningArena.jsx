import { Link } from "react-router-dom";
import { 
  BookOpen, 
  PenTool, 
  Eye, 
  Mic, 
  Mail, 
  Headphones,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { useAuthStore } from "@/zustland/store.js";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

export default function LearningArena() {
  const { userDetail } = useAuthStore();

  const items = [
    {
      path: "/lang-studio/learning-arena/comprehension-skills",
      title: "Comprehension Skills",
      description: "Master reading comprehension with interactive exercises and expert guidance.",
      icon: <BookOpen size={48} className="text-blue-600" />,
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200 hover:border-blue-300"
    },
    {
      path: "/lang-studio/learning-arena/writing-skills",
      title: "Writing Skills",
      description: "Develop professional writing abilities through structured practice sessions.",
      icon: <PenTool size={48} className="text-green-600" />,
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200 hover:border-green-300"
    },
    {
      path: "/lang-studio/learning-arena/reading-skills",
      title: "Reading Skills",
      description: "Enhance reading speed and comprehension with proven techniques.",
      icon: <Eye size={48} className="text-purple-600" />,
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200 hover:border-purple-300"
    },
    {
      path: "/lang-studio/learning-arena/speaking-skills",
      title: "Speaking Skills",
      description: "Build confidence in public speaking and verbal communication.",
      icon: <Mic size={48} className="text-red-600" />,
      bgColor: "bg-red-50 hover:bg-red-100",
      borderColor: "border-red-200 hover:border-red-300"
    },
    {
      path: "/lang-studio/learning-arena/email-writing",
      title: "Email Writing",
      description: "Master professional email communication and business correspondence.",
      icon: <Mail size={48} className="text-indigo-600" />,
      bgColor: "bg-indigo-50 hover:bg-indigo-100",
      borderColor: "border-indigo-200 hover:border-indigo-300"
    },
    {
      path: "/lang-studio/learning-arena/listening-skills",
      title: "Listening Skills",
      description: "Improve active listening and comprehension abilities effectively.",
      icon: <Headphones size={48} className="text-orange-600" />,
      bgColor: "bg-orange-50 hover:bg-orange-100",
      borderColor: "border-orange-200 hover:border-orange-300"
    },
  ];

  return (
    <div className=" ">
      <div className="p-4 md:p-6 overflow-y-auto h-[calc(100svh-4em)]">
        {/* Header Section */}
        <Card className="w-full rounded-md border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-2xl backdrop-blur-sm py-4 mb-8">
          <CardHeader className="relative z-10 ">
          
            <CardTitle className="text-center tracking-wide text-3xl md:text-4xl  font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Learning Arena
            </CardTitle>
            <p className="text-center text-white/90 mt-4 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Master essential communication skills with our comprehensive learning modules designed for professional growth
            </p>
          </CardHeader>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <Card className={`h-full cursor-pointer shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${item.bgColor} ${item.borderColor}`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 tracking-wide mb-3 group-hover:text-gray-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-center mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    <span>Start Learning</span>
                    <ArrowRight size={16} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Welcome Message for Logged-in Users */}
        {userDetail && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
              <span className="text-gray-700 font-medium">
                Welcome back, {userDetail.name || 'Learner'}! Ready to enhance your skills?
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
