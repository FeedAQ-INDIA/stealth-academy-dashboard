import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { BookOpen, Save, Plus, Trash2, Clock, RotateCcw, Lightbulb } from "lucide-react";

// Zod schema aligned with backend entity attributes
const flashcardSchema = z.object({
  front: z
    .string()
    .min(1, "Question is required")
    .min(2, "Question must be at least 2 characters")
    .max(1000, "Question must be less than 1000 characters"),
  back: z
    .string()
    .min(1, "Answer is required")
    .min(2, "Answer must be at least 2 characters")
    .max(5000, "Answer must be less than 5000 characters"),
  hint: z
    .string()
    .max(2000, "Explanation must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
});

const flashcardContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than or equal to 200 characters"),
  description: z
    .string()
    .max(5000, "Description must be less than 5000 characters")
    .optional()
    .or(z.literal("")),
  setDifficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]).default("MEDIUM"),
  estimatedDuration: z.coerce
    .number()
    .int()
    .positive()
    .max(1440)
    .optional(), // minutes, max 24 hours
  cards: z
    .array(flashcardSchema)
    .min(1, "Must have at least one flashcard")
    .max(200, "Cannot exceed 200 flashcards"),
});

export default function FlashcardContentCreator({
  onAdd,
  onUpdate,
  onCancel,
  isLoading = false,
  courseContentSequence = 1,
  mode = "create",
  existingContent = null,
}) {
  const form = useForm({
    resolver: zodResolver(flashcardContentSchema),
    defaultValues: {
      title:
        existingContent?.courseContentTitle ||
        existingContent?.courseContentTypeDetail?.setTitle ||
        "",
      description:
        existingContent?.courseContentTypeDetail?.setDescription || "",
      setDifficulty:
        existingContent?.courseContentTypeDetail?.setDifficulty || "MEDIUM",
      estimatedDuration:
        existingContent?.courseContentTypeDetail?.estimatedDuration ||
        (existingContent?.courseContentTypeDetail?.cards?.length
          ? existingContent.courseContentTypeDetail.cards.length * 2
          : 2),
      cards: existingContent?.courseContentTypeDetail?.cards?.length
        ? existingContent.courseContentTypeDetail.cards.map((c) => ({
            front: c.question,
            back: c.answer,
            hint: c.explanation || (Array.isArray(c.hints) ? c.hints[0] : ""),
            difficulty: c.difficulty || "MEDIUM",
          }))
        : [{ front: "", back: "", hint: "", difficulty: "MEDIUM" }],
    },
  });

  const [autoDuration, setAutoDuration] = useState(true);

  // Auto-calculate estimatedDuration = cards.length * 2 (minutes) when enabled
  const cards = form.watch('cards');
  useEffect(() => {
    if (autoDuration) {
      form.setValue('estimatedDuration', Math.max(1, cards.length * 2));
    }
  }, [cards.length, autoDuration, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards"
  });

  const handleSubmit = async (data) => {
    try {
      // Ensure estimatedDuration in minutes (already minutes)
      const estimatedDuration = data.estimatedDuration || data.cards.length * 2;
      // Tags removed from UI; preserve existing if editing
      const tagArray = existingContent?.courseContentTypeDetail?.setTags || [];

      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseFlashcard",
        courseContentId:
          existingContent?.courseContentId || `temp_${Date.now()}`, // Keep original ID if editing
        courseContentTitle: data.title,
        courseContentCategory: "Interactive Content",
        courseContentType: "CourseFlashcard",
        courseContentSequence:
          existingContent?.courseContentSequence || courseContentSequence,
        courseContentDuration: estimatedDuration,
        isActive: true,
        coursecontentIsLicensed: false,
        metadata: existingContent?.metadata || {},
        courseContentTypeDetail: {
          setTitle: data.title,
          setDescription: data.description,
          setDifficulty: data.setDifficulty,
          setTags: tagArray,
          estimatedDuration: estimatedDuration,
          cardCount: data.cards.length,
          cards: data.cards.map((card, index) => ({
            question: card.front,
            answer: card.back,
            explanation: card.hint,
            difficulty: card.difficulty || "MEDIUM",
            hints: card.hint ? [card.hint] : [],
            orderIndex: index + 1,
            metadata: {},
          })),
          metadata: existingContent?.courseContentTypeDetail?.metadata || {},
        },
      };
      if (mode === "edit") {
        await onUpdate?.(newContent);
      } else {
        await onAdd?.(newContent);
      }
    } catch (error) {
      console.error("Error submitting flashcard content:", error);
    }
  };

  const addCard = () => {
    append({
      front: "",
      back: "",
      hint: "",
    });
  };

  const removeCard = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="mx-auto p-4  space-y-6 sm:space-y-8" role="main" aria-label="Flashcard set creator">
      {/* Enhanced Header Section */}
      <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  {mode === "edit" ? "Edit Flashcard Set" : "Create Flashcard Set"}
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600">
                  {mode === "edit"
                    ? "Update this set of study flashcards"
                    : "Create a new interactive learning experience"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1 self-start sm:self-center">
              <Clock className="h-3 w-3 mr-1" />
              {form.watch('estimatedDuration') || 2} min
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Enhanced Flashcard Set Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RotateCcw className="h-4 w-4 text-blue-600" />
                </div>
                Flashcard Set Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {/* Title Field */}
                <div className="lg:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., JavaScript Fundamentals, Biology Terms" 
                            className="h-11"
                            {...field}
                            aria-describedby="title-description" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Field */}
                <div className="lg:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of this flashcard set..."
                            rows={3}
                            className="resize-none"
                            {...field}
                            aria-describedby="description-help"
                          />
                        </FormControl>
                        <FormDescription id="description-help">
                          Help learners understand what they will study
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Set Difficulty Field */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="setDifficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Set Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11" aria-label="Select difficulty level">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                                Easy
                              </div>
                            </SelectItem>
                            <SelectItem value="MEDIUM">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" aria-hidden="true"></div>
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="HARD">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></div>
                                Hard
                              </div>
                            </SelectItem>
                            <SelectItem value="MIXED">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" aria-hidden="true"></div>
                                Mixed
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Overall difficulty level for the flashcard set
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Estimated Duration Field */}
                <div className="sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="estimatedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Estimated Duration (min)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              min={1} 
                              disabled={autoDuration} 
                              className="h-11 pr-16"
                              {...field}
                              aria-describedby="duration-help"
                            />
                            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                          </div>
                        </FormControl>
                        <FormDescription id="duration-help" className="flex items-center justify-between">
                          <span>{autoDuration ? 'Auto-calculated: 2 min per card' : 'Manual override'}</span>
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800 underline transition-colors"
                            onClick={() => setAutoDuration(a => !a)}
                            aria-label={autoDuration ? 'Switch to manual duration entry' : 'Use automatic duration calculation'}
                          >
                            {autoDuration ? 'Switch to manual' : 'Use auto'}
                          </button>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Flashcards Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    Flashcards
                    <Badge variant="outline" className="ml-2">
                      {fields.length} {fields.length === 1 ? 'card' : 'cards'}
                    </Badge>
                  </div>
                </CardTitle>
                <Button 
                  type="button" 
                  onClick={addCard} 
                  size="sm" 
                  variant="outline"
                  disabled={fields.length >= 200}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {fields.map((field, index) => {
                const difficultyColors = {
                  EASY: { bg: 'bg-green-50', border: 'border-green-200', accent: 'bg-green-500', text: 'text-green-700' },
                  MEDIUM: { bg: 'bg-yellow-50', border: 'border-yellow-200', accent: 'bg-yellow-500', text: 'text-yellow-700' },
                  HARD: { bg: 'bg-red-50', border: 'border-red-200', accent: 'bg-red-500', text: 'text-red-700' }
                };
                
                const currentDifficulty = form.watch(`cards.${index}.difficulty`) || 'MEDIUM';
                const colors = difficultyColors[currentDifficulty];
                
                return (
                  <Card 
                    key={field.id} 
                    className={`relative border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    {/* Card Header with Enhanced Visual Identity */}
                    <CardHeader className="pb-4 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent}`} />
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-3">
                          <div className={`w-10 h-10 ${colors.accent} rounded-xl flex items-center justify-center text-white font-bold shadow-sm`}>
                            {index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-900">Flashcard {index + 1}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`${colors.text} border-current text-xs`}>
                                {currentDifficulty.charAt(0) + currentDifficulty.slice(1).toLowerCase()}
                              </Badge>
                              {form.watch(`cards.${index}.hint`) && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  Has Explanation
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardTitle>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeCard(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 lg:grid-cols-2">
                        {/* Question Side */}
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`cards.${index}.front`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  Question/Front *
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="What is the capital of France?"
                                    rows={4}
                                    className="resize-none border-blue-200 focus:border-blue-500 bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Answer Side */}
                        <div className="space-y-2">
                          <FormField
                            control={form.control}
                            name={`cards.${index}.back`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  Answer/Back *
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Paris is the capital of France."
                                    rows={4}
                                    className="resize-none border-green-200 focus:border-green-500 bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid gap-4 md:grid-cols-3">
                        {/* Explanation Field */}
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name={`cards.${index}.hint`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  Explanation (optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Paris is located in northern France..."
                                    className="h-11 bg-white"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Additional context or memory aid
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Card Difficulty */}
                        <div>
                          <FormField
                            control={form.control}
                            name={`cards.${index}.difficulty`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">Difficulty</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11 bg-white">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="EASY">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Easy
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="MEDIUM">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        Medium
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="HARD">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Hard
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* Enhanced Form Actions */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {fields.length} flashcard{fields.length !== 1 ? 's' : ''} • 
                  ~{form.watch('estimatedDuration') || 2} minute{(form.watch('estimatedDuration') || 2) !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-3">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isLoading || form.formState.isSubmitting}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading || form.formState.isSubmitting}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white min-w-[160px] h-11"
                  >
                    {isLoading || form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        <span>{mode === "edit" ? "Save Changes" : "Create Flashcard Set"}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
