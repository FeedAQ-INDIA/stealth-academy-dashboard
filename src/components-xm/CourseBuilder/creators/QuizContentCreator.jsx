import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HelpCircle, Save, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

// Zod schema for quiz content validation updated to mirror entity fields & semantics
const questionSchema = z.object({
  question: z.string().min(1, "Question is required").min(10, "Question must be at least 10 characters"),
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "INPUT_BOX"], { required_error: "Please select a question type" }).default("SINGLE_CHOICE"),
  options: z.array(z.string()).optional(),
  // SINGLE_CHOICE -> number index, INPUT_BOX -> string answer, MULTIPLE_CHOICE -> array indices
  correctAnswer: z.union([z.number(), z.string()]).optional(),
  correctAnswers: z.array(z.number()).optional(),
  explanation: z.string().optional(), // maps to explanation field (and note optionally)
  note: z.string().optional(), // maps to quizQuestionNote
  posPoints: z.coerce.number().int().min(0).max(100).default(1),
  negPoints: z.coerce.number().int().min(0).max(100).default(0),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM")
}).superRefine((data, ctx) => {
  if (data.type === "INPUT_BOX") {
    if (!data.correctAnswer || typeof data.correctAnswer !== "string" || data.correctAnswer.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["correctAnswer"], message: "Correct answer is required for input box" });
    }
    return;
  }
  // For choice questions
  if (!data.options || data.options.length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: "At least 2 options required" });
    return;
  }
  if (data.options.some(o => !o || o.trim() === "")) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: "All options must be filled" });
  }
  if (data.type === "SINGLE_CHOICE") {
    if (typeof data.correctAnswer !== "number" || data.correctAnswer < 0 || data.correctAnswer >= data.options.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["correctAnswer"], message: "Select one correct option" });
    }
  }
  if (data.type === "MULTIPLE_CHOICE") {
    if (!data.correctAnswers || !Array.isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["correctAnswers"], message: "Select at least one correct option" });
      return;
    }
    if (data.correctAnswers.some(i => i < 0 || i >= data.options.length)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["correctAnswers"], message: "Invalid correct answer index" });
    }
  }
});

const quizContentSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  instructions: z.string().max(1000, "Instructions must be less than 1000 characters").optional(),
  quizType: z.enum(["CERTIFICATION", "QUIZ"]).default("QUIZ"), // maps to courseQuizType
  isTimed: z.boolean().default(true), // maps to isQuizTimed
  timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 minute").max(240, "Time limit must be less than 4 hours").optional(),
  passingScore: z.coerce.number().min(0, "Passing score must be at least 0%").max(100, "Passing score cannot exceed 100%"),
  maxAttempts: z.coerce.number().min(1, "Must allow at least 1 attempt").max(10, "Cannot exceed 10 attempts"),
  questions: z.array(questionSchema).min(1, "Must have at least one question").max(50, "Cannot exceed 50 questions")
}).superRefine((data, ctx) => {
  if (data.isTimed && (!data.timeLimit || data.timeLimit < 1)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["timeLimit"], message: "Time limit required when quiz is timed" });
  }
});

