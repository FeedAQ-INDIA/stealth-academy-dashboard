import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, X, Save, Plus, Trash2 } from "lucide-react";

export default function QuizContentCreator({ onAdd, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    timeLimit: 10,
    passingScore: 70,
    maxAttempts: 3,
    category: "Assessment",
    questions: [{
      id: 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }]
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: formData.questions.length + 1,
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    const hasValidQuestions = formData.questions.every(q => 
      q.question.trim() && q.options.every(opt => opt.trim())
    );

    if (!hasValidQuestions) {
      alert("Please fill in all questions and options");
      return;
    }
    
    // Create the content structure expected by the parent
    const newContent = {
      contentType: "CourseQuiz",
      courseContent: {
        courseContentId: `temp_${Date.now()}`, // Temporary ID
        courseContentTitle: formData.title,
        courseContentCategory: formData.category,
        courseContentDuration: formData.timeLimit * 60, // Convert minutes to seconds
        isActive: true,
        coursecontentIsLicensed: false
      },
      courseQuiz: {
        courseQuizDescription: formData.description,
        courseQuizInstructions: formData.instructions,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        maxAttempts: formData.maxAttempts,
        questions: formData.questions.map(q => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      }
    };

    await onAdd?.(newContent);
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Quiz Settings</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="quiz-title">Title *</Label>
              <Input
                id="quiz-title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="quiz-description">Description</Label>
              <Textarea
                id="quiz-description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description of the quiz"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="quiz-instructions">Instructions</Label>
              <Textarea
                id="quiz-instructions"
                value={formData.instructions}
                onChange={(e) => updateField("instructions", e.target.value)}
                placeholder="Instructions for students taking the quiz"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="quiz-timelimit">Time Limit (minutes)</Label>
              <Input
                id="quiz-timelimit"
                type="number"
                min="1"
                value={formData.timeLimit}
                onChange={(e) => updateField("timeLimit", parseInt(e.target.value) || 10)}
                placeholder="10"
              />
            </div>

            <div>
              <Label htmlFor="quiz-passing">Passing Score (%)</Label>
              <Input
                id="quiz-passing"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) => updateField("passingScore", parseInt(e.target.value) || 70)}
                placeholder="70"
              />
            </div>

            <div>
              <Label htmlFor="quiz-attempts">Max Attempts</Label>
              <Input
                id="quiz-attempts"
                type="number"
                min="1"
                value={formData.maxAttempts}
                onChange={(e) => updateField("maxAttempts", parseInt(e.target.value) || 3)}
                placeholder="3"
              />
            </div>

            <div>
              <Label htmlFor="quiz-category">Category</Label>
              <select
                id="quiz-category"
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Assessment">Assessment</option>
                <option value="Practice">Practice</option>
                <option value="Interactive Content">Interactive Content</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Questions</h3>
            <Button type="button" onClick={addQuestion} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {formData.questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Question {index + 1}</h4>
                {formData.questions.length > 1 && (
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

              <div>
                <Label htmlFor={`question-${index}`}>Question Text *</Label>
                <Textarea
                  id={`question-${index}`}
                  value={question.question}
                  onChange={(e) => updateQuestion(index, "question", e.target.value)}
                  placeholder="Enter your question"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Answer Options *</Label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={question.correctAnswer === optIndex}
                      onChange={() => updateQuestion(index, "correctAnswer", optIndex)}
                      className="mt-1"
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateQuestionOption(index, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500">Select the radio button for the correct answer</p>
              </div>

              <div>
                <Label htmlFor={`explanation-${index}`}>Explanation (optional)</Label>
                <Textarea
                  id={`explanation-${index}`}
                  value={question.explanation}
                  onChange={(e) => updateQuestion(index, "explanation", e.target.value)}
                  placeholder="Explain why this is the correct answer"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Add Quiz Content
          </Button>
        </div>
      </form>
    </div>
  );
}
