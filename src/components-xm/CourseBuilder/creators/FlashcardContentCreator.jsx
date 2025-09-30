import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { BookOpen, Save, Plus, Trash2 } from "lucide-react";

// Zod schema aligned with backend entity attributes
const flashcardSchema = z.object({
  front: z.string()
    .min(1, "Question is required")
    .min(2, "Question must be at least 2 characters")
    .max(500, "Question must be less than 500 characters"),
  back: z.string()
    .min(1, "Answer is required")
    .min(2, "Answer must be at least 2 characters")
    .max(2000, "Answer must be less than 2000 characters"),
  hint: z.string()
    .max(500, "Explanation must be less than 500 characters")
    .optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM")
});

const flashcardContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  setDifficulty: z.enum(["EASY", "MEDIUM", "HARD", "MIXED"]).default("MEDIUM"),
  estimatedDuration: z.coerce.number().int().positive().max(10000).optional(), // minutes
  cards: z.array(flashcardSchema)
    .min(1, "Must have at least one flashcard")
    .max(100, "Cannot exceed 100 flashcards")
});

export default function FlashcardContentCreator({
  onAdd,
  onUpdate,
  onCancel,
  isLoading = false,
  courseContentSequence = 1,
  mode = 'create',
  existingContent = null
}) {
  const form = useForm({
    resolver: zodResolver(flashcardContentSchema),
    defaultValues: {
      title: existingContent?.courseContent?.courseContentTitle || existingContent?.courseFlashcard?.setTitle || "",
      description: existingContent?.courseFlashcard?.setDescription || "",
      setDifficulty: existingContent?.courseFlashcard?.setDifficulty || "MEDIUM",
      estimatedDuration: existingContent?.courseFlashcard?.estimatedDuration || (existingContent?.courseFlashcard?.cards?.length ? existingContent.courseFlashcard.cards.length * 2 : 2),
      cards: existingContent?.courseFlashcard?.cards?.length
        ? existingContent.courseFlashcard.cards.map(c => ({
            front: c.question,
            back: c.answer,
            hint: c.explanation || (Array.isArray(c.hints) ? c.hints[0] : ""),
            difficulty: c.difficulty || 'MEDIUM'
          }))
        : [ { front: "", back: "", hint: "", difficulty: "MEDIUM" } ],
    }
  });

  const [autoDuration, setAutoDuration] = useState(true);

  // Auto-calculate estimatedDuration = cards.length * 2 (minutes) when enabled
  const cards = form.watch('cards');
  useEffect(() => {
    if (autoDuration) {
      form.setValue('estimatedDuration', Math.max(1, cards.length * 2));
    }
  }, [cards.length, autoDuration]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards"
  });

  const handleSubmit = async (data) => {
    try {
      // Ensure estimatedDuration in minutes (already minutes)
      const estimatedDuration = data.estimatedDuration || data.cards.length * 2;
  // Tags removed from UI; preserve existing if editing
  const tagArray = existingContent?.courseFlashcard?.setTags || [];

      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseFlashcard",
        courseContent: {
          courseContentId: existingContent?.courseContent?.courseContentId || `temp_${Date.now()}`,
          courseContentTitle: data.title,
          courseContentCategory: existingContent?.courseContent?.courseContentCategory || "Interactive Content",
          courseContentType: "CourseFlashcard",
          courseContentSequence: existingContent?.courseContent?.courseContentSequence || courseContentSequence,
          courseContentDuration: estimatedDuration,
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: existingContent?.courseContent?.metadata || {}
        },
        courseFlashcard: {
          setTitle: data.title,
          setDescription: data.description,
          setDifficulty: data.setDifficulty,
          setTags: tagArray,
          estimatedDuration: estimatedDuration,
          cardCount: data.cards.length,
          metadata: existingContent?.courseFlashcard?.metadata || {},
          cards: data.cards.map((card, index) => ({
            question: card.front,
            answer: card.back,
            explanation: card.hint,
            difficulty: card.difficulty || 'MEDIUM',
            hints: card.hint ? [card.hint] : [],
            orderIndex: index + 1,
            metadata: {}
          })),
        },
      };
      if (mode === 'edit') {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Flashcard Set' : 'Add Flashcard Set'}
            </h2>
            <p className="text-sm text-gray-600">
              {mode === 'edit' ? 'Update this set of study flashcards' : 'Create a new set of study flashcards'}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Flashcard Set Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Flashcard Set Settings
            </h3>

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
                          placeholder="Enter flashcard set title" 
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
                          placeholder="Brief description of this flashcard set"
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description for the flashcard set
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category field removed per request; using implicit default */}
              {/* Set Difficulty Field */}
              <div>
                <FormField
                  control={form.control}
                  name="setDifficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set Difficulty</FormLabel>
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
                          <SelectItem value="MIXED">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Overall difficulty label for the flashcard set.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags field removed per request */}

              {/* Estimated Duration Field */}
              <div>
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} disabled={autoDuration} {...field} />
                      </FormControl>
                      <FormDescription>
                        {autoDuration ? 'Auto-calculated: 2 min per card' : 'Manual override'}
                        <button
                          type="button"
                          className="ml-2 text-xs text-blue-600 underline"
                          onClick={() => setAutoDuration(a => !a)}
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
          </div>

          {/* Flashcards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Flashcards ({fields.length} cards)
              </h3>
              <Button 
                type="button" 
                onClick={addCard} 
                size="sm" 
                variant="outline"
                disabled={fields.length >= 100}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Card {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeCard(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Question Side */}
                  <div>
                    <FormField
                      control={form.control}
                      name={`cards.${index}.front`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Question, term, or concept"
                              rows={3}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Answer Side */}
                  <div>
                    <FormField
                      control={form.control}
                      name={`cards.${index}.back`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Answer, definition, or explanation"
                              rows={3}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Explanation Field */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`cards.${index}.hint`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Explanation (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Optional explanation to help with understanding"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Short helper text to clarify the answer.
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
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Diff" />
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
                </div>

          
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Add Flashcard Set'}
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
