import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Separator } from "@/components/ui/separator.jsx";

const SpeakingSkillsSession = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [recordingStates, setRecordingStates] = useState({});
  const [audioBlobs, setAudioBlobs] = useState({});
  const [recordingTimes, setRecordingTimes] = useState({});
  const [audioLevels, setAudioLevels] = useState({});
  const [recordingQuality, setRecordingQuality] = useState({});
  const mediaRecordersRef = useRef({});
  const audioContextRef = useRef({});
  const analyserRef = useRef({});
  const timerIntervalsRef = useRef({});
  const monitoringStateRef = useRef({});

  // Sample speaking skills data - replace with props or API data
  const speakingData = {
    title: "Speaking Skills Practice: Professional Communication",
    description:
      "Practice your speaking skills with these prompts. Record your responses and receive feedback on your communication abilities.",
    questions: [
      {
        id: 1,
        topic: "Self Introduction",
        question: "Please introduce yourself professionally. Include your name, background, current role or studies, and your career goals.",
        tips: ["Speak clearly and confidently", "Maintain a professional tone", "Keep it between 1-2 minutes"],
        estimatedTime: "1-2 minutes",
        category: "Professional"
      },
      {
        id: 2,
        topic: "Problem Solving",
        question: "Describe a challenging situation you faced and how you solved it. Explain your thought process and the outcome.",
        tips: ["Use the STAR method (Situation, Task, Action, Result)", "Be specific with examples", "Focus on your role in the solution"],
        estimatedTime: "2-3 minutes",
        category: "Behavioral"
      },
      {
        id: 3,
        topic: "Future Plans",
        question: "What are your career aspirations for the next 5 years? How do you plan to achieve these goals?",
        tips: ["Be realistic and specific", "Connect your goals to your current path", "Show ambition and planning"],
        estimatedTime: "1-2 minutes",
        category: "Professional"
      },
      {
        id: 4,
        topic: "Technology Impact",
        question: "How has technology changed the way we work and communicate? Discuss both positive and negative impacts.",
        tips: ["Provide balanced perspective", "Use specific examples", "Speak from personal experience"],
        estimatedTime: "2-3 minutes",
        category: "Analytical"
      },
      {
        id: 5,
        topic: "Leadership Experience",
        question: "Tell me about a time when you had to lead a team or take initiative in a group setting.",
        tips: ["Highlight leadership qualities", "Describe challenges and solutions", "Mention team dynamics"],
        estimatedTime: "2-3 minutes",
        category: "Leadership"
      }
    ]
  };

  const currentQuestion = speakingData.questions[currentQuestionIndex];

  const startRecording = async (questionIndex = currentQuestionIndex) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      // Set up audio context for level monitoring
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      microphone.connect(analyser);

      audioContextRef.current[questionIndex] = audioContext;
      analyserRef.current[questionIndex] = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const chunks = [];

      // Start timer
      const startTime = Date.now();
      setRecordingTimes({
        ...recordingTimes,
        [questionIndex]: 0,
      });

      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTimes((prev) => ({
          ...prev,
          [questionIndex]: elapsed,
        }));
      }, 1000);

      timerIntervalsRef.current[questionIndex] = timerInterval;

      // Monitor audio levels
      const monitorAudioLevel = () => {
        if (!monitoringStateRef.current[questionIndex] || !analyserRef.current[questionIndex]) {
          return;
        }

        const analyser = analyserRef.current[questionIndex];
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Calculate RMS (Root Mean Square) for audio level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const normalizedLevel = Math.min(100, (rms / 128) * 100);

        setAudioLevels((prev) => ({
          ...prev,
          [questionIndex]: normalizedLevel,
        }));

        // Determine recording quality based on audio level
        let quality;
        if (normalizedLevel < 3) {
          quality = "Very Low";
        } else if (normalizedLevel < 15) {
          quality = "Poor";
        } else if (normalizedLevel > 80) {
          quality = "Too Loud";
        } else if (normalizedLevel > 50) {
          quality = "Excellent";
        } else {
          quality = "Good";
        }

        setRecordingQuality((prev) => ({
          ...prev,
          [questionIndex]: quality,
        }));

        // Continue monitoring
        if (monitoringStateRef.current[questionIndex]) {
          requestAnimationFrame(monitorAudioLevel);
        }
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlobs((prev) => ({
          ...prev,
          [questionIndex]: audioBlob,
        }));

        // Stop all streams
        stream.getTracks().forEach((track) => track.stop());

        // Close audio context
        if (audioContextRef.current[questionIndex]) {
          audioContextRef.current[questionIndex].close();
        }
      };

      mediaRecordersRef.current[questionIndex] = mediaRecorder;
      mediaRecorder.start();

      setRecordingStates({
        ...recordingStates,
        [questionIndex]: true,
      });

      // Start monitoring state
      monitoringStateRef.current[questionIndex] = true;

      // Start audio level monitoring after state is set
      setTimeout(() => monitorAudioLevel(), 100);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = (questionIndex = currentQuestionIndex) => {
    const mediaRecorder = mediaRecordersRef.current[questionIndex];
    if (mediaRecorder && recordingStates[questionIndex]) {
      // Stop monitoring first
      monitoringStateRef.current[questionIndex] = false;

      // Stop recording state to update UI
      setRecordingStates({
        ...recordingStates,
        [questionIndex]: false,
      });

      mediaRecorder.stop();

      // Clear timer
      if (timerIntervalsRef.current[questionIndex]) {
        clearInterval(timerIntervalsRef.current[questionIndex]);
        delete timerIntervalsRef.current[questionIndex];
      }

      // Reset audio level to 0
      setAudioLevels((prev) => ({
        ...prev,
        [questionIndex]: 0,
      }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Excellent":
        return "text-green-600 bg-green-100";
      case "Good":
        return "text-blue-600 bg-blue-100";
      case "Poor":
        return "text-yellow-600 bg-yellow-100";
      case "Very Low":
        return "text-red-600 bg-red-100";
      case "Too Loud":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Professional":
        return "bg-blue-100 text-blue-800";
      case "Behavioral":
        return "bg-green-100 text-green-800";
      case "Analytical":
        return "bg-purple-100 text-purple-800";
      case "Leadership":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Stop all monitoring
      Object.keys(monitoringStateRef.current).forEach((key) => {
        monitoringStateRef.current[key] = false;
      });

      Object.values(timerIntervalsRef.current).forEach((interval) => {
        clearInterval(interval);
      });
      Object.values(audioContextRef.current).forEach((context) => {
        if (context.state !== "closed") {
          context.close();
        }
      });
    };
  }, []);

  const nextQuestion = () => {
    if (currentQuestionIndex < speakingData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAnswers = () => {
    // Check if at least one recording exists
    if (Object.keys(audioBlobs).length === 0) {
      alert('Please record at least one response before submitting.');
      return;
    }

    // Check if rating is provided
    if (rating === 0) {
      alert('Please provide a rating for your speaking session.');
      return;
    }

    // Prepare submission data
    const submissionData = {
      completedQuestions: Object.keys(audioBlobs).length,
      totalQuestions: speakingData.questions.length,
      rating,
      notes: notes.trim(),
      audioResponses: Object.keys(audioBlobs).reduce((acc, key) => {
        acc[key] = {
          questionId: speakingData.questions[key].id,
          topic: speakingData.questions[key].topic,
          duration: recordingTimes[key] || 0,
          quality: recordingQuality[key] || 'Not Started'
        };
        return acc;
      }, {}),
      completedAt: new Date().toISOString()
    };

    console.log("Submitted speaking session data:", submissionData);
    alert("Speaking skills session completed successfully! Your recordings and feedback have been saved.");
  };

  const [hover, setHover] = useState(0);

  const completedQuestions = Object.keys(audioBlobs).length;
  const progressPercentage = (completedQuestions / speakingData.questions.length) * 100;

  return (
    <div className=" p-3">
      <div className="mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {speakingData.title}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  {speakingData.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4">
                  <Progress value={progressPercentage} className="w-32" />
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    {completedQuestions} / {speakingData.questions.length} Completed
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Navigation */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <div className="bg-red-100 text-red-800 p-2 rounded-lg">🎯</div>
              Question {currentQuestionIndex + 1} of {speakingData.questions.length}
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="sm"
              >
                ← Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === speakingData.questions.length - 1}
                variant="outline"
                size="sm"
              >
                Next →
              </Button>
            </div>
          </div>
          
          {/* Question Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {speakingData.questions.map((_, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  index === currentQuestionIndex
                    ? "border-red-500 bg-red-50"
                    : audioBlobs[index]
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    index === currentQuestionIndex
                      ? "text-red-600"
                      : audioBlobs[index]
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}>
                    Q{index + 1}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {audioBlobs[index] ? "✓ Recorded" : "Not Recorded"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <div className="grid grid-cols-1 gap-8">
          {/* Question Card */}
          <div className="">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg tracking-wide">
                    💭
                  </div>
                  {currentQuestion.topic}
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${getCategoryColor(currentQuestion.category)}`}
                  >
                    {currentQuestion.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      Estimated Time: {currentQuestion.estimatedTime}
                    </Badge>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
                  <p className="text-lg font-medium mb-2">{currentQuestion.question}</p>
                </div>
                
                {/* Speaking Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    💡 Speaking Tips:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {currentQuestion.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recording Section */}
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                  <div className="bg-red-100 text-red-800 p-2 rounded-lg">
                    🎤
                  </div>
                  Voice Recording
                </CardTitle>
                <Badge variant="outline" className="self-start sm:self-center">
                  Status: {audioBlobs[currentQuestionIndex] ? "Complete" : "Pending"}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Recording Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!recordingStates[currentQuestionIndex] ? (
                        <Button
                          onClick={() => startRecording()}
                          variant="destructive"
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          <span>🎤</span>
                          Start Recording
                        </Button>
                      ) : (
                        <Button
                          onClick={() => stopRecording()}
                          variant="secondary"
                          size="lg"
                          className="flex items-center gap-2 animate-pulse"
                        >
                          <span>⏹️</span>
                          Stop Recording
                        </Button>
                      )}
                    </div>

                    {/* Recording Info */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                        <span>⏱️</span>
                        <span className="font-mono font-semibold">
                          {formatTime(recordingTimes[currentQuestionIndex] || 0)}
                        </span>
                      </div>
                      {(recordingTimes[currentQuestionIndex] || 0) > 0 && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getQualityColor(
                            recordingQuality[currentQuestionIndex] || "Not Started"
                          )}`}
                        >
                          {recordingQuality[currentQuestionIndex] || "Not Started"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Recording Status */}
                  {recordingStates[currentQuestionIndex] && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">
                            Recording...
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          Level: {Math.round(audioLevels[currentQuestionIndex] || 0)}%
                        </span>
                      </div>

                      {/* Audio Level Indicator */}
                      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-150 rounded-full ${
                            (audioLevels[currentQuestionIndex] || 0) < 3
                              ? "bg-red-400"
                              : (audioLevels[currentQuestionIndex] || 0) < 15
                              ? "bg-yellow-400"
                              : (audioLevels[currentQuestionIndex] || 0) > 80
                              ? "bg-orange-400"
                              : "bg-green-400"
                          }`}
                          style={{
                            width: `${Math.min(100, audioLevels[currentQuestionIndex] || 0)}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Silent</span>
                        <span className="text-blue-600">
                          Good Range: 15-80%
                        </span>
                        <span>Too Loud</span>
                      </div>
                    </div>
                  )}

                  {/* Completed Recording */}
                  {audioBlobs[currentQuestionIndex] && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800 font-medium">
                          ✅ Recording Complete
                        </span>
                        <span className="text-xs text-green-700">
                          Duration: {formatTime(recordingTimes[currentQuestionIndex] || 0)}
                        </span>
                      </div>

                      <audio
                        controls
                        src={URL.createObjectURL(audioBlobs[currentQuestionIndex])}
                        className="w-full h-8"
                        controlsList="nodownload"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>
                            Quality:{" "}
                            <span
                              className={`font-medium ${
                                getQualityColor(
                                  recordingQuality[currentQuestionIndex] || "Not Started"
                                ).split(" ")[0]
                              }`}
                            >
                              {recordingQuality[currentQuestionIndex] || "Not Started"}
                            </span>
                          </span>
                          <span>Format: WebM</span>
                        </div>
                        <Button
                          onClick={() => startRecording()}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2"
                        >
                          🔄 Re-record
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Recording Tips */}
                  {!recordingStates[currentQuestionIndex] && !audioBlobs[currentQuestionIndex] && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div className="text-xs text-blue-800">
                          <p className="font-medium mb-1">Recording Tips:</p>
                          <p>
                            • Find a quiet environment • Speak clearly and at a natural pace • Take time to think before speaking
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Feedback */}
        <div className="space-y-4 mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  📝
                </div>
                Session Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Rating Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    RATING
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  How would you rate your speaking session?
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <button
                        type="button"
                        key={starValue}
                        className={`text-3xl transition-colors duration-200 ease-in-out focus:outline-none ${
                          starValue <= (hover || rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <span className="sr-only">{starValue} Star</span>
                        &#9733;
                      </button>
                    );
                  })}
                  <span className="ml-3 text-gray-600">
                    {rating > 0 ? `${rating}/5 stars` : "Click to rate"}
                  </span>
                </div>
                {rating > 0 && (
                  <div className="text-sm text-gray-600">
                    {rating === 1 && "Needs significant improvement"}
                    {rating === 2 && "Below average performance"}
                    {rating === 3 && "Average performance"}
                    {rating === 4 && "Good performance"}
                    {rating === 5 && "Excellent performance"}
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Notes Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    NOTES
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional notes about your speaking experience
                </h3>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share your thoughts about the speaking session, areas you'd like to improve, challenges you faced, or topics you found interesting..."
                  rows={6}
                  className="resize-none mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{notes.length} characters</span>
                  <span>Optional - Share your experience</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 text-center sm:text-left">
                <p className="text-sm">
                  Complete at least one recording and provide a rating to finish your
                  speaking skills practice. You can navigate between questions and record multiple responses.
                </p>
              </div>
              <Button
                onClick={submitAnswers}
                size="lg"
                className="flex items-center gap-2"
              >
                <span>✓</span>
                Submit Speaking Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeakingSkillsSession;
