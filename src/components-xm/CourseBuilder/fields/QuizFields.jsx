import PropTypes from 'prop-types';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Clock, 
  Trophy, 
  CheckCircle, 
  Plus,
  Settings,
  Eye,
  Edit3,
  Trash2,
  Move,
  Brain,
  Target
} from 'lucide-react';

// Validation schema for quiz configuration
const quizSchema = z.object({
  courseQuizType: z.enum(['CERTIFICATION', 'KNOWLEDGE CHECK'], {
    required_error: 'Quiz type is required',
  }),
  courseQuizDescription: z.string().optional(),
  isQuizTimed: z.boolean().default(false),
  courseQuizTimer: z.coerce.number().min(10, 'Timer must be at least 10 seconds').optional(),
  courseQuizPassPercent: z.coerce.number()
    .min(0, 'Pass percentage must be 0 or higher')
    .max(100, 'Pass percentage cannot exceed 100')
    .default(70),
  // Advanced settings
  allowRetry: z.boolean().default(true),
  maxRetries: z.coerce.number().min(0).max(10).default(3),
  randomizeQuestions: z.boolean().default(false),
  showResultsImmediately: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  allowReviewAfterSubmit: z.boolean().default(true),
  quizDifficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'MIXED']).default('MEDIUM'),
});

// Question schema for individual questions
const questionSchema = z.object({
  quizQuestionTitle: z.string().min(1, 'Question text is required'),
  quizQuestionType: z.enum(['MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'ESSAY'], {
    required_error: 'Question type is required',
  }),
  quizQuestionNote: z.string().optional(),
  quizQuestionOption: z.array(z.string()).min(1, 'At least one option is required'),
  quizQuestionCorrectAnswer: z.array(z.string()).min(1, 'At least one correct answer is required'),
  quizQuestionPosPoint: z.coerce.number().min(1).default(1),
  quizQuestionNegPoint: z.coerce.number().min(0).default(0),
  isQuestionTimed: z.boolean().default(false),
  quizQuestionTimer: z.coerce.number().min(5).optional(),
  difficultyLevel: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  explanation: z.string().optional(),
});

