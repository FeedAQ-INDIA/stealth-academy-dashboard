import React, { useState } from "react";
import {
  Play,
  Book,
  Brain,
  User,
  ChevronDown,
  Sparkles,
  Zap,
  BookOpen,
  Target,
  Clock,
  Award,
  FileText,
  Cpu,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button";
 
const LearningArenaItem = () => {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [topicSource, setTopicSource] = useState("ai-generated");
  const [customTopic, setCustomTopic] = useState("");
  const [aiTopicPrompt, setAiTopicPrompt] = useState("");

  const levels = [
    {
      id: "beginner",
      label: "Beginner",
      color: "bg-green-100 text-green-800",
      description: "Perfect for starting your journey",
      duration: "15-20 min",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      color: "bg-yellow-100 text-yellow-800",
      description: "Build upon your foundation",
      duration: "20-30 min",
    },
    {
      id: "advanced",
      label: "Advanced",
      color: "bg-red-100 text-red-800",
      description: "Challenge yourself further",
      duration: "30-45 min",
    },
  ];

  const handleAutoGenerate = () => {
    // Here you would integrate with your AI service
    console.log("Auto-generating topic with prompt:", aiTopicPrompt);
    // For demo purposes, you could set a loading state and simulate API call
  };

  return (
    <div className="p-4 overflow-y-auto h-[calc(100svh-4em)]">
      {/* Header Section - More Compact */}
      <Card className="w-full rounded-2xl border-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl mb-6">
        <CardHeader className="py-6 px-6">
          <CardTitle className="text-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Comprehension Learning Arena
          </CardTitle>
          <p className="text-center text-white/90 mt-2 text-sm md:text-base max-w-2xl mx-auto">
            Master reading comprehension with AI-powered interactive exercises
          </p>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto lg:items-stretch">
          {/* Level Selection Card */}
          <Card className="shadow-lg border border-gray-200 bg-white flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                Select Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <div className="grid gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedLevel === level.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">
                          {level.label}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          {level.description}
                        </p>
                      </div>
                      {/* <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}
                      >
                        {level.duration}
                      </span> */}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Demo Video Card */}
          <Card className="shadow-lg border border-gray-200 bg-white flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Play className="w-4 h-4 text-blue-600" />
                </div>
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex items-center">
              <div className="relative aspect-video w-full">
                <iframe 
                  className="w-full h-full rounded-lg shadow-md"
                  src="https://www.youtube.com/embed/tgbNymZ7vqY?controls=0"
                  title="How It Works Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>


        <div className=" mx-auto my-6">
          {/* Left Column - Level Selection & Topic Source */}
          <div className="space-y-6">
            {/* Topic Source Selection Card */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  Choose Topic Source
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Topic Source Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setTopicSource("ai-generated")}
                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      topicSource === "ai-generated"
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                        <Cpu className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">
                          AI Generated Topic
                        </div>
                        <div className="text-xs text-gray-600">
                          Let AI create personalized content
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTopicSource("custom")}
                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
                      topicSource === "custom"
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">
                          Bring Your Own Topic
                        </div>
                        <div className="text-xs text-gray-600">
                          Upload or specify your content
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* AI Topic Input */}
                {topicSource === "ai-generated" && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <label className="block text-sm font-medium text-purple-900 mb-2">
                        What would you like to learn about? 
                      </label>
                      <textarea
                        value={aiTopicPrompt}
                        onChange={(e) => setAiTopicPrompt(e.target.value)}
                        placeholder="e.g., 'Climate change effects on wildlife' or 'AI in healthcare'..."
                        className="w-full p-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm resize-none"
                        rows="3"
                      />
                    </div>
                    <button
                      onClick={handleAutoGenerate}
                       className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md text-sm"
                    >
                      <Zap className="w-4 h-4" />
                      Generate Topic
                    </button>
                  </div>
                )}

                {/* Custom Topic Input */}
                {topicSource === "custom" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <label className="block text-sm font-medium text-green-900 mb-2">
                        Enter your topic or paste text:
                      </label>
                      <textarea
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Paste your text here or describe the topic..."
                        className="w-full p-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm resize-none"
                        rows="4"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

      
        </div>
      </div>

      {/* Start Button - Fixed at bottom */}
      <div className="mt-8 max-w-6xl mx-auto">
        <Button
          disabled={
            (topicSource === "ai-generated" && (!aiTopicPrompt.trim())) ||
            (topicSource === "custom" && !customTopic.trim())
          }
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-xl text-base"
        >
          <Play className="w-5 h-5" />
          Start Learning Session
        </Button>
      </div>
    </div>
  );
};

export default LearningArenaItem;
