import { useForm, useFieldArray } from "react-hook-form";
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

// Zod schema for flashcard content validation
const flashcardSchema = z.object({
  front: z.string()
    .min(1, "Question is required")
    .min(2, "Question must be at least 2 characters")
    .max(500, "Question must be less than 500 characters"),
  back: z.string()
    .min(1, "Answer is required")
    .min(2, "Answer must be at least 2 characters")
    .max(1000, "Answer must be less than 1000 characters"),
  hint: z.string()
    .max(200, "Explanation must be less than 200 characters")
    .optional()
});

const flashcardContentSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z.enum(["Interactive Content", "Practice", "Resource"], {
    required_error: "Please select a category"
  }),
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
      category: existingContent?.courseContent?.courseContentCategory || "Interactive Content",
      cards: existingContent?.courseFlashcard?.cards?.length
        ? existingContent.courseFlashcard.cards.map(c => ({
            front: c.question,
            back: c.answer,
            hint: c.explanation || (Array.isArray(c.hints) ? c.hints[0] : "")
          }))
        : [ { front: "", back: "", hint: "" } ],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards"
  });

  const handleSubmit = async (data) => {
    try {
      // Calculate estimated study time (2 minutes per card)
      const estimatedDuration = data.cards.length * 120;

      // Create the content structure expected by the parent
      const newContent = {
        contentType: "CourseFlashcard",
        courseContent: {
          courseContentId: existingContent?.courseContent?.courseContentId || `temp_${Date.now()}`,
          courseContentTitle: data.title,
          courseContentCategory: data.category,
          courseContentType: "CourseFlashcard",
          courseContentSequence: existingContent?.courseContent?.courseContentSequence || courseContentSequence,
          courseContentDuration: estimatedDuration,
          isActive: true,
          coursecontentIsLicensed: false,
          metadata: existingContent?.courseContent?.metadata || {}
        },
        courseFlashcard: {
          setTitle: data.title, // Matches CourseFlashcard.setTitle field
          setDescription: data.description, // Matches CourseFlashcard.setDescription field
          setDifficulty: "MEDIUM", // Default difficulty
          setTags: [], // Default empty tags
          estimatedDuration: Math.ceil(data.cards.length * 2), // 2 minutes per card in minutes
          cardCount: data.cards.length,
          cards: data.cards.map((card, index) => ({
            question: card.front, // Matches Flashcard.question field
            answer: card.back, // Matches Flashcard.answer field
            explanation: card.hint, // Matches Flashcard.explanation field
            difficulty: "MEDIUM", // Default difficulty
            cardType: "BASIC", // Default card type
            hints: card.hint ? [card.hint] : [], // Convert hint to hints array
            orderIndex: index + 1, // Matches Flashcard.orderIndex field
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
                          <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                          <SelectItem value="Practice">Practice</SelectItem>
                          <SelectItem value="Resource">Resource</SelectItem>
                        </SelectContent>
                      </Select>
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

                {/* Explanation Field */}
                <div>
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
                          Optional explanation that can help students understand the answer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
