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

const ComprehensionSkillsSession = () => {
  const [answers, setAnswers] = useState({});
  const [recordingStates, setRecordingStates] = useState({});
  const [audioBlobs, setAudioBlobs] = useState({});
  const [recordingTimes, setRecordingTimes] = useState({});
  const [audioLevels, setAudioLevels] = useState({});
  const [recordingQuality, setRecordingQuality] = useState({});
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [hover, setHover] = useState(0);
  const mediaRecordersRef = useRef({});
  const audioContextRef = useRef({});
  const analyserRef = useRef({});
  const timerIntervalsRef = useRef({});
  const monitoringStateRef = useRef({});

  // Sample data - replace with props or API data
  const comprehensionData = {
    title: "Reading Comprehension: Climate Change",
    passage: `Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver of climate change since the 1800s. The burning of fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures.

        The consequences of climate change include rising sea levels, extreme weather events, and shifts in wildlife populations. Scientists worldwide agree that immediate action is needed to reduce greenhouse gas emissions and adapt to changing conditions.`,
    questions: [
      {
        id: 1,
        type: "mcq",
        question:
          "What has been the main driver of climate change since the 1800s?",
        options: [
          "Natural climate variations",
          "Human activities",
          "Solar radiation changes",
          "Ocean currents",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: "multiple-choice",
        question:
          "Which of the following are consequences of climate change mentioned in the passage? (Select all that apply)",
        options: [
          "Rising sea levels",
          "Extreme weather events",
          "Shifts in wildlife populations",
          "Decreased ocean salinity",
          "Reduced agricultural productivity",
        ],
        correctAnswers: [0, 1, 2], // Multiple correct answers
      },
      {
        id: 3,
        type: "written",
        question: "Explain how greenhouse gases affect Earth's temperature.",
      },
      {
        id: 4,
        type: "audio",
        question:
          "Record yourself explaining three consequences of climate change mentioned in the passage.",
      },
    ],
  };

  const handleMCQAnswer = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const handleMultipleChoiceAnswer = (questionIndex, optionIndex) => {
    const currentAnswers = answers[questionIndex] || [];
    let updatedAnswers;

    if (currentAnswers.includes(optionIndex)) {
      // Remove the option if it's already selected
      updatedAnswers = currentAnswers.filter((index) => index !== optionIndex);
    } else {
      // Add the option if it's not selected
      updatedAnswers = [...currentAnswers, optionIndex];
    }

    setAnswers({
      ...answers,
      [questionIndex]: updatedAnswers,
    });
  };

  const handleWrittenAnswer = (questionIndex, text) => {
    setAnswers({
      ...answers,
      [questionIndex]: text,
    });
  };

  const startRecording = async (questionIndex) => {
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

      analyser.fftSize = 512; // Increased for better resolution
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
        if (
          !monitoringStateRef.current[questionIndex] ||
          !analyserRef.current[questionIndex]
        ) {
          return;
        }

        const analyser = analyserRef.current[questionIndex];
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray); // Use frequency data instead of time domain

        // Calculate RMS (Root Mean Square) for better audio level detection
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const level = Math.min(100, (rms / 255) * 100 * 3); // Normalize and amplify

        setAudioLevels((prev) => ({
          ...prev,
          [questionIndex]: level,
        }));

        // Determine recording quality based on audio level
        let quality = "Very Low";
        if (level > 3) quality = "Poor";
        if (level > 15) quality = "Good";
        if (level > 30) quality = "Excellent";
        if (level > 80) quality = "Too Loud";

        setRecordingQuality((prev) => ({
          ...prev,
          [questionIndex]: quality,
        }));

        // Continue monitoring using requestAnimationFrame for better performance
        if (monitoringStateRef.current[questionIndex]) {
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
          [questionIndex]: blob,
        });
        setAnswers({
          ...answers,
          [questionIndex]: blob,
        });

        // Cleanup
        monitoringStateRef.current[questionIndex] = false;
        clearInterval(timerIntervalsRef.current[questionIndex]);
        stream.getTracks().forEach((track) => track.stop());
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

  const stopRecording = (questionIndex) => {
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

      // Clear timer and audio level monitoring
      if (timerIntervalsRef.current[questionIndex]) {
        clearInterval(timerIntervalsRef.current[questionIndex]);
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Stop all monitoring
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

  const submitAnswers = () => {
    // Validate that all questions have been answered
    const unansweredQuestions = comprehensionData.questions.filter(
      (question, index) => {
        const answer = answers[index];
        if (question.type === "multiple-choice") {
          // For multiple choice, check if at least one option is selected
          return !answer || !Array.isArray(answer) || answer.length === 0;
        }
        // For other question types, check if answer exists
        return (
          !answers.hasOwnProperty(index) ||
          answer === "" ||
          answer === null ||
          answer === undefined
        );
      }
    );

    if (unansweredQuestions.length > 0) {
      alert(
        `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`
      );
      return;
    }

    // Check if rating is provided
    if (rating === 0) {
      alert('Please provide a rating for your reading session.');
      return;
    }

    // Prepare submission data
    const submissionData = {
      answers,
      rating,
      notes: notes.trim(),
      hasAudioResponses: Object.keys(audioBlobs).length > 0,
      audioResponses: Object.keys(audioBlobs).reduce((acc, key) => {
        acc[key] = {
          duration: recordingTimes[key] || 0,
          quality: recordingQuality[key] || 'Not Started'
        };
        return acc;
      }, {}),
      completedAt: new Date().toISOString()
    };

    console.log("Submitted comprehension session data:", submissionData);
    alert("Reading comprehension session completed successfully! Your answers and feedback have been saved.");
  };

  const renderQuestion = (question, questionIndex) => {
    switch (question.type) {
      case "mcq":
        return (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  MCQ
                </Badge>
                <span className="text-gray-600 text-sm">
                  Question {questionIndex + 1}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[questionIndex]?.toString()}
                onValueChange={(value) =>
                  handleMCQAnswer(questionIndex, parseInt(value))
                }
                className="space-y-3"
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`q${questionIndex}-${optionIndex}`}
                    />
                    <Label
                      htmlFor={`q${questionIndex}-${optionIndex}`}
                      className="text-gray-700 cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case "multiple-choice":
        const selectedAnswers = answers[questionIndex] || [];
        return (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                >
                  MULTIPLE CHOICE
                </Badge>
                <span className="text-gray-600 text-sm">
                  Question {questionIndex + 1}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {question.question}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Select all correct answers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`q${questionIndex}-${optionIndex}`}
                      checked={selectedAnswers.includes(optionIndex)}
                      onCheckedChange={() =>
                        handleMultipleChoiceAnswer(questionIndex, optionIndex)
                      }
                    />
                    <Label
                      htmlFor={`q${questionIndex}-${optionIndex}`}
                      className="text-gray-700 cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedAnswers.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <span>✓</span>
                    <span>
                      {selectedAnswers.length} option
                      {selectedAnswers.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "written":
        return (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  WRITTEN
                </Badge>
                <span className="text-gray-600 text-sm">
                  Question {questionIndex + 1}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={answers[questionIndex] || ""}
                onChange={(e) =>
                  handleWrittenAnswer(questionIndex, e.target.value)
                }
                placeholder="Type your answer here..."
                rows={6}
                className="resize-none"
              />
              <div className="text-sm text-gray-500">
                {answers[questionIndex]?.length || 0} characters
              </div>
            </CardContent>
          </Card>
        );

      case "audio":
        const isRecording = recordingStates[questionIndex];
        const audioBlob = audioBlobs[questionIndex];
        const recordingTime = recordingTimes[questionIndex] || 0;
        const audioLevel = audioLevels[questionIndex] || 0;
        const quality = recordingQuality[questionIndex] || "Not Started";

        return (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  AUDIO
                </Badge>
                <span className="text-gray-600 text-sm">
                  Question {questionIndex + 1}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recording Controls - Compact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <Button
                      onClick={() => startRecording(questionIndex)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <span>🎤</span>
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={() => stopRecording(questionIndex)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2 animate-pulse"
                    >
                      <span>⏹️</span>
                      Stop Recording
                    </Button>
                  )}
                </div>

                {/* Timer & Status */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                    <span>⏱️</span>
                    <span className="font-mono font-semibold">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  {recordingTime > 0 && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getQualityColor(quality)}`}
                    >
                      {quality}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Recording Status & Voice Level - Compact */}
              {isRecording && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording...</span>
                    </div>
                    <span className="text-xs text-gray-600">
                      Level: {Math.round(audioLevel)}%
                    </span>
                  </div>

                  {/* Compact Voice Level Bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 rounded-full ${
                        audioLevel < 3
                          ? "bg-red-400"
                          : audioLevel < 15
                          ? "bg-yellow-400"
                          : audioLevel > 80
                          ? "bg-orange-400"
                          : "bg-green-400"
                      }`}
                      style={{ width: `${Math.min(100, audioLevel)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Silent</span>
                    <span className="text-blue-600">Good Range: 15-80%</span>
                    <span>Too Loud</span>
                  </div>
                </div>
              )}

              {/* Audio Playback - Compact */}
              {audioBlob && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800 font-medium">
                      ✅ Recording Complete
                    </span>
                    <span className="text-xs text-green-700">
                      Duration: {formatTime(recordingTime)}
                    </span>
                  </div>

                  <audio
                    controls
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full h-8"
                    controlsList="nodownload"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>
                        Quality:{" "}
                        <span
                          className={`font-medium ${
                            getQualityColor(quality).split(" ")[0]
                          }`}
                        >
                          {quality}
                        </span>
                      </span>
                      <span>Format: WebM</span>
                    </div>
                    <Button
                      onClick={() => startRecording(questionIndex)}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                    >
                      🔄 Re-record
                    </Button>
                  </div>
                </div>
              )}

              {/* Instructions - Compact */}
              {!isRecording && !audioBlob && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">💡</span>
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Recording Tips:</p>
                      <p>
                        • Quiet environment • Clear speech • 30s-2min duration
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="comprehension-session min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
      <div className="  mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className=" ">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {comprehensionData.title}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Complete all questions below and submit your answers
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4">
                  <Progress
                    value={
                      (comprehensionData.questions.filter((question, index) => {
                        const answer = answers[index];
                        if (question.type === "multiple-choice") {
                          return (
                            answer && Array.isArray(answer) && answer.length > 0
                          );
                        }
                        return (
                          answer !== undefined &&
                          answer !== "" &&
                          answer !== null
                        );
                      }).length /
                        comprehensionData.questions.length) *
                      100
                    }
                    className="w-32"
                  />
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {
                      comprehensionData.questions.filter((question, index) => {
                        const answer = answers[index];
                        if (question.type === "multiple-choice") {
                          return (
                            answer && Array.isArray(answer) && answer.length > 0
                          );
                        }
                        return (
                          answer !== undefined &&
                          answer !== "" &&
                          answer !== null
                        );
                      }).length
                    }{" "}
                    / {comprehensionData.questions.length} Answered
                  </Badge>
                </div>
                {/* <Button 
                                    onClick={submitAnswers}
                                    className="whitespace-nowrap"
                                >
                                    Submit All Answers
                                </Button> */}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1   gap-8">
          {/* Reading Passage */}
          <div className=" ">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg  tracking-wide">
                    📖
                  </div>
                  Reading Passage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500 max-h-96 overflow-y-auto">
                  {comprehensionData.passage}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {" "}
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                  <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                    ❓
                  </div>
                  Questions
                </CardTitle>
                <Badge variant="outline" className="self-start sm:self-center">
                  Progress:{" "}
                  {
                    comprehensionData.questions.filter((question, index) => {
                      const answer = answers[index];
                      if (question.type === "multiple-choice") {
                        return (
                          answer && Array.isArray(answer) && answer.length > 0
                        );
                      }
                      return (
                        answer !== undefined && answer !== "" && answer !== null
                      );
                    }).length
                  }
                  /{comprehensionData.questions.length}
                </Badge>
              </CardHeader>
            </Card>

            {comprehensionData.questions.map((question, index) => (
              <div key={question.id}>{renderQuestion(question, index)}</div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-4 mt-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-wide">
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  📝
                </div>
                Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Rating Section */}
              {/* <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    RATING
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  How would you rate your reading session?
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
              </div> */}

              {/* <Separator className="my-6" /> */}

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
                  Additional notes about your reading experience
                </h3>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share your thoughts about the reading session, areas you'd like to improve, or any challenges you faced..."
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
                  Make sure to answer all questions before submitting. You can
                  review and modify your answers anytime.
                </p>
              </div>
              <Button
                onClick={submitAnswers}
                size="lg"
                className="flex items-center gap-2"
              >
                <span>✓</span>
                Submit Final Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensionSkillsSession;