export default function QuizFields({ content, update, onManageQuestions }) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Memoize quiz and questions data
  const quiz = useMemo(() => content.courseQuiz || {}, [content.courseQuiz]);
  const questions = useMemo(() => content.quizQuestions || [], [content.quizQuestions]);
  const contentId = content.courseContent.courseContentId;

  // Prepare default values for form
  const defaultValues = useMemo(() => ({
    courseQuizType: quiz.courseQuizType || 'KNOWLEDGE CHECK',
    courseQuizDescription: quiz.courseQuizDescription || '',
    isQuizTimed: quiz.isQuizTimed || false,
    courseQuizTimer: quiz.courseQuizTimer || 300,
    courseQuizPassPercent: quiz.courseQuizPassPercent ?? 70,
    allowRetry: quiz.allowRetry ?? true,
    maxRetries: quiz.maxRetries ?? 3,
    randomizeQuestions: quiz.randomizeQuestions || false,
    showResultsImmediately: quiz.showResultsImmediately ?? true,
    showCorrectAnswers: quiz.showCorrectAnswers ?? true,
    allowReviewAfterSubmit: quiz.allowReviewAfterSubmit ?? true,
    quizDifficulty: quiz.quizDifficulty || 'MEDIUM',
  }), [quiz]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Watch form values
  const watchedValues = form.watch();

  // Update callback to sync with parent
  const updateCallback = useCallback((field, value) => {
    if (quiz[field] !== value) {
      update(contentId, field, value);
    }
  }, [contentId, update, quiz]);

  // Sync form changes with parent component
  useEffect(() => {
    const values = form.getValues();
    Object.entries(values).forEach(([field, value]) => {
      updateCallback(field, value);
    });
  }, [watchedValues, updateCallback, form]);

  // Calculate quiz statistics
  const quizStats = useMemo(() => {
    const totalPoints = questions.reduce((sum, q) => sum + (q.quizQuestionPosPoint || 1), 0);
    const avgDifficulty = questions.length > 0 
      ? questions.reduce((sum, q) => sum + getDifficultyWeight(q.difficultyLevel), 0) / questions.length
      : 0;
    
    return {
      totalQuestions: questions.length,
      totalPoints,
      avgDifficulty: getDifficultyLabel(avgDifficulty),
      estimatedTime: questions.reduce((sum, q) => 
        sum + (q.isQuestionTimed ? q.quizQuestionTimer : 30), 0
      ),
      questionTypes: [...new Set(questions.map(q => q.quizQuestionType))],
    };
  }, [questions]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        {/* Quiz Header with Stats */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
                Quiz Configuration
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {questions.length} Question{questions.length !== 1 ? 's' : ''}
                </Badge>
                <Badge 
                  variant={questions.length > 0 ? "default" : "destructive"} 
                  className="text-xs"
                >
                  {questions.length > 0 ? 'Ready' : 'Needs Questions'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Basic Quiz Settings */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="courseQuizType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Quiz Type *
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KNOWLEDGE CHECK">Knowledge Check</SelectItem>
                          <SelectItem value="CERTIFICATION">Certification</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseQuizPassPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pass Percentage (%)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        {...field} 
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quizDifficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Difficulty Level
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                          <SelectItem value="MIXED">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timer Settings */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="isQuizTimed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timed Quiz
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('isQuizTimed') && (
                <FormField
                  control={form.control}
                  name="courseQuizTimer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timer (seconds)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={10} 
                          step={10} 
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Quiz Description */}
            <FormField
              control={form.control}
              name="courseQuizDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions & Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Provide clear instructions for students taking this quiz..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advanced Settings Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="mt-4"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {/* Advanced Settings */}
            {showAdvancedSettings && (
              <Card className="mt-4 bg-gray-50/50">
                <CardHeader>
                  <CardTitle className="text-base">Advanced Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="allowRetry"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="mb-0">Allow Retries</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="randomizeQuestions"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="mb-0">Randomize Question Order</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showResultsImmediately"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="mb-0">Show Results Immediately</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showCorrectAnswers"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="mb-0">Show Correct Answers</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('allowRetry') && (
                    <FormField
                      control={form.control}
                      name="maxRetries"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-1">
                          <FormLabel>Maximum Retries</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={10} 
                              {...field}
                              className="h-9 w-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Quiz Statistics */}
        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="w-4 h-4" />
                Quiz Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{quizStats.totalQuestions}</div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{quizStats.totalPoints}</div>
                  <div className="text-xs text-gray-600">Total Points</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.floor(quizStats.estimatedTime / 60)}m</div>
                  <div className="text-xs text-gray-600">Est. Time</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{quizStats.avgDifficulty}</div>
                  <div className="text-xs text-gray-600">Difficulty</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Edit3 className="w-4 h-4" />
                Questions ({questions.length})
              </CardTitle>
              <Dialog open={showQuestionManager} onOpenChange={setShowQuestionManager}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Question Manager</DialogTitle>
                  </DialogHeader>
                  <QuestionManager 
                    questions={questions}
                    onQuestionsChange={(newQuestions) => {
                      update(contentId, 'quizQuestions', newQuestions);
                    }}
                    onClose={() => setShowQuestionManager(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm">No questions added yet.</p>
                <p className="text-xs mt-1">Click "Manage Questions" to start building your quiz.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <QuestionPreview 
                    key={question.quizQuestionId || index} 
                    question={question} 
                    index={index}
                    onEdit={() => {
                      setSelectedQuestion(question);
                      setShowQuestionManager(true);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Warnings */}
        {questions.length === 0 && (
          <div className="flex items-center gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-orange-800">
              Add at least one question before saving this quiz content.
            </p>
          </div>
        )}
      </Form>
    </div>
  );
}

// Helper functions
function getDifficultyWeight(difficulty) {
  switch (difficulty) {
    case 'EASY': return 1;
    case 'MEDIUM': return 2;
    case 'HARD': return 3;
    default: return 2;
  }
}

function getDifficultyLabel(weight) {
  if (weight <= 1.3) return 'Easy';
  if (weight <= 2.3) return 'Medium';
  return 'Hard';
}

// Question Preview Component
function QuestionPreview({ question, index, onEdit }) {
  const typeLabels = {
    'SINGLE_CHOICE': 'Single Choice',
    'MULTIPLE_CHOICE': 'Multiple Choice', 
    'TRUE_FALSE': 'True/False',
    'FILL_BLANK': 'Fill in Blank',
    'ESSAY': 'Essay'
  };

  const difficultyColors = {
    'EASY': 'bg-green-100 text-green-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800', 
    'HARD': 'bg-red-100 text-red-800'
  };

  return (
    <Card className="border-l-4 border-l-blue-200 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Q{index + 1}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {typeLabels[question.quizQuestionType] || question.quizQuestionType}
              </Badge>
              <Badge className={`text-xs ${difficultyColors[question.difficultyLevel] || difficultyColors.MEDIUM}`}>
                {question.difficultyLevel}
              </Badge>
              {question.isQuestionTimed && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {question.quizQuestionTimer}s
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium mb-1 line-clamp-2">
              {question.quizQuestionTitle}
            </p>
            {question.quizQuestionNote && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                {question.quizQuestionNote}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{question.quizQuestionOption?.length || 0} options</span>
              <span>+{question.quizQuestionPosPoint || 1} pts</span>
              {question.quizQuestionNegPoint > 0 && (
                <span className="text-red-500">-{question.quizQuestionNegPoint} pts</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="ml-4"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Question Manager Component
function QuestionManager({ questions, onQuestionsChange, onClose }) {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionsList, setQuestionsList] = useState(questions);

  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      quizQuestionTitle: '',
      quizQuestionType: 'SINGLE_CHOICE',
      quizQuestionNote: '',
      quizQuestionOption: [''],
      quizQuestionCorrectAnswer: [],
      quizQuestionPosPoint: 1,
      quizQuestionNegPoint: 0,
      isQuestionTimed: false,
      quizQuestionTimer: 30,
      difficultyLevel: 'MEDIUM',
      explanation: '',
    }
  });

  const addNewQuestion = () => {
    setEditingQuestion({
      isNew: true,
      data: questionForm.getValues()
    });
    questionForm.reset();
  };

  const editQuestion = (question, index) => {
    setEditingQuestion({
      isNew: false,
      index,
      data: question
    });
    questionForm.reset(question);
  };

  const saveQuestion = (questionData) => {
    const newQuestion = {
      ...questionData,
      quizQuestionId: editingQuestion.isNew ? Date.now() : editingQuestion.data.quizQuestionId,
      questionSequence: editingQuestion.isNew ? questionsList.length + 1 : editingQuestion.data.questionSequence
    };

    let updatedQuestions;
    if (editingQuestion.isNew) {
      updatedQuestions = [...questionsList, newQuestion];
    } else {
      updatedQuestions = questionsList.map((q, idx) => 
        idx === editingQuestion.index ? newQuestion : q
      );
    }

    setQuestionsList(updatedQuestions);
    onQuestionsChange(updatedQuestions);
    setEditingQuestion(null);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questionsList.filter((_, idx) => idx !== index);
    setQuestionsList(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  const moveQuestion = (fromIndex, toIndex) => {
    const updatedQuestions = [...questionsList];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    
    // Update sequence numbers
    updatedQuestions.forEach((q, idx) => {
      q.questionSequence = idx + 1;
    });
    
    setQuestionsList(updatedQuestions);
    onQuestionsChange(updatedQuestions);
  };

  return (
    <div className="space-y-4">
      {/* Question Manager Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Question Manager</h3>
          <p className="text-sm text-gray-600">{questionsList.length} questions</p>
        </div>
        <Button onClick={addNewQuestion} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      <Separator />

      {/* Questions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {questionsList.map((question, index) => (
          <div key={question.quizQuestionId || index} className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveQuestion(index, Math.max(0, index - 1))}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <Move className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveQuestion(index, Math.min(questionsList.length - 1, index + 1))}
                disabled={index === questionsList.length - 1}
                className="h-6 w-6 p-0"
              >
                <Move className="w-3 h-3 rotate-180" />
              </Button>
            </div>
            <div className="flex-1">
              <QuestionPreview
                question={question}
                index={index}
                onEdit={() => editQuestion(question, index)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteQuestion(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {questionsList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm">No questions yet. Click "Add Question" to get started.</p>
        </div>
      )}

      {/* Question Editor Modal */}
      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          form={questionForm}
          onSave={saveQuestion}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}

// Question Editor Component
function QuestionEditor({ question, form, onSave, onCancel }) {
  const [options, setOptions] = useState(question.data.quizQuestionOption || ['']);
  const [correctAnswers, setCorrectAnswers] = useState(question.data.quizQuestionCorrectAnswer || []);

  const questionType = form.watch('quizQuestionType');
  const isQuestionTimed = form.watch('isQuestionTimed');

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, idx) => idx !== index);
    setOptions(newOptions);
    setCorrectAnswers(correctAnswers.filter(answer => answer !== options[index]));
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    const oldValue = newOptions[index];
    newOptions[index] = value;
    setOptions(newOptions);

    // Update correct answers if this option was selected
    if (correctAnswers.includes(oldValue)) {
      setCorrectAnswers(correctAnswers.map(answer => answer === oldValue ? value : answer));
    }
  };

  const toggleCorrectAnswer = (option) => {
    if (questionType === 'SINGLE_CHOICE' || questionType === 'TRUE_FALSE') {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers(prev => 
        prev.includes(option) 
          ? prev.filter(answer => answer !== option)
          : [...prev, option]
      );
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSave({
      ...data,
      quizQuestionOption: options.filter(opt => opt.trim() !== ''),
      quizQuestionCorrectAnswer: correctAnswers
    });
  });

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question.isNew ? 'Add New Question' : 'Edit Question'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            {/* Question Type */}
            <FormField
              control={form.control}
              name="quizQuestionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                        <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                        <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                        <SelectItem value="ESSAY">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Text */}
            <FormField
              control={form.control}
              name="quizQuestionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="Enter your question here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Note */}
            <FormField
              control={form.control}
              name="quizQuestionNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Additional context or hints..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Options (for choice questions) */}
            {(questionType === 'SINGLE_CHOICE' || questionType === 'MULTIPLE_CHOICE' || questionType === 'TRUE_FALSE') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Answer Options</FormLabel>
                  {questionType !== 'TRUE_FALSE' && (
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {(questionType === 'TRUE_FALSE' ? ['True', 'False'] : options).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        checked={correctAnswers.includes(option)}
                        onCheckedChange={() => toggleCorrectAnswer(option)}
                      />
                      {questionType === 'TRUE_FALSE' ? (
                        <span className="flex-1 p-2 border rounded">{option}</span>
                      ) : (
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1"
                        />
                      )}
                      {questionType !== 'TRUE_FALSE' && options.length > 1 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeOption(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="quizQuestionPosPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points (Correct)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quizQuestionNegPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points (Incorrect)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timer Settings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="isQuestionTimed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Question Timer</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isQuestionTimed && (
                <FormField
                  control={form.control}
                  name="quizQuestionTimer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timer (seconds)</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Explanation */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="Explain the correct answer..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {question.isNew ? 'Add Question' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PropTypes
QuestionPreview.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
};

QuestionManager.propTypes = {
  questions: PropTypes.array.isRequired,
  onQuestionsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

QuestionEditor.propTypes = {
  question: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

QuizFields.propTypes = {
  content: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  onManageQuestions: PropTypes.func,
};
