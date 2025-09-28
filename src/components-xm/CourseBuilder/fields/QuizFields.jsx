import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function QuizFields({ content, update, onManageQuestions }) {
  const quiz = content.courseQuiz || {};
  const contentId = content.courseContent.courseContentId;
  const onChange = (field, value) => update(contentId, field, value);

  const questions = content.quizQuestions || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="quiz-type">Quiz Type *</Label>
          <Select
            value={quiz.courseQuizType || 'KNOWLEDGE CHECK'}
            onValueChange={val => onChange('courseQuizType', val)}
          >
            <SelectTrigger id="quiz-type" className="text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="KNOWLEDGE CHECK">Knowledge Check</SelectItem>
              <SelectItem value="CERTIFICATION">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="quiz-timed"
            type="checkbox"
            checked={quiz.isQuizTimed || false}
            onChange={e => onChange('isQuizTimed', e.target.checked)}
          />
          <Label inline htmlFor="quiz-timed">Timed Quiz</Label>
        </div>
        {quiz.isQuizTimed && (
          <div>
            <Label htmlFor="quiz-timer">Timer (sec)</Label>
            <Input
              id="quiz-timer"
              type="number"
              min={10}
              step={10}
              value={quiz.courseQuizTimer || ''}
              onChange={e => onChange('courseQuizTimer', parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="quiz-pass">Pass Percent (%)</Label>
          <Input
            id="quiz-pass"
            type="number"
            min={0}
            max={100}
            value={quiz.courseQuizPassPercent ?? 70}
            onChange={e => onChange('courseQuizPassPercent', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="sm:col-span-2 flex items-end">
          <button
            type="button"
            onClick={onManageQuestions}
            className="text-xs px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Manage Questions ({questions.length})
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="quiz-desc">Description</Label>
        <Textarea
          id="quiz-desc"
          rows={3}
          value={quiz.courseQuizDescription || ''}
          onChange={e => onChange('courseQuizDescription', e.target.value)}
          placeholder="Describe scope / instructions..."
        />
      </div>
      <p className="text-[10px] text-gray-500">Ensure at least one question before saving quiz content.</p>
    </div>
  );
}

function Label({ children, htmlFor, inline }) {
  return (
    <label htmlFor={htmlFor} className={`block text-xs font-medium text-gray-600 mb-1 ${inline ? 'mb-0' : ''}`}>{children}</label>
  );
}
Label.propTypes = { children: PropTypes.node, htmlFor: PropTypes.string, inline: PropTypes.bool };

QuizFields.propTypes = {
  content: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  onManageQuestions: PropTypes.func
};
