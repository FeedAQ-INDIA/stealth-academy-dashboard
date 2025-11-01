import { Separator } from "@/components/ui/separator.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card.jsx";
import { useState, useRef, useEffect } from "react";
import {
  Clock,
  FileText,
  Calendar,
  Edit3,
  Trash2,
  Paperclip,
  Download,
  Volume2,
  File,
  Image,
  Video,
  Archive,
  Eye,
  Pause,
  X,
  Play,
  Upload,
  Save,
  Mic,
  Square,
} from "lucide-react";
import { InlineLoader } from "@/components/ui/loading-components";
import { Button } from "@/components/ui/button.jsx";
import { useParams } from "react-router-dom";
import axiosConn from "@/axioscon.js";
import { toast } from "@/components/hooks/use-toast.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.jsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Textarea } from "@/components/ui/textarea";
import PropTypes from "prop-types";

function NotesCard({ a, fetchCourseNotes }) {
  const { CourseId } = useParams();
  const [playingAudio, setPlayingAudio] = useState(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  
  // Edit mode states
  const [editAttachments, setEditAttachments] = useState([]);
  const fileInputRef = useRef(null);
  
  // Audio recording states for edit mode
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [recordedAudios, setRecordedAudios] = useState([]); // Array of {id, blob, url, name}
  const mediaRecorderRef = useRef(null);
  const supportedAudioRef = useRef({ mime: "", ext: "webm" });

  // Detect supported audio type once for edit mode
  useEffect(() => {
    const pickType = () => {
      if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
        return { mime: "", ext: "webm" };
      }
      const candidates = [
        { mime: "audio/webm;codecs=opus", ext: "webm" },
        { mime: "audio/webm", ext: "webm" },
        { mime: "audio/ogg;codecs=opus", ext: "ogg" },
        { mime: "audio/mp4", ext: "m4a" },
      ];
      for (const c of candidates) {
        try {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c.mime)) {
            return c;
          }
        } catch {
          // ignore
        }
      }
      // fallback to whatever the browser defaults to
      return { mime: "", ext: "webm" };
    };
    supportedAudioRef.current = pickType();
  }, []);

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      recordedAudios.forEach(audio => {
        if (audio.url) URL.revokeObjectURL(audio.url);
      });
      const currentRecorder = mediaRecorderRef.current;
      if (currentRecorder && currentRecorder.state !== "inactive") {
        currentRecorder.stop();
      }
    };
  }, [recordedAudios]);

  // Audio recording functions for edit mode
  const startRecording = async () => {
    if (isRecording || isRequestingMic) return;
    
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Recording not available",
        description: "Your browser doesn't allow microphone recording here.",
        variant: "destructive",
      });
      return;
    }
    if (typeof window === "undefined" || typeof window.MediaRecorder === "undefined") {
      toast({
        title: "Recorder unsupported",
        description: "This browser doesn't support audio recording. Please upload an audio file instead.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRequestingMic(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const opts = supportedAudioRef.current.mime ? { mimeType: supportedAudioRef.current.mime } : undefined;
      let mr;
      try {
        mr = new MediaRecorder(stream, opts);
      } catch {
        // try without opts if specific mime failed
        mr = new MediaRecorder(stream);
      }
      mediaRecorderRef.current = mr;
      const chunks = [];
      mr.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunks.push(evt.data);
      };
      mr.onstop = () => {
        const type = supportedAudioRef.current.mime || (mr.mimeType || "audio/webm");
        const blob = new Blob(chunks, { type });
        const url = URL.createObjectURL(blob);
        const ext = supportedAudioRef.current.ext || "webm";
        const audioId = Date.now().toString();
        const audioName = `Voice Note ${new Date().toLocaleTimeString()}`;
        
        setRecordedAudios(prev => [...prev, {
          id: audioId,
          blob,
          url,
          name: audioName,
          extension: ext,
          type
        }]);
        
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setIsRequestingMic(false);
    } catch (err) {
      console.error(err);
      setIsRequestingMic(false);
      const msg = (() => {
        if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
          return "Microphone access was blocked. Please allow mic permission and try again.";
        }
        if (err && (err.name === "NotFoundError" || err.name === "DevicesNotFoundError")) {
          return "No microphone found. Plug in a mic or try a different device.";
        }
        if (err && err.name === "NotReadableError") {
          return "Your microphone is busy. Close other apps using the mic and retry.";
        }
        return "Please allow mic permission or try uploading an audio file instead.";
      })();
      toast({
        title: "Microphone not available",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const removeRecordedAudio = (audioId) => {
    setRecordedAudios(prev => {
      const audioToRemove = prev.find(audio => audio.id === audioId);
      if (audioToRemove && audioToRemove.url) {
        URL.revokeObjectURL(audioToRemove.url);
      }
      return prev.filter(audio => audio.id !== audioId);
    });
  };

  const clearAllRecordings = () => {
    recordedAudios.forEach(audio => {
      if (audio.url) {
        URL.revokeObjectURL(audio.url);
      }
    });
    setRecordedAudios([]);
  };

  // Helper function to get file icon based on mime type
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('audio/')) return Volume2;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return Archive;
    return File;
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper function to check if file is previewable
  const isPreviewable = (mimeType) => {
    return mimeType.startsWith('image/') || 
           mimeType.startsWith('audio/') || 
           mimeType.startsWith('video/') ||
           mimeType.includes('pdf');
  };

  // Helper function to handle file preview
  const handleFilePreview = (file) => {
    if (file.mimeType.startsWith('image/') || file.mimeType.includes('pdf')) {
      // Open in new tab for images and PDFs
      window.open(file.fileUrl, '_blank');
    } else if (file.mimeType.startsWith('audio/')) {
      // Handle audio preview with play/pause
      setPlayingAudio(playingAudio === file.fileId ? null : file.fileId);
    } else if (file.mimeType.startsWith('video/')) {
      // Open video in new tab or could use modal
      window.open(file.fileUrl, '_blank');
    } else {
      // Download non-previewable files
      window.open(file.fileUrl, '_blank');
    }
  };

  // File management in edit mode - files will be updated when form is submitted

  const editNotesSchema = z.object({
    id: z.number(),
    noteContent: z.string().min(3, "Notes cannot be empty"),
  });

  const editNotesForm = useForm({
    resolver: zodResolver(editNotesSchema),
    defaultValues: { id: 0, noteContent: "" },
  });

  const deleteComment = (notesId) => {
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/deleteNote", {
        notesId,
      })
      .then((res) => {
        console.log(res);
        toast({
          title: "Notes deleted successfully",
        });
        fetchCourseNotes();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function onCommentUpdate(data) {
    console.log(data);
    
    // Prepare FormData for file uploads
    const formData = new FormData();
    formData.append("notesId", data.id.toString());
    formData.append("courseId", CourseId);
    formData.append("noteContent", data.noteContent);
    
    // Add only new files (files without fileId) to FormData
    const newFiles = editAttachments.filter(file => !file.fileId);
    
    // Add recorded audios as files
    recordedAudios.forEach((audio) => {
      // Create a File object with fallback for compatibility
      let recordedFile;
      try {
        recordedFile = new File([audio.blob], `${audio.name}.${audio.extension}`, {
          type: audio.type,
          lastModified: Date.now()
        });
      } catch {
        // Fallback: use the blob directly with a name property
        recordedFile = audio.blob;
        recordedFile.name = `${audio.name}.${audio.extension}`;
        recordedFile.lastModified = Date.now();
      }
      newFiles.push(recordedFile);
    });
    
    newFiles.forEach((file) => {
      formData.append("files", file);
    });
    
    // The backend will merge existing attachments with new ones
    // Since we removed deleteNoteAttachment API, files that are removed from editAttachments
    // will be handled by completely replacing the note's attachments with only the ones
    // that remain in editAttachments
    const retainedExistingFiles = editAttachments.filter(file => file.fileId);
    
    if (newFiles.length > 0 || retainedExistingFiles.length !== (a?.metadata?.attachments?.length || 0)) {
      // Include metadata about which existing files to retain
      const metadata = {
        retainedAttachments: retainedExistingFiles,
        totalFiles: editAttachments.length + recordedAudios.length,
        hasFiles: editAttachments.length > 0 || recordedAudios.length > 0,
        hasAudio: editAttachments.some(file => 
          (file.mimeType || file.type)?.startsWith('audio/')
        ) || recordedAudios.length > 0,
        recordedAudiosCount: recordedAudios.length
      };
      formData.append("metadata", JSON.stringify(metadata));
    }
    
    axiosConn
      .post(import.meta.env.VITE_API_URL + "/saveNote", formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setEditSheetOpen(false);
          toast({
            title: "Note updated successfully",
            description: res.data.message || "Your note has been updated.",
          });
          fetchCourseNotes();
          editNotesForm.reset();
          setEditAttachments([]);
          clearAllRecordings();
        } else {
          throw new Error(res.data.message || "Failed to update note");
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error updating note",
          description: err.response?.data?.message || "Please try again later.",
          variant: "destructive",
        });
      });
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900" />

        <div className=" p-4">

       
          <CardHeader className="p-0">
          {a?.courseContent?.courseContentTitle && (  <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-semibold">
                  {a?.courseContent?.courseContentTitle}
                </CardTitle>
              </div>
            </div>)}
                  <div className="space-y-2">
            {/* Note Header */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3 text-violet-500" />
              <span className="font-medium">{a?.v_created_date}</span>
              <Clock className="h-3 w-3 text-violet-500 ml-1" />
              <span>{a?.v_created_time}</span>
              {a.v_note_ref_timestamp && (
                <>
                  <Clock className="h-3 w-3 text-violet-500 ml-1" />
                  <span>{a?.v_note_ref_timestamp}</span>
                </>
              )}
            </div>

            <Separator />

            {/* Note Content */}
            <div className="mb-2">
              <div className="relative">
                {/* <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-gray-100 to-gray-100 rounded-full"></div> */}
                <p className=" text-black leading-snug whitespace-pre-wrap break-words text-sm">
                  {a?.noteContent}
                </p>
              </div>
            </div>

            {/* File Attachments */}
            {a?.metadata?.attachments && a.metadata.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Attachments ({a.metadata.attachments.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {a.metadata.attachments.map((file, fileIndex) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    const canPreview = isPreviewable(file.mimeType);
                    
                    return (
                      <div
                        key={fileIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.fileName || file.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {/* Audio Player for audio files */}
                          {file.mimeType.startsWith('audio/') && (
                            <div className="flex items-center gap-2 mr-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                                onClick={() => handleFilePreview(file)}
                                title={playingAudio === file.fileId ? "Pause audio" : "Play audio"}
                              >
                                {playingAudio === file.fileId ? (
                                  <Pause className="h-3 w-3" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                              {playingAudio === file.fileId && (
                                <audio
                                  src={file.fileUrl}
                                  controls
                                  autoPlay
                                  className="h-6 max-w-[120px]"
                                  onEnded={() => setPlayingAudio(null)}
                                  onPause={() => setPlayingAudio(null)}
                                >
                                  <track kind="captions" src="" label="Audio track" default={false} />
                                </audio>
                              )}
                            </div>
                          )}
                          
                          {/* Preview button for previewable files */}
                          {canPreview && !file.mimeType.startsWith('audio/') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                              onClick={() => handleFilePreview(file)}
                              title="Preview file"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {/* Download button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-200"
                            onClick={() => window.open(file.fileUrl, '_blank')}
                            title="Download or open file"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </CardHeader>
  

        <CardFooter className="p-0 pt-3">
          <div className="flex justify-end space-x-1 w-full">
            <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    editNotesForm.reset({
                      id: a?.noteId,
                      noteContent: a?.noteContent,
                    });
                    // Initialize edit state with existing attachments
                    setEditAttachments(a?.metadata?.attachments || []);
                    // Clear any previous recordings
                    clearAllRecordings();
                  }}
                  className="h-7 px-3 text-xs"
                >
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-xl text-blue-800">
                    <Edit3 className="h-5 w-5 text-blue-600" />
                    Edit Your Note
                  </SheetTitle>
                  <SheetDescription className="text-blue-600/70">
                    Make changes to your note below. You can also manage file attachments.
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  <Form {...editNotesForm}>
                    <form
                      onSubmit={editNotesForm.handleSubmit(
                        onCommentUpdate,
                        (errors) => {
                          console.error("Form validation errors:", errors);
                        }
                      )}
                      className="space-y-6"
                    >
                      {/* Note Content */}
                      <div>
                        <FormField
                          control={editNotesForm.control}
                          name="noteContent"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Type your note here..."
                                  className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* File Management Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">Attachments</h4>
                          <div className="flex items-center gap-2">
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,audio/*,video/*,.zip,.rar,.7z,.json"
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const MAX_TOTAL_FILES = 10;
                                
                                if (editAttachments.length + files.length > MAX_TOTAL_FILES) {
                                  toast({
                                    title: "Too many files",
                                    description: `Cannot add more than ${MAX_TOTAL_FILES} files per note. You currently have ${editAttachments.length} files.`,
                                    variant: "destructive",
                                  });
                                  e.target.value = "";
                                  return;
                                }
                                
                                // Basic file size validation
                                const MAX_SIZE = 25 * 1024 * 1024; // 25MB
                                const validFiles = files.filter(file => {
                                  if (file.size > MAX_SIZE) {
                                    toast({
                                      title: "File too large",
                                      description: `${file.name} exceeds 25MB limit`,
                                      variant: "destructive",
                                    });
                                    return false;
                                  }
                                  return true;
                                });
                                
                                if (validFiles.length > 0) {
                                  setEditAttachments(prev => [...prev, ...validFiles]);
                                  toast({
                                    title: "Files added",
                                    description: `${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added successfully.`,
                                  });
                                }
                                e.target.value = "";
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs"
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Add Files
                            </Button>
                            {!isRecording ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={startRecording}
                                disabled={editNotesForm.formState.isSubmitting}
                                className="text-xs"
                              >
                                <Mic className="w-3 h-3 mr-1" />
                                Record
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                onClick={stopRecording}
                                disabled={editNotesForm.formState.isSubmitting}
                                className="text-xs bg-red-600 hover:bg-red-700 text-white animate-pulse"
                              >
                                <Square className="w-3 h-3 mr-1" />
                                Stop
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Existing and New Attachments */}
                        {(editAttachments.length > 0 || recordedAudios.length > 0) && (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {editAttachments.map((file, idx) => {
                              const isExisting = file.fileId; // Existing files have fileId
                              const FileIcon = getFileIcon(isExisting ? file.mimeType : file.type);
                              const fileName = isExisting ? (file.fileName || file.originalName) : file.name;
                              const fileSize = isExisting ? file.fileSize : file.size;
                              
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <FileIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {fileName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize(fileSize)}
                                        {isExisting && <span className="ml-2 text-blue-600 font-medium">Existing</span>}
                                        {!isExisting && <span className="ml-2 text-green-600 font-medium">New</span>}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Simply remove from local state - changes will be saved when form is submitted
                                      setEditAttachments(prev => prev.filter((_, i) => i !== idx));
                                      
                                      if (isExisting) {
                                        toast({
                                          title: "File marked for removal",
                                          description: "File will be removed when you save the note.",
                                        });
                                      } else {
                                        toast({
                                          title: "File removed",
                                          description: "New file removed from attachments.",
                                        });
                                      }
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                            
                            {/* Recorded Audios */}
                            {recordedAudios.map((audio) => (
                              <div
                                key={audio.id}
                                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <Volume2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {audio.name}
                                    </p>
                                    <p className="text-xs text-purple-600">
                                      Voice Recording • New
                                    </p>
                                    <audio
                                      controls
                                      src={audio.url}
                                      className="mt-1 h-6 max-w-[200px]"
                                      aria-label={`Recorded audio: ${audio.name}`}
                                    >
                                      <track
                                        kind="captions"
                                        src="data:text/vtt,WEBVTT"
                                        label="Auto"
                                        default={false}
                                      />
                                    </audio>
                                  </div>
                                </div>
                                
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    removeRecordedAudio(audio.id);
                                    toast({
                                      title: "Audio removed",
                                      description: "Voice recording removed from attachments.",
                                    });
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <SheetFooter className="gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            editNotesForm.reset({
                              id: a?.noteId,
                              noteContent: a?.noteContent,
                            });
                            // Reset attachments to original state
                            setEditAttachments(a?.metadata?.attachments || []);
                            // Clear recordings
                            clearAllRecordings();
                            toast({
                              title: "Form reset",
                              description: "All changes have been reset to original values.",
                            });
                          }}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          Reset
                        </Button>
                        <SheetClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </SheetClose>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          disabled={editNotesForm.formState.isSubmitting}
                        >
                          {editNotesForm.formState.isSubmitting ? (
                            <InlineLoader message="Saving..." size="sm" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </SheetFooter>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="xs"
                  className="h-7 px-3 text-xs"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    Delete Note
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-red-700/80">
                    This action cannot be undone. This will permanently delete
                    your note from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteComment(a?.noteId)}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter> 
      </div>
    </Card>
  );
}

NotesCard.propTypes = {
  a: PropTypes.shape({
    noteId: PropTypes.number,
    noteContent: PropTypes.string,
    v_created_date: PropTypes.string,
    v_created_time: PropTypes.string,
    v_note_ref_timestamp: PropTypes.string,
    courseContent: PropTypes.shape({
      courseContentTitle: PropTypes.string,
    }),
    metadata: PropTypes.shape({
      attachments: PropTypes.arrayOf(PropTypes.shape({
        fileId: PropTypes.string,
        fileName: PropTypes.string,
        originalName: PropTypes.string,
        fileUrl: PropTypes.string,
        mimeType: PropTypes.string,
        fileSize: PropTypes.number,
      })),
    }),
  }).isRequired,
  fetchCourseNotes: PropTypes.func.isRequired,
};

export default NotesCard;
