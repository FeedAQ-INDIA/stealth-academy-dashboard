import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, X, Save, Plus, Trash2 } from "lucide-react";

export default function FlashcardContentCreator({
  onAdd,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Interactive Content",
    cards: [
      {
        id: 1,
        front: "",
        back: "",
        hint: "",
      },
    ],
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCard = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      ),
    }));
  };

  const addCard = () => {
    const newCard = {
      id: formData.cards.length + 1,
      front: "",
      back: "",
      hint: "",
    };
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  const removeCard = (index) => {
    if (formData.cards.length > 1) {
      setFormData((prev) => ({
        ...prev,
        cards: prev.cards.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    const hasValidCards = formData.cards.every(
      (card) => card.front.trim() && card.back.trim()
    );

    if (!hasValidCards) {
      alert("Please fill in the front and back of all flashcards");
      return;
    }

    // Calculate estimated study time (2 minutes per card)
    const estimatedDuration = formData.cards.length * 120;

    // Create the content structure expected by the parent
    const newContent = {
      contentType: "CourseFlashcard",
      courseContent: {
        courseContentId: `temp_${Date.now()}`, // Temporary ID
        courseContentTitle: formData.title,
        courseContentCategory: formData.category,
        courseContentDuration: estimatedDuration,
        isActive: true,
        coursecontentIsLicensed: false,
      },
      courseFlashcard: {
        courseFlashcardDescription: formData.description,
        cardCount: formData.cards.length,
        cards: formData.cards.map((card) => ({
          front: card.front,
          back: card.back,
          hint: card.hint,
        })),
      },
    };

    await onAdd?.(newContent);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add Flashcard Set
            </h2>
            <p className="text-sm text-gray-600">
              Create a new set of study flashcards
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flashcard Set Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Flashcard Set Settings
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="flashcard-title">Title *</Label>
              <Input
                id="flashcard-title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter flashcard set title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="flashcard-description">Description</Label>
              <Textarea
                id="flashcard-description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of this flashcard set"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="flashcard-category">Category</Label>
              <select
                id="flashcard-category"
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Interactive Content">Interactive Content</option>
                <option value="Practice">Practice</option>
                <option value="Resource">Resource</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flashcards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Flashcards ({formData.cards.length} cards)
            </h3>
            <Button type="button" onClick={addCard} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          {formData.cards.map((card, index) => (
            <div key={card.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Card {index + 1}</h4>
                {formData.cards.length > 1 && (
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
                <div>
                  <Label htmlFor={`card-front-${index}`}>Front Side *</Label>
                  <Textarea
                    id={`card-front-${index}`}
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                    placeholder="Question, term, or concept"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor={`card-back-${index}`}>Back Side *</Label>
                  <Textarea
                    id={`card-back-${index}`}
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                    placeholder="Answer, definition, or explanation"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`card-hint-${index}`}>Hint (optional)</Label>
                <Input
                  id={`card-hint-${index}`}
                  value={card.hint}
                  onChange={(e) => updateCard(index, "hint", e.target.value)}
                  placeholder="Optional hint to help with the answer"
                />
              </div>

              {/* Card Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600 mb-2">Preview:</p>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <p className="font-medium text-gray-600 text-xs mb-1">
                      FRONT
                    </p>
                    <p className="text-gray-900">{card.front || "Empty"}</p>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <p className="font-medium text-gray-600 text-xs mb-1">
                      BACK
                    </p>
                    <p className="text-gray-900">{card.back || "Empty"}</p>
                  </div>
                </div>
                {card.hint && (
                  <div className="mt-2 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                    <p className="font-medium text-blue-600 text-xs mb-1">
                      HINT
                    </p>
                    <p className="text-blue-800 text-sm">{card.hint}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Add Flashcard Set
          </Button>
        </div>
      </form>
    </div>
  );
}
