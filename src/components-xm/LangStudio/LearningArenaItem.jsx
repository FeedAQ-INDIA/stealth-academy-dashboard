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
  CheckCircle,
  X,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
 
const LearningArenaItem = () => {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [topicSource, setTopicSource] = useState("ai-generated");
  const [customTopic, setCustomTopic] = useState("");
  const [aiTopicPrompt, setAiTopicPrompt] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const levels = [
    {
      id: "beginner",
      label: "Beginner",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Perfect for starting your journey",
      duration: "15-20 min",
      icon: <Target className="w-4 h-4" />,
      features: ["Basic comprehension", "Simple vocabulary", "Guided practice"]
    },
    {
      id: "intermediate",
      label: "Intermediate",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      description: "Build upon your foundation",
      duration: "20-30 min",
      icon: <BookOpen className="w-4 h-4" />,
      features: ["Complex passages", "Critical thinking", "Inference skills"]
    },
    {
      id: "advanced",
      label: "Advanced",
      color: "bg-rose-100 text-rose-800 border-rose-300",
      description: "Challenge yourself further",
      duration: "30-45 min",
      icon: <Award className="w-4 h-4" />,
      features: ["Advanced analysis", "Multiple perspectives", "Expert-level content"]
    },
  ];

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    // Here you would integrate with your AI service
    console.log("Auto-generating topic with prompt:", aiTopicPrompt);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleStartLearning = () => {
    setShowConfirmDialog(true);
  };

  const confirmStartLearning = () => {
    setShowConfirmDialog(false);
    // Start the learning session
    console.log("Starting learning session with:", {
      level: selectedLevel,
      source: topicSource,
      topic: topicSource === "ai-generated" ? aiTopicPrompt : customTopic
    });
  };

  const getSelectedLevelData = () => {
    return levels.find(level => level.id === selectedLevel);
  };

  const isReadyToStart = () => {
    return (topicSource === "ai-generated" && aiTopicPrompt.trim()) ||
           (topicSource === "custom" && customTopic.trim());
  };

  return (
    <div className="p-4 overflow-y-auto h-[calc(100svh-4em)]">
      {/* Header Section - Enhanced with better visual hierarchy */}
      <Card className="w-full rounded-md border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <CardHeader className="py-8 px-6 relative z-10">
          {/* <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div> */}
          <CardTitle className="text-center text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Comprehension Learning Arena
          </CardTitle>
          <p className="text-center text-white/90 mt-3 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Master reading comprehension with AI-powered interactive exercises designed to enhance your skills
          </p>
          {/* <div className="flex justify-center mt-6 space-x-6 text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span>Adaptive timing</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Target className="w-4 h-4" />
              <span>Personalized content</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Award className="w-4 h-4" />
              <span>Progress tracking</span>
            </div>
          </div> */}
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto lg:items-stretch">
          {/* Level Selection Card - Enhanced with better visual design */}
          <Card className="shadow-xl border-0 bg-white flex flex-col hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-xl shadow-md">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Select Your Challenge Level
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Choose the difficulty that matches your current skill level</p>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <div className="space-y-4">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      selectedLevel === level.id
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${selectedLevel === level.id ? 'bg-blue-100' : 'bg-gray-100'} group-hover:scale-110 transition-transform`}>
                          {level.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900 text-base">
                              {level.label}
                            </span>
                            {/* <Badge className={`text-xs ${level.color} border`}>
                              {level.duration}
                            </Badge> */}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {level.description}
                          </p>
                          {/* <div className="space-y-1">
                            {level.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div> */}
                        </div>
                      </div>
                      {selectedLevel === level.id && (
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Demo Video Card - Enhanced */}
          <Card className="shadow-xl border-0 bg-white flex flex-col hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl shadow-md">
                  <Play className="w-5 h-5 text-white" />
                </div>
                How It Works
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Watch a quick demonstration of the learning process</p>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex items-center">
              <div className="relative aspect-video w-full group">
                <iframe 
                  className="w-full h-full rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  src="https://www.youtube.com/embed/tgbNymZ7vqY?controls=0"
                  title="How It Works Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className=" mx-auto my-6">
          {/* Left Column - Level Selection & Topic Source */}
          <div className="space-y-6">
            {/* Topic Source Selection Card - Enhanced */}
            <Card className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-500 rounded-xl shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Choose Your Topic Source
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Select how you'd like to generate your learning content</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Topic Source Buttons - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTopicSource("ai-generated")}
                    className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                      topicSource === "ai-generated"
                        ? "border-purple-500 bg-purple-50 shadow-lg scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 transition-all group-hover:scale-110 ${
                        topicSource === "ai-generated" ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'
                      }`}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-base mb-1">
                          AI Generated Topic
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          Let our advanced AI create personalized, engaging content tailored to your interests
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-purple-600">
                          <Sparkles className="w-3 h-3" />
                          <span>Recommended for variety</span>
                        </div>
                      </div>
                      {topicSource === "ai-generated" && (
                        <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setTopicSource("custom")}
                    className={`group p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                      topicSource === "custom"
                        ? "border-green-500 bg-green-50 shadow-lg scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 transition-all group-hover:scale-110 ${
                        topicSource === "custom" ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-base mb-1">
                          Bring Your Own Topic
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          Upload your own content or specify exactly what you want to practice with
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <Target className="w-3 h-3" />
                          <span>Perfect for specific goals</span>
                        </div>
                      </div>
                      {topicSource === "custom" && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </div>

                {/* AI Topic Input - Enhanced */}
                {topicSource === "ai-generated" && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
                      <label className="block text-base font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        What would you like to learn about?
                      </label>
                      <textarea
                        value={aiTopicPrompt}
                        onChange={(e) => setAiTopicPrompt(e.target.value)}
                        placeholder="e.g., 'Climate change effects on marine ecosystems' or 'The impact of artificial intelligence on modern healthcare'..."
                        className="w-full p-4 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm resize-none shadow-sm transition-all"
                        rows="4"
                      />
                      <div className="mt-3 flex items-center gap-2 text-xs text-purple-700">
                        <Info className="w-3 h-3" />
                        <span>Be specific for better AI-generated content</span>
                      </div>
                    </div>
                    <button
                      onClick={handleAutoGenerate}
                      disabled={!aiTopicPrompt.trim() || isGenerating}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg text-base hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generating Topic...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate AI Topic
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Custom Topic Input - Enhanced */}
                {topicSource === "custom" && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
                      <label className="block text-base font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Enter your topic or paste content:
                      </label>
                      <textarea
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="Paste your article, essay, or describe the specific topic you want to practice with..."
                        className="w-full p-4 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm resize-none shadow-sm transition-all"
                        rows="5"
                      />
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                        <Info className="w-3 h-3" />
                        <span>You can paste articles, essays, or just describe your topic</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

      
        </div>
      </div>

      {/* Start Button - Enhanced */}
      <div className="mt-8 max-w-6xl mx-auto">
        <Button
          onClick={handleStartLearning}
          disabled={!isReadyToStart() || isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-4 shadow-2xl text-lg hover:shadow-blue-500/25"
        >
          <Play className="w-6 h-6" />
          Start Learning Session
          <ArrowRight className="w-5 h-5" />
        </Button>
        {!isReadyToStart() && (
          <p className="text-center text-gray-500 text-sm mt-3">
            Please {topicSource === "ai-generated" ? "enter a topic prompt" : "provide your custom content"} to continue
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              Ready to Start Learning?
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              You're about to begin a <span className="font-semibold text-gray-700">{getSelectedLevelData()?.label}</span> level 
              comprehension session that will take approximately <span className="font-semibold text-gray-700">{getSelectedLevelData()?.duration}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Level:</span>
              <Badge className={getSelectedLevelData()?.color}>
                {getSelectedLevelData()?.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Duration:</span>
              <span className="text-gray-700">{getSelectedLevelData()?.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Topic Source:</span>
              <span className="text-gray-700 capitalize">{topicSource.replace('-', ' ')}</span>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={confirmStartLearning}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningArenaItem;