export default function QuizContentCreator({ 
  onAdd, 
  onUpdate,
  onCancel, 
  isLoading = false,
  courseContentSequence = 1,
  courseId = null,
  mode = 'create',
  existingContent = null
}) {
  const form = useForm({
    resolver: zodResolver(quizContentSchema),
    defaultValues: {
      title: existingContent?.courseContent?.courseContentTitle || existingContent?.courseQuiz?.courseQuizTitle || existingContent?.courseQuiz?.title || "",
      description: existingContent?.courseQuiz?.courseQuizDescription || "",
      instructions: existingContent?.courseQuiz?.metadata?.instructions || "",
      quizType: existingContent?.courseQuiz?.courseQuizType || (existingContent?.courseQuiz?.courseQuizType === "CERTIFICATION" ? "CERTIFICATION" : "QUIZ"),
      isTimed: existingContent?.courseQuiz?.isQuizTimed ?? true,
      timeLimit: existingContent?.courseQuiz?.courseQuizTimer ? Math.max(1, Math.round(existingContent.courseQuiz.courseQuizTimer / 60)) : 10,
      passingScore: existingContent?.courseQuiz?.courseQuizPassPercent || 70,
      maxAttempts: existingContent?.courseQuiz?.metadata?.maxAttempts || 3,
      questions: (existingContent?.courseQuiz?.questions || existingContent?.questions || []).length ? (existingContent?.courseQuiz?.questions || existingContent?.questions).map(q => ({
        question: q.quizQuestionTitle || q.question || "",
        type: q.quizQuestionType || 'SINGLE_CHOICE',
        options: Array.isArray(q.quizQuestionOption) ? q.quizQuestionOption : ["", "", "", ""],
        correctAnswer: q.quizQuestionType === 'SINGLE_CHOICE' ? (Array.isArray(q.quizQuestionCorrectAnswer) ? q.quizQuestionCorrectAnswer[0] : 0) : undefined,
        correctAnswers: q.quizQuestionType === 'MULTIPLE_CHOICE' ? (Array.isArray(q.quizQuestionCorrectAnswer) ? q.quizQuestionCorrectAnswer : []) : [],
        explanation: q.explanation || "",
        note: q.quizQuestionNote || "",
        posPoints: q.quizQuestionPosPoint ?? 1,
        negPoints: q.quizQuestionNegPoint ?? 0,
        difficulty: q.difficultyLevel || 'MEDIUM'
      })) : [{ question: "", type: "SINGLE_CHOICE", options: ["", "", "", ""], correctAnswer: 0, correctAnswers: [], explanation: "", note: "", posPoints: 1, negPoints: 0, difficulty: 'MEDIUM' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const handleSubmit = async (data) => {
    try {
      const questions = data.questions.map((q, index) => ({
        courseId: courseId,
        courseQuizId: null,
        courseContentId: null,
        quizQuestionTitle: q.question,
        quizQuestionNote: q.note || null,
        quizQuestionType: q.type,
        quizQuestionOption: q.type === 'INPUT_BOX' ? [] : q.options,
        quizQuestionCorrectAnswer: q.type === 'MULTIPLE_CHOICE' ? q.correctAnswers : q.type === 'SINGLE_CHOICE' ? [q.correctAnswer] : [q.correctAnswer],
        quizQuestionPosPoint: q.posPoints ?? 1,
        quizQuestionNegPoint: q.negPoints ?? 0,
        questionSequence: index + 1,
        difficultyLevel: q.difficulty || 'MEDIUM',
        explanation: q.explanation || null,
        metadata: {}
      }));

      const totalPos = questions.reduce((s, q) => s + (q.quizQuestionPosPoint || 0), 0);
      const totalNeg = questions.reduce((s, q) => s + (q.quizQuestionNegPoint || 0), 0);

      const newContent = {
        contentType: "CourseQuiz",
        courseContent: {
          courseContentId: existingContent?.courseContent?.courseContentId || `temp_${Date.now()}`,
          courseContentTitle: data.title,
          courseContentCategory: data.quizType === 'CERTIFICATION' ? 'Assessment' : 'Practice',
          courseContentType: "CourseQuiz",
          courseContentSequence: existingContent?.courseContent?.courseContentSequence || courseContentSequence,
          courseContentDuration: data.isTimed && data.timeLimit ? data.timeLimit * 60 : 0,
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: existingContent?.courseContent?.metadata || {}
        },
        courseQuiz: {
          courseQuizDescription: data.description,
          courseQuizType: data.quizType,
          isQuizTimed: data.isTimed,
          courseQuizTimer: data.isTimed && data.timeLimit ? data.timeLimit * 60 : null,
          courseQuizPassPercent: data.passingScore,
          questionCount: questions.length,
          totalPosPoints: totalPos,
          totalNegPoints: totalNeg,
          metadata: {
            ...(existingContent?.courseQuiz?.metadata || {}),
            instructions: data.instructions,
            maxAttempts: data.maxAttempts
          },
          questions
        }
      };

      if (mode === 'edit') await onUpdate?.(newContent); else await onAdd?.(newContent);
    } catch (error) {
      console.error("Error submitting quiz content:", error);
    }
  };

  const addQuestion = () => {
    append({
  question: "",
  type: "SINGLE_CHOICE",
  options: ["", "", "", ""],
  correctAnswer: 0,
  correctAnswers: [],
  explanation: "",
  note: "",
  posPoints: 1,
  negPoints: 0,
  difficulty: 'MEDIUM'
    });
  };

  const removeQuestion = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{mode === 'edit' ? 'Edit Quiz Content' : 'Add Quiz Content'}</h2>
            <p className="text-sm text-gray-600">{mode === 'edit' ? 'Update this assessment quiz' : 'Create a new assessment quiz'}</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Quiz Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Quiz Settings</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Title Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter quiz title" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the quiz"
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description for the quiz
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Instructions Field */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Instructions for students taking the quiz"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Instructions that will be shown to students
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quiz Type Field */}
              <div>
                <FormField
                  control={form.control}
                  name="quizType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quiz type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="QUIZ">Quiz</SelectItem>
                          <SelectItem value="CERTIFICATION">Certification</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Maps to courseQuizType entity field</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Timed Toggle */}
              <div>
                <FormField
                  control={form.control}
                  name="isTimed"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Timed Quiz</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          <span className="text-sm text-gray-600">Enable timer</span>
                        </div>
                      </FormControl>
                      <FormDescription>Controls isQuizTimed & timer fields</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Limit Field (conditional) */}
              <div>
                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="240"
                          placeholder="10"
                          disabled={!form.watch('isTimed')}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                        />
                      </FormControl>
                      <FormDescription>
                        {form.watch('isTimed') ? 'Time limit in minutes (1-240)' : 'Disabled (quiz not timed)'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Passing Score Field */}
              <div>
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Score (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          placeholder="70"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 70)}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage score required to pass
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Max Attempts Field */}
              <div>
                <FormField
                  control={form.control}
                  name="maxAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Attempts</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="10"
                          placeholder="3"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum attempts allowed (1-10)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Questions</h3>
              <Button 
                type="button" 
                onClick={addQuestion} 
                size="sm" 
                variant="outline"
                disabled={fields.length >= 50}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Question Text */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your question"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Question Type */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Handle different question types
                          if (value === "INPUT_BOX") {
                            // For input box, set empty string as correct answer
                            form.setValue(`questions.${index}.correctAnswer`, "");
                            form.setValue(`questions.${index}.options`, []);
                          } else {
                            // For multiple choice, ensure we have at least 4 options
                            const currentQuestion = form.getValues(`questions.${index}`);
                            if (!currentQuestion.options || currentQuestion.options.length < 4) {
                              form.setValue(`questions.${index}.options`, ["", "", "", ""]);
                            }
                            form.setValue(`questions.${index}.correctAnswer`, 0);
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                          <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                          <SelectItem value="INPUT_BOX">Input Box</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Answer Options */}
                <div className="space-y-3">
                  {form.watch(`questions.${index}.type`) === "INPUT_BOX" ? (
                    // Input Box Question - Show correct answer input
                    <FormField
                      control={form.control}
                      name={`questions.${index}.correctAnswer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correct Answer *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the correct answer"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormDescription>
                            The expected answer for this input question
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    // Choice Questions
                    <>
                      <div className="flex items-center justify-between">
                        <FormLabel>Answer Options *</FormLabel>
                        {form.watch(`questions.${index}.options`)?.length < 6 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentOptions = form.getValues(`questions.${index}.options`);
                              form.setValue(`questions.${index}.options`, [...currentOptions, ""]);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Option
                          </Button>
                        )}
                      </div>
                      
                      {form.watch(`questions.${index}.type`) === 'SINGLE_CHOICE' && (
                        <FormField
                          control={form.control}
                          name={`questions.${index}.correctAnswer`}
                          render={({ field: correctAnswerField }) => {
                            const watchedOptions = form.watch(`questions.${index}.options`) || [];
                            return (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => correctAnswerField.onChange(parseInt(value))}
                                    value={correctAnswerField.value?.toString() || "0"}
                                  >
                                    {watchedOptions.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-3">
                                        <RadioGroupItem value={optIndex.toString()} id={`q${index}-opt${optIndex}`} />
                                        <FormField
                                          control={form.control}
                                          name={`questions.${index}.options.${optIndex}`}
                                          render={({ field: optionField }) => (
                                            <FormItem className="flex-1">
                                              <FormControl>
                                                <Input placeholder={`Option ${optIndex + 1}`} {...optionField} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        {watchedOptions.length > 2 && (
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                              const currentOptions = form.getValues(`questions.${index}.options`);
                                              const newOptions = currentOptions.filter((_, i) => i !== optIndex);
                                              form.setValue(`questions.${index}.options`, newOptions);
                                              const currentCorrect = form.getValues(`questions.${index}.correctAnswer`);
                                              if (currentCorrect >= newOptions.length) {
                                                form.setValue(`questions.${index}.correctAnswer`, Math.max(0, newOptions.length - 1));
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormDescription>Select one correct answer</FormDescription>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      )}

                      {form.watch(`questions.${index}.type`) === 'MULTIPLE_CHOICE' && (
                        <FormField
                          control={form.control}
                          name={`questions.${index}.correctAnswers`}
                          render={({ field: correctAnswersField }) => {
                            const watchedOptions = form.watch(`questions.${index}.options`) || [];
                            const selected = correctAnswersField.value || [];
                            const toggle = (optIndex) => {
                              const exists = selected.includes(optIndex);
                              const next = exists ? selected.filter(i => i !== optIndex) : [...selected, optIndex];
                              correctAnswersField.onChange(next);
                            };
                            return (
                              <FormItem>
                                <div className="space-y-2">
                                  {watchedOptions.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={selected.includes(optIndex)}
                                        onChange={() => toggle(optIndex)}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`questions.${index}.options.${optIndex}`}
                                        render={({ field: optionField }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input placeholder={`Option ${optIndex + 1}`} {...optionField} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      {watchedOptions.length > 2 && (
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() => {
                                            const currentOptions = form.getValues(`questions.${index}.options`);
                                            const newOptions = currentOptions.filter((_, i) => i !== optIndex);
                                            form.setValue(`questions.${index}.options`, newOptions);
                                            const newSelected = selected.filter(i => i !== optIndex).map(i => (i > optIndex ? i - 1 : i));
                                            correctAnswersField.onChange(newSelected);
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <FormDescription>Select one or more correct answers</FormDescription>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Points & Difficulty */}
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.posPoints`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>+ Points</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} {...field} onChange={(e)=> field.onChange(parseInt(e.target.value)||0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.negPoints`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>- Points</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} {...field} onChange={(e)=> field.onChange(parseInt(e.target.value)||0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.difficulty`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Note (optional) */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.note`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional note for this question" rows={2} {...field} />
                      </FormControl>
                      <FormDescription>Maps to quizQuestionNote</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Explanation */}
                <FormField
                  control={form.control}
                  name={`questions.${index}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this is the correct answer"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Shown after answering; maps to explanation field</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Add Quiz Content'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading || form.formState.isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
