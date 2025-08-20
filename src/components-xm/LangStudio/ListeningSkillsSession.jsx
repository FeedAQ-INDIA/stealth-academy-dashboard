import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

const ListeningSkillsSession = () => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [audioPlayerState, setAudioPlayerState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    hasStarted: false,
    hasCompleted: false,
    playCount: 0,
  });
  const [comprehensionAnswers, setComprehensionAnswers] = useState({});
  const [recordingStates, setRecordingStates] = useState({});
  const [audioBlobs, setAudioBlobs] = useState({});
  const [recordingTimes, setRecordingTimes] = useState({});
  const [audioLevels, setAudioLevels] = useState({});
  const [recordingQuality, setRecordingQuality] = useState({});

  const audioRef = useRef(null);
  const mediaRecordersRef = useRef({});
  const audioContextRef = useRef({});
  const analyserRef = useRef({});
  const timerIntervalsRef = useRef({});
  const monitoringStateRef = useRef({});

  // Sample listening skills data - replace with props or API data
  const listeningData = {
    title: "Listening Skills Practice: Business Communication",
    description:
      "Listen to the audio passage carefully and answer the comprehension questions. You can also record your own summary.",
    audioContent: {
      title: "Remote Work Benefits",
      url: "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-2.mp3", // Replace with actual audio URL
      duration: "3:45",
      transcript: `Remote work has become increasingly popular in recent years, offering numerous benefits for both employees and employers. For employees, remote work provides greater flexibility in managing work-life balance, eliminates commute time, and often results in increased productivity due to fewer office distractions.

Employers benefit from reduced overhead costs, access to a wider talent pool regardless of geographical location, and often see improved employee satisfaction and retention rates. However, remote work also presents challenges such as maintaining team communication, ensuring data security, and managing employee engagement.

Successful remote work requires strong communication skills, self-discipline, and the ability to adapt to digital collaboration tools. Companies that embrace remote work need to invest in proper technology infrastructure and develop clear policies for remote work management.

The future of work is likely to be hybrid, combining the benefits of both remote and in-office work arrangements.`,
      estimatedListeningTime: "3-4 minutes",
    },
    comprehensionQuestions: [
      {
        id: 1,
        type: "multiple-choice",
        question:
          "According to the audio, what is one benefit of remote work for employees?",
        options: [
          "Higher salary",
          "Better work-life balance",
          "More vacation days",
          "Company car",
        ],
        correctAnswer: "Better work-life balance",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "What challenge of remote work is mentioned in the audio?",
        options: [
          "Higher costs",
          "Longer working hours",
          "Maintaining team communication",
          "Less productivity",
        ],
        correctAnswer: "Maintaining team communication",
      },
      {
        id: 3,
        type: "true-false",
        question: "Remote work eliminates all workplace distractions.",
        options: ["True", "False"],
        correctAnswer: "False",
      },
      {
        id: 4,
        type: "short-answer",
        question:
          "What skills are required for successful remote work according to the audio?",
        correctAnswer:
          "Strong communication skills, self-discipline, and ability to adapt to digital collaboration tools",
      },
    ],
  };

  // Audio Player Functions
  const handleAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        hasStarted: true,
        playCount: prev.hasStarted ? prev.playCount : prev.playCount + 1,
      }));
    }
  };

  const handleAudioPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
    }
  };

  const handleAudioRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioPlayerState((prev) => ({
        ...prev,
        currentTime: 0,
        playCount: prev.playCount + 1,
      }));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioPlayerState((prev) => ({
        ...prev,
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration || 0,
      }));
    }
  };

  const handleAudioEnded = () => {
    setAudioPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
      hasCompleted: true,
    }));
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Recording Functions (similar to ReadingSkillsSession)
  const startRecording = async (questionId) => {
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
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      microphone.connect(analyser);

      audioContextRef.current[questionId] = audioContext;
      analyserRef.current[questionId] = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const chunks = [];

      // Start timer
      const startTime = Date.now();
      setRecordingTimes({
        ...recordingTimes,
        [questionId]: 0,
      });

      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTimes((prev) => ({
          ...prev,
          [questionId]: elapsed,
        }));
      }, 1000);

      timerIntervalsRef.current[questionId] = timerInterval;

      // Monitor audio levels
      const monitorAudioLevel = () => {
        if (
          !monitoringStateRef.current[questionId] ||
          !analyserRef.current[questionId]
        ) {
          return;
        }

        const analyser = analyserRef.current[questionId];
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const level = Math.min(100, (rms / 255) * 100 * 3);

        setAudioLevels((prev) => ({
          ...prev,
          [questionId]: level,
        }));

        let quality = "Very Low";
        if (level > 3) quality = "Poor";
        if (level > 15) quality = "Good";
        if (level > 30) quality = "Excellent";
        if (level > 80) quality = "Too Loud";

        setRecordingQuality((prev) => ({
          ...prev,
          [questionId]: quality,
        }));

        if (monitoringStateRef.current[questionId]) {
          requestAnimationFrame(monitorAudioLevel);
        }
      };

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlobs({
          ...audioBlobs,
          [questionId]: blob,
        });

        monitoringStateRef.current[questionId] = false;
        clearInterval(timerIntervalsRef.current[questionId]);
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current[questionId]) {
          audioContextRef.current[questionId].close();
        }
      };

      mediaRecordersRef.current[questionId] = mediaRecorder;
      mediaRecorder.start();

      setRecordingStates({
        ...recordingStates,
        [questionId]: true,
      });

      monitoringStateRef.current[questionId] = true;
      setTimeout(() => monitorAudioLevel(), 100);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = (questionId) => {
    const mediaRecorder = mediaRecordersRef.current[questionId];
    if (mediaRecorder && recordingStates[questionId]) {
      monitoringStateRef.current[questionId] = false;

      setRecordingStates({
        ...recordingStates,
        [questionId]: false,
      });

      mediaRecorder.stop();

      if (timerIntervalsRef.current[questionId]) {
        clearInterval(timerIntervalsRef.current[questionId]);
      }

      setAudioLevels((prev) => ({
        ...prev,
        [questionId]: 0,
      }));
    }
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

  const handleAnswerChange = (questionId, answer) => {
    setComprehensionAnswers({
      ...comprehensionAnswers,
      [questionId]: answer,
    });
  };

  const renderQuestion = (question) => {
    const answer = comprehensionAnswers[question.id];

    return (
      <div key={question.id} className="bg-white rounded-lg border p-6 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 mt-1">
            Q{question.id}
          </Badge>
          <h3 className="text-lg font-medium text-gray-800 flex-1">
            {question.question}
          </h3>
        </div>

        {question.type === "multiple-choice" && (
          <RadioGroup
            value={answer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`q${question.id}-${index}`}
                />
                <Label
                  htmlFor={`q${question.id}-${index}`}
                  className="text-gray-700"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "true-false" && (
          <RadioGroup
            value={answer}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="flex gap-6"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`q${question.id}-${index}`}
                />
                <Label
                  htmlFor={`q${question.id}-${index}`}
                  className="text-gray-700"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "short-answer" && (
          <div className="space-y-4">
            <Textarea
              value={answer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="resize-none"
            />

            {/* Optional audio response */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  AUDIO RESPONSE (OPTIONAL)
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Record yourself answering this question aloud for speaking
                practice.
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {!recordingStates[question.id] ? (
                    <Button
                      onClick={() => startRecording(question.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <span>🎤</span>
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={() => stopRecording(question.id)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2 animate-pulse"
                    >
                      <span>⏹️</span>
                      Stop Recording
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                    <span>⏱️</span>
                    <span className="font-mono font-semibold">
                      {formatTime(recordingTimes[question.id] || 0)}
                    </span>
                  </div>
                  {(recordingTimes[question.id] || 0) > 0 && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getQualityColor(
                        recordingQuality[question.id] || "Not Started"
                      )}`}
                    >
                      {recordingQuality[question.id] || "Not Started"}
                    </Badge>
                  )}
                </div>
              </div>

              {recordingStates[question.id] && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording...</span>
                    </div>
                    <span className="text-xs text-gray-600">
                      Level: {Math.round(audioLevels[question.id] || 0)}%
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 rounded-full ${
                        (audioLevels[question.id] || 0) < 3
                          ? "bg-red-400"
                          : (audioLevels[question.id] || 0) < 15
                          ? "bg-yellow-400"
                          : (audioLevels[question.id] || 0) > 80
                          ? "bg-orange-400"
                          : "bg-green-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          audioLevels[question.id] || 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {audioBlobs[question.id] && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800 font-medium">
                      ✅ Recording Complete
                    </span>
                    <span className="text-xs text-green-700">
                      Duration: {formatTime(recordingTimes[question.id] || 0)}
                    </span>
                  </div>

                  <audio
                    controls
                    src={URL.createObjectURL(audioBlobs[question.id])}
                    className="w-full h-8"
                    controlsList="nodownload"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const submitAnswers = () => {
    // Check if audio has been listened to
    if (!audioPlayerState.hasStarted) {
      alert("Please listen to the audio passage before submitting.");
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = listeningData.comprehensionQuestions.filter(
      (q) =>
        !comprehensionAnswers[q.id] || comprehensionAnswers[q.id].trim() === ""
    );

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer all questions. Missing: Question ${unansweredQuestions
          .map((q) => q.id)
          .join(", ")}`
      );
      return;
    }

    // Check if rating is provided
    if (rating === 0) {
      alert("Please provide a rating for your listening session.");
      return;
    }

    // Prepare submission data
    const submissionData = {
      rating,
      notes: notes.trim(),
      comprehensionAnswers,
      audioStats: audioPlayerState,
      hasAudioResponses: Object.keys(audioBlobs).length > 0,
      audioResponses: Object.keys(audioBlobs).reduce((acc, key) => {
        acc[key] = {
          duration: recordingTimes[key] || 0,
          quality: recordingQuality[key] || "Not Started",
        };
        return acc;
      }, {}),
      completedAt: new Date().toISOString(),
    };

    console.log("Submitted listening session data:", submissionData);
    alert(
      "Listening session completed successfully! Your answers and feedback have been saved."
    );
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      Object.keys(monitoringStateRef.current).forEach((key) => {
        monitoringStateRef.current[key] = false;
      });

      Object.values(timerIntervalsRef.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
      Object.values(audioContextRef.current).forEach((context) => {
        if (context && context.state !== "closed") context.close();
      });
    };
  }, []);

  const completedQuestions = Object.keys(comprehensionAnswers).filter(
    (key) =>
      comprehensionAnswers[key] && comprehensionAnswers[key].trim() !== ""
  ).length;
  const totalQuestions = listeningData.comprehensionQuestions.length;
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  const [hover, setHover] = useState(0);

  return (
    <div className="listening-session min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
      <div className="mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {listeningData.title}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  {listeningData.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4">
                  <Progress value={progressPercentage} className="w-32" />
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {completedQuestions} / {totalQuestions} Answered
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Audio Content */}
          <div className="">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg tracking-wide">
                    🎵
                  </div>
                  Audio Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-6">
                  Listen carefully to the audio passage and then answer the
                  comprehension questions below.
                </p>

                <div className="">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <Badge variant="outline" className="bg-indigo-50">
                        {listeningData.audioContent.title}
                      </Badge>
                      {audioPlayerState.hasCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-sm">
                        Duration: {listeningData.audioContent.duration}
                      </Badge>
                    </div>
                  </div>

                  {/* Custom Audio Player */}
                  <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6">
                    <audio
                      ref={audioRef}
                      src={listeningData.audioContent.url}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleAudioEnded}
                      onLoadedMetadata={() => {
                        if (audioRef.current) {
                          setAudioPlayerState((prev) => ({
                            ...prev,
                            duration: audioRef.current.duration,
                          }));
                        }
                      }}
                      className="hidden"
                    />

                    {/* Audio Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={
                            audioPlayerState.isPlaying
                              ? handleAudioPause
                              : handleAudioPlay
                          }
                          variant="default"
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {audioPlayerState.isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                          {audioPlayerState.isPlaying ? "Pause" : "Play"}
                        </Button>

                        <Button
                          onClick={handleAudioRestart}
                          variant="outline"
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restart
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Volume2 className="w-4 h-4" />
                          <span>
                            {formatTime(audioPlayerState.currentTime)} /{" "}
                            {formatTime(audioPlayerState.duration)}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-indigo-100 text-indigo-800"
                        >
                          Plays: {audioPlayerState.playCount}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                        style={{
                          width: `${
                            audioPlayerState.duration > 0
                              ? (audioPlayerState.currentTime /
                                  audioPlayerState.duration) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    {/* Listening Tips */}
                    {!audioPlayerState.hasStarted && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500">💡</span>
                          <div className="text-xs text-blue-800">
                            <p className="font-medium mb-1">Listening Tips:</p>
                            <p>
                              • Find a quiet environment • Focus on key details
                              • Take mental notes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                  <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                    ❓
                  </div>
                  Comprehension Questions
                </CardTitle>
                <Badge variant="outline" className="self-start sm:self-center">
                  Progress: {completedQuestions}/{totalQuestions}
                </Badge>
              </CardHeader>
            </Card>

            {!audioPlayerState.hasStarted && (
              <Alert className="mb-6">
                <AlertDescription>
                  Please listen to the audio passage first before answering the
                  questions.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {listeningData.comprehensionQuestions.map(renderQuestion)}
            </div>
          </div>
        </div>

        {/* Session Feedback */}
        <div className="space-y-4 mt-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                <div className="bg-orange-100 text-orange-800 p-2 rounded-lg">
                  📝
                </div>
                Session Feedback
              </CardTitle>
            </CardHeader>{" "}
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
                  How would you rate your listening comprehension?
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
                        &#9733; {/* This is the Unicode star character */}
                      </button>
                    );
                  })}
                  <span className="ml-3 text-gray-600">
                    {rating > 0 ? `${rating}/5 stars` : "Click to rate"}
                  </span>
                </div>
                {rating > 0 && (
                  <div className="text-sm text-gray-600">
                    {rating === 1 && "Need to improve listening skills"}
                    {rating === 2 && "Basic understanding achieved"}
                    {rating === 3 && "Good comprehension"}
                    {rating === 4 && "Very good listening skills"}
                    {rating === 5 && "Excellent comprehension ability"}
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
                  Additional notes about your listening experience
                </h3>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share your thoughts about the listening session, what you learned, any challenging parts, or areas you'd like to improve..."
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
                  Complete the audio listening and answer all comprehension
                  questions to finish your listening skills practice. Ratings
                  and notes help track your progress.
                </p>
              </div>
              <Button
                onClick={submitAnswers}
                size="lg"
                className="flex items-center gap-2"
              >
                <span>✓</span>
                Submit Listening Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListeningSkillsSession;
