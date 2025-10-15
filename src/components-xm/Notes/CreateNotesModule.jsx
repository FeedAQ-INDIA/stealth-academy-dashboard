import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
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
import { toast } from "@/components/hooks/use-toast.js";
import {
  Save,
  RotateCcw,
  FileText,
  Loader2,
  Upload,
  Mic,
  Square,
  X,
} from "lucide-react";
import PropTypes from "prop-types";

function CreateNotesModule({
  courseId,
  courseContentId,
  handleNotesSave,
  handleGetCurrentTime = null,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [attachments, setAttachments] = useState([]); // File[]
  const [recordedBlob, setRecordedBlob] = useState(null); // Blob | null
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const supportedAudioRef = useRef({ mime: "", ext: "webm" });

  // Detect supported audio type once
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

  const createNotesSchema = z.object({
    noteContent: z.string().min(3, "Notes must be at least 3 characters long"),
  });

  const createNotesForm = useForm({
    resolver: zodResolver(createNotesSchema),
    defaultValues: { noteContent: "" },
  });

  const watchedNotesText = createNotesForm.watch("noteContent");

  // Update unsaved changes state only

  // Derive unsaved changes from all inputs
  useEffect(() => {
    const hasText = (watchedNotesText || "").trim().length > 0;
    setHasUnsavedChanges(hasText || attachments.length > 0 || !!recordedBlob);
  }, [watchedNotesText, attachments, recordedBlob]);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  const pickFiles = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length === 0) return;
    
    // File size limit (25MB to match backend's 50MB but be safer for multiple files)
    const MAX_SIZE = 25 * 1024 * 1024;
    
    // Allowed file types (matching backend)
    const allowedMimeTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Documents
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm',
      // Video
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm',
      // Archives
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
      // JSON
      'application/json'
    ];

    const valid = [];
    const invalid = [];
    
    for (const f of list) {
      if (f.size > MAX_SIZE) {
        invalid.push(`${f.name} exceeds 25MB`);
      } else if (!allowedMimeTypes.includes(f.type)) {
        invalid.push(`${f.name} is not a supported file type`);
      } else {
        valid.push(f);
      }
    }
    
    // Show errors for invalid files
    if (invalid.length > 0) {
      toast({
        title: "File Validation Error",
        description: invalid.slice(0, 3).join(", ") + (invalid.length > 3 ? "..." : ""),
        variant: "destructive",
      });
    }
    
    // Add valid files
    if (valid.length > 0) {
      setAttachments((prev) => [...prev, ...valid]);
      if (valid.length !== list.length) {
        toast({
          title: "Partial Upload",
          description: `${valid.length} of ${list.length} files were added successfully.`,
        });
      }
    }
    
    // Reset the input so selecting the same file again triggers change
    e.target.value = "";
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const startRecording = async () => {
    if (isRecording || isRequestingMic) return;
    // Basic capability checks
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
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
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

  const clearRecording = () => {
    setRecordedBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  };

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const hasFiles = attachments.length > 0 || !!recordedBlob;
      
      if (hasFiles) {
        setIsUploadingFiles(true);
      }

      // Prepare FormData for the saveNote API that handles files directly
      const formData = new FormData();
      
      // Add note data
      formData.append("courseId", courseId.toString());
      formData.append("courseContentId", courseContentId.toString());
      formData.append("noteContent", data.noteContent);
      
      if (handleGetCurrentTime !== null) {
        const timestamp = handleGetCurrentTime();
        if (timestamp !== null) {
          formData.append("noteRefTimestamp", timestamp.toString());
        }
      }

      // Add files directly to FormData
      if (hasFiles) {
        const filesToUpload = [...attachments];
        
        // Add recorded audio as a file if it exists
        if (recordedBlob) {
          const ext = supportedAudioRef.current.ext || "webm";
          const mime = recordedBlob.type || "audio/webm";
          const recordedFile = new File([recordedBlob], `note-audio.${ext}`, {
            type: mime,
          });
          filesToUpload.push(recordedFile);
        }

        // Append each file to FormData
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        // Add metadata as JSON string
        const metadata = {
          totalFiles: filesToUpload.length,
          hasAudio: filesToUpload.some(file => file.type.startsWith('audio/')),
          hasFiles: filesToUpload.some(file => !file.type.startsWith('audio/'))
        };
        formData.append("metadata", JSON.stringify(metadata));
      }

      // Send the request to saveNote API with files
      const response = await axiosConn.post(
        import.meta.env.VITE_API_URL + "/saveNote",
        formData,
        { 
          headers: { 
            "Content-Type": "multipart/form-data" 
          } 
        }
      );

      console.log(response.data);
      toast({
        title: "Notes Saved Successfully",
        description: "Your notes have been saved and are now available.",
      });

      createNotesForm.reset();
      setHasUnsavedChanges(false);
      setAttachments([]);
      clearRecording();
      handleNotesSave();
    } catch (err) {
      console.error("Save note error:", err);
      toast({
        title: "Error Saving Notes",
        description: err.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingFiles(false);
    }
  }

  const handleReset = () => {
    createNotesForm.reset();
    setAttachments([]);
    clearRecording();
    setHasUnsavedChanges(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Minimal Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Notes</h3>
        </div>
        {/* Intentionally no controls in header */}
      </div>

      {/* Form */}
      <Form {...createNotesForm}>
        <form
          id="create-notes-form"
          onSubmit={createNotesForm.handleSubmit(onSubmit)}
          className="flex flex-col h-full p-3 gap-2"
        >
          <div className="flex-1 min-h-[120px]">
            <FormField
              control={createNotesForm.control}
              name="noteContent"
              render={({ field }) => (
                <FormItem className="flex-1 w-full h-full">
                  <FormControl>
                    <Textarea
                      placeholder="Type your notes..."
                      {...field}
                      className="flex-1 w-full h-full min-h-[120px] lg:resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400 text-gray-700 leading-relaxed"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
          </div>
          {/* Chips row: attachments + audio inline */}
          {(attachments.length > 0 || (recordedBlob && audioUrl)) && (
            <div className="flex flex-wrap items-center gap-2 py-1">
              {attachments.map((f, idx) => (
                <span
                  key={`${f.name}-${f.size}-${f.lastModified ?? idx}`}
                  className="inline-flex items-center gap-1 max-w-[220px] truncate rounded-full bg-gray-100 text-gray-700 px-2 py-1 text-xs border border-gray-200"
                  title={f.name}
                >
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-gray-500 hover:text-red-600"
                    aria-label={`Remove ${f.name}`}
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {recordedBlob && audioUrl && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 text-gray-700 px-2 py-1 text-xs border border-gray-200">
                  <audio
                    controls
                    src={audioUrl}
                    className="h-7"
                    aria-label="Recorded voice note playback"
                  >
                    <track
                      kind="captions"
                      src="data:text/vtt,WEBVTT"
                      label="Auto"
                      default={false}
                    />
                  </audio>
                  <button
                    type="button"
                    onClick={clearRecording}
                    className="text-gray-500 hover:text-red-600"
                    aria-label="Remove recording"
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Action row (not in header) */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {/* hidden input for file selection */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,audio/*,video/*,.zip,.rar,.7z,.json"
                className="hidden"
                onChange={onFilesSelected}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={pickFiles}
                disabled={isSubmitting}
                title="Upload files"
                className="border-gray-200"
              >
                <Upload className="w-4 h-4" />
              </Button>
              {!isRecording ? (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={startRecording}
                  disabled={isSubmitting}
                  title="Record voice note"
                  className="border-gray-200"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  onClick={stopRecording}
                  disabled={isSubmitting}
                  title="Stop recording"
                  className="bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                >
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs ">
              <Button
                className="bg-transparent hover:bg-gray-100 text-gray-700"
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleReset}
                disabled={isSubmitting || !hasUnsavedChanges}
                title="Reset"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                size="sm"
                disabled={isSubmitting || !hasUnsavedChanges}
                title="Save notes"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {isUploadingFiles ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button> 
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateNotesModule;

CreateNotesModule.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  courseContentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleNotesSave: PropTypes.func.isRequired,
  handleGetCurrentTime: PropTypes.func,
};
