import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ReadingSkillsSession = () => {
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');
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

    // Sample reading skills data - replace with props or API data
    const readingData = {
        title: "Reading Skills Practice: Technology and Society",
        description: "Read the passage aloud while recording your voice. This will help improve your pronunciation, fluency, and reading confidence.",
        passage: {
            title: "The Digital Revolution",
            content: `The digital revolution has transformed every aspect of modern life. From how we communicate to how we work, technology has become an integral part of our daily existence. Smartphones, computers, and the internet have created unprecedented opportunities for connection and collaboration across the globe.

This technological shift has brought both benefits and challenges. While we can now access information instantly and connect with people worldwide, concerns about digital privacy, screen time, and social media's impact on mental health have emerged. Understanding how to navigate this digital landscape effectively has become a crucial life skill.

The pace of technological change continues to accelerate, with artificial intelligence, virtual reality, and automation reshaping industries and creating new possibilities for human advancement. As we move forward, it's essential to embrace these technologies while maintaining our human values and connections.

Education has been one of the most significantly transformed sectors. Online learning platforms have made education accessible to millions who previously lacked opportunities. Students can now attend virtual classrooms, access digital libraries, and collaborate on projects regardless of their geographical location.`,
            wordCount: 158,
            estimatedTime: "2-3 minutes"
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                } 
            });
            
            // Set up audio context for level monitoring
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            
            analyser.fftSize = 512; // Increased for better resolution
            analyser.smoothingTimeConstant = 0.8;
            analyser.minDecibels = -90;
            analyser.maxDecibels = -10;
            microphone.connect(analyser);
            
            audioContextRef.current[0] = audioContext;
            analyserRef.current[0] = analyser;
            
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            const chunks = [];

            // Start timer
            const startTime = Date.now();
            setRecordingTimes({
                ...recordingTimes,
                [0]: 0
            });
            
            const timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setRecordingTimes(prev => ({
                    ...prev,
                    [0]: elapsed
                }));
            }, 1000);
            
            timerIntervalsRef.current[0] = timerInterval;
            
            // Monitor audio levels
            const monitorAudioLevel = () => {
                if (!monitoringStateRef.current[0] || !analyserRef.current[0]) {
                    return;
                }
                
                const analyser = analyserRef.current[0];
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray); // Use frequency data instead of time domain
                
                // Calculate RMS (Root Mean Square) for better audio level detection
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i] * dataArray[i];
                }
                const rms = Math.sqrt(sum / dataArray.length);
                const level = Math.min(100, (rms / 255) * 100 * 3); // Normalize and amplify
                
                setAudioLevels(prev => ({
                    ...prev,
                    [0]: level
                }));
                
                // Determine recording quality based on audio level
                let quality = 'Very Low';
                if (level > 3) quality = 'Poor';
                if (level > 15) quality = 'Good';
                if (level > 30) quality = 'Excellent';
                if (level > 80) quality = 'Too Loud';
                
                setRecordingQuality(prev => ({
                    ...prev,
                    [0]: quality
                }));
                
                // Continue monitoring using requestAnimationFrame for better performance
                if (monitoringStateRef.current[0]) {
                    requestAnimationFrame(monitorAudioLevel);
                }
            };

            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlobs({
                    ...audioBlobs,
                    [0]: blob
                });
                
                // Cleanup
                monitoringStateRef.current[0] = false;
                clearInterval(timerIntervalsRef.current[0]);
                stream.getTracks().forEach(track => track.stop());
                if (audioContextRef.current[0]) {
                    audioContextRef.current[0].close();
                }
            };

            mediaRecordersRef.current[0] = mediaRecorder;
            mediaRecorder.start();
            
            setRecordingStates({
                ...recordingStates,
                [0]: true
            });
            
            // Start monitoring state
            monitoringStateRef.current[0] = true;
            
            // Start audio level monitoring after state is set
            setTimeout(() => monitorAudioLevel(), 100);
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check your permissions.');
        }
    };

    const stopRecording = () => {
        const mediaRecorder = mediaRecordersRef.current[0];
        if (mediaRecorder && recordingStates[0]) {
            // Stop monitoring first
            monitoringStateRef.current[0] = false;
            
            // Stop recording state to update UI
            setRecordingStates({
                ...recordingStates,
                [0]: false
            });
            
            mediaRecorder.stop();
            
            // Clear timer and audio level monitoring
            if (timerIntervalsRef.current[0]) {
                clearInterval(timerIntervalsRef.current[0]);
            }
            
            // Reset audio level to 0
            setAudioLevels(prev => ({
                ...prev,
                [0]: 0
            }));
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getQualityColor = (quality) => {
        switch (quality) {
            case 'Excellent': return 'text-green-600 bg-green-100';
            case 'Good': return 'text-blue-600 bg-blue-100';
            case 'Poor': return 'text-yellow-600 bg-yellow-100';
            case 'Very Low': return 'text-red-600 bg-red-100';
            case 'Too Loud': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            // Stop all monitoring
            Object.keys(monitoringStateRef.current).forEach(key => {
                monitoringStateRef.current[key] = false;
            });
            
            Object.values(timerIntervalsRef.current).forEach(interval => {
                if (interval) clearInterval(interval);
            });
            Object.values(audioContextRef.current).forEach(context => {
                if (context && context.state !== 'closed') context.close();
            });
        };
    }, []);

    const submitAnswers = () => {
        // Check if recording is completed
        if (!audioBlobs[0]) {
            alert('Please record your reading before submitting.');
            return;
        }

        // Check if rating is provided
        if (rating === 0) {
            alert('Please provide a rating for your reading session.');
            return;
        }

        // Prepare submission data
        const submissionData = {
            rating,
            notes: notes.trim(),
            hasRecording: !!audioBlobs[0],
            recordingDuration: recordingTimes[0] || 0,
            recordingQuality: recordingQuality[0] || 'Not Started',
            completedAt: new Date().toISOString()
        };

        console.log('Submitted reading session data:', submissionData);
        alert('Reading session completed successfully! Your recording and feedback have been saved.');
    };

    return (
        <div className="reading-skills-session min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-3">
            <div className="mx-auto">
                {/* Header */}
                <Card className="mb-4">
                    <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    {readingData.title}
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base">
                                    {readingData.description}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-4">
                                    <Progress 
                                        value={audioBlobs[0] ? 100 : 0} 
                                        className="w-32"
                                    />
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        {audioBlobs[0] ? 'Recorded' : 'Not Recorded'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Recording Overview */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-100 text-red-800 p-2 rounded-lg">🎤</div>
                        <h2 className="text-xl font-semibold">Recording Progress</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                            <span className="text-sm text-gray-600 mb-1">Recording Status</span>
                            <span className="text-2xl font-bold text-green-600">
                                {audioBlobs[0] ? '✓ Complete' : 'Pending'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-600 mb-1">Total Words</span>
                            <span className="text-2xl font-bold text-blue-600">{readingData.passage.wordCount}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                            <span className="text-sm text-gray-600 mb-1">Current Recording</span>
                            <span className="text-2xl font-bold text-purple-600">
                                {recordingStates[0] ? formatTime(recordingTimes[0] || 0) : '--:--'}
                            </span>
                        </div>
                    </div>
                    
                    {recordingStates[0] && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-800 font-medium">Recording...</span>
                                    <span className="text-red-600">{formatTime(recordingTimes[0] || 0)}</span>
                                </div>
                                <Button onClick={stopRecording} variant="destructive" size="sm">
                                    Stop Recording
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reading Passage with Recording */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg">📚</div>
                        <h2 className="text-xl font-semibold">Reading Passage</h2>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                        Read the passage aloud while recording your voice.
                    </p>

                    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                <Badge variant="outline" className="bg-indigo-50">
                                    {readingData.passage.title}
                                </Badge>
                                {audioBlobs[0] && (
                                    <Badge className="bg-green-100 text-green-800">
                                        ✓ Recorded
                                    </Badge>
                                )}
                            </h3>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-sm">
                                    {readingData.passage.wordCount} words • {readingData.passage.estimatedTime}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-lg border-l-4 border-indigo-500 mb-4 max-h-96 overflow-y-auto">
                            {readingData.passage.content}
                        </div>
                    </div>

                    {/* Audio Recording Section */}
                    <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                AUDIO RECORDING
                            </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Record yourself reading the passage aloud
                        </h3>
                        
                        {/* Recording Controls - Compact */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {!recordingStates[0] ? (
                                    <Button 
                                        onClick={() => startRecording()} 
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <span>🎤</span>
                                        Start Recording
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => stopRecording()} 
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
                                    <span className="font-mono font-semibold">{formatTime(recordingTimes[0] || 0)}</span>
                                </div>
                                {(recordingTimes[0] || 0) > 0 && (
                                    <Badge variant="outline" className={`text-xs ${getQualityColor(recordingQuality[0] || 'Not Started')}`}>
                                        {recordingQuality[0] || 'Not Started'}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        
                        {/* Recording Status & Voice Level - Compact */}
                        {recordingStates[0] && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">Recording...</span>
                                    </div>
                                    <span className="text-xs text-gray-600">Level: {Math.round(audioLevels[0] || 0)}%</span>
                                </div>
                                
                                {/* Compact Voice Level Bar */}
                                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-150 rounded-full ${
                                            (audioLevels[0] || 0) < 3 ? 'bg-red-400' :
                                            (audioLevels[0] || 0) < 15 ? 'bg-yellow-400' :
                                            (audioLevels[0] || 0) > 80 ? 'bg-orange-400' :
                                            'bg-green-400'
                                        }`}
                                        style={{ width: `${Math.min(100, audioLevels[0] || 0)}%` }}
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
                        {audioBlobs[0] && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-green-800 font-medium">✅ Recording Complete</span>
                                    <span className="text-xs text-green-700">Duration: {formatTime(recordingTimes[0] || 0)}</span>
                                </div>
                                
                                <audio 
                                    controls 
                                    src={URL.createObjectURL(audioBlobs[0])} 
                                    className="w-full h-8"
                                    controlsList="nodownload"
                                />
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span>Quality: <span className={`font-medium ${getQualityColor(recordingQuality[0] || 'Not Started').split(' ')[0]}`}>{recordingQuality[0] || 'Not Started'}</span></span>
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
                        
                        {/* Instructions - Compact */}
                        {!recordingStates[0] && !audioBlobs[0] && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500">💡</span>
                                    <div className="text-xs text-blue-800">
                                        <p className="font-medium mb-1">Recording Tips:</p>
                                        <p>• Quiet environment • Clear speech • Take your time</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating and Notes Section */}
                <div className="space-y-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 text-green-800 p-2 rounded-lg">📝</div>
                            <h2 className="text-xl font-semibold">Session Feedback</h2>
                        </div>
                        
                        {/* Rating Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                    RATING
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                How would you rate your reading session?
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition-colors ${
                                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                        } hover:text-yellow-400`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                                <span className="ml-3 text-gray-600">
                                    {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
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
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-gray-600 text-center sm:text-left">
                            <p className="text-sm">
                                Complete your recording and provide a rating to finish your reading skills practice.
                                Notes are optional but helpful for tracking your progress.
                            </p>
                        </div>
                        <Button 
                            onClick={submitAnswers}
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            <span>✓</span>
                            Submit Reading Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingSkillsSession;
