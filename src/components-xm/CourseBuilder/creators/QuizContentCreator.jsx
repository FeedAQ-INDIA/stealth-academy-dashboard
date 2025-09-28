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

// Zod schema for quiz content validation
const questionSchema = z.object({
  question: z.string()
    .min(1, "Question is required")
    .min(10, "Question must be at least 10 characters"),
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "INPUT_BOX"], {
    required_error: "Please select a question type"
  }).default("SINGLE_CHOICE"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.number(), z.string()]).optional(),
  explanation: z.string().optional()
}).refine((data) => {
  // INPUT_BOX questions need correct answer but not options
  if (data.type === "INPUT_BOX") {
    return data.correctAnswer && typeof data.correctAnswer === "string" && data.correctAnswer.trim() !== "";
  }
  
  // Multiple choice questions need options
  if (!data.options || data.options.length < 2) {
    return false;
  }
  // Check if all options are filled
  if (data.options.some(opt => !opt || opt.trim() === "")) {
    return false;
  }
  // Check if correct answer is within range
  return typeof data.correctAnswer === "number" && data.correctAnswer >= 0 && data.correctAnswer < data.options.length;
}, {
  message: "Invalid question configuration",
  path: ["correctAnswer"]
});

const quizContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  instructions: z.string()
    .max(1000, "Instructions must be less than 1000 characters")
    .optional(),
  timeLimit: z.coerce.number()
    .min(1, "Time limit must be at least 1 minute")
    .max(240, "Time limit must be less than 4 hours"),
  passingScore: z.coerce.number()
    .min(0, "Passing score must be at least 0%")
    .max(100, "Passing score cannot exceed 100%"),
  maxAttempts: z.coerce.number()
    .min(1, "Must allow at least 1 attempt")
    .max(10, "Cannot exceed 10 attempts"),
  category: z.enum(["Assessment", "Practice", "Interactive Content"], {
    required_error: "Please select a category"
  }),
  questions: z.array(questionSchema)
    .min(1, "Must have at least one question")
    .max(50, "Cannot exceed 50 questions")
});

export default function QuizContentCreator({ 
  onAdd, 
  onCancel, 
  isLoading = false,
  courseContentSequence = 1, // Add sequence parameter
  courseId = null // Add courseId parameter for entity requirements
}) {
  const form = useForm({
    resolver: zodResolver(quizContentSchema),
    defaultValues: {
      title: "",
      description: "",
      instructions: "",
      timeLimit: 10,
      passingScore: 70,
      maxAttempts: 3,
      category: "Assessment",
      questions: [{
        question: "",
        type: "SINGLE_CHOICE",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: ""
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const handleSubmit = async (data) => {
    try {
      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseQuiz",
        courseContent: {
          courseContentId: `temp_${Date.now()}`, // Temporary ID
          courseContentTitle: data.title,
          courseContentCategory: data.category,
          courseContentType: "CourseQuiz",
          courseContentSequence: courseContentSequence, // Use passed sequence
          courseContentDuration: data.timeLimit * 60, // Convert minutes to seconds
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: {}
        },
        courseQuiz: {
          courseQuizDescription: data.description,
          courseQuizType: data.category === "Assessment" ? "CERTIFICATION" : "QUIZ", // Map category to quiz type
          isQuizTimed: data.timeLimit > 0, // Boolean field
          courseQuizTimer: data.timeLimit * 60, // Convert minutes to seconds
          courseQuizPassPercent: data.passingScore,
          metadata: {
            instructions: data.instructions,
            maxAttempts: data.maxAttempts
          }
        },
        questions: data.questions.map((q, index) => ({
          courseId: courseId, // Required field from entity
          courseQuizId: null, // Will be set after quiz creation
          courseContentId: null, // Will be set after content creation
          quizQuestionTitle: q.question, // Matches QuizQuestion.quizQuestionTitle field
          quizQuestionNote: q.explanation, // Matches QuizQuestion.quizQuestionNote field
          quizQuestionType: q.type, // Now directly matches entity enum values
          quizQuestionOption: q.options, // JSONB field for options
          quizQuestionCorrectAnswer: [q.correctAnswer], // Index for multiple choice
          quizQuestionPosPoint: 1, // Default positive points
          quizQuestionNegPoint: 0, // Default negative points
          questionSequence: index + 1, // Matches QuizQuestion.questionSequence field
          difficultyLevel: "MEDIUM", // Default difficulty
          explanation: q.explanation,
          metadata: {} // Default metadata object
        }))
      };

      await onAdd?.(newContent);
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
      explanation: ""
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
            <h2 className="text-xl font-semibold text-gray-900">Add Quiz Content</h2>
            <p className="text-sm text-gray-600">Create a new assessment quiz</p>
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

              {/* Time Limit Field */}
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
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                        />
                      </FormControl>
                      <FormDescription>
                        Time limit in minutes (1-240)
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

              {/* Category Field */}
              <div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                          <SelectItem value="Practice">Practice</SelectItem>
                          <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                        </SelectContent>
                      </Select>
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
                    // Multiple Choice Questions - Show options with radio buttons
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
                                      <RadioGroupItem 
                                        value={optIndex.toString()} 
                                        id={`q${index}-opt${optIndex}`}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`questions.${index}.options.${optIndex}`}
                                        render={({ field: optionField }) => (
                                          <FormItem className="flex-1">
                                            <FormControl>
                                              <Input
                                                placeholder={`Option ${optIndex + 1}`}
                                                {...optionField}
                                              />
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
                                            // Adjust correct answer if needed
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
                              <FormDescription>
                                Select the radio button for the correct answer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </>
                  )}
                </div>

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
                      <FormDescription>
                        This will be shown after answering the question
                      </FormDescription>
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
              Add Quiz Content
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
