/* Fullscreen sheet for adding/editing a newly created content item */
import { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { getContentTypeOptions } from './contentTypeRegistry';
import VideoFields from './fields/VideoFields';
import WrittenFields from './fields/WrittenFields';
import QuizFields from './fields/QuizFields';
import FlashcardFields from './fields/FlashcardFields';


export default function AddContentSheet({
  open,
  onClose,
  content,
  updateCourseContent,
  updateContentType,
  onSave,
  isLoading,
  formatDuration,
  updateSubtypeField
}) {
  const contentId = content?.courseContent?.courseContentId;

  const escHandler = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', escHandler);
      return () => window.removeEventListener('keydown', escHandler);
    }
  }, [open, escHandler]);

  const typeOptions = useMemo(() => getContentTypeOptions(), []);

  if (!open) return null;

  // Determine active subtype component
  const renderSubtypeFields = () => {
    if (!content) return null;
    const update = (id, field, value) => {
      // prefer dedicated subtype updater if provided else fallback
      (updateSubtypeField || updateCourseContent)(id, field, value);
    };
    switch (content.contentType) {
      case 'CourseVideo':
        return <VideoFields content={content} update={update} />;
      case 'CourseWritten':
        return <WrittenFields content={content} update={update} />;
      case 'CourseQuiz':
        return <QuizFields content={content} update={update} onManageQuestions={() => {/* placeholder open quiz manager */}} />;
      case 'CourseFlashcard':
        return <FlashcardFields content={content} update={update} onManageFlashcards={() => {/* placeholder open flashcard manager */}} />;
      default:
        return <p className="text-xs text-gray-500">Unsupported content type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Add Content Sheet">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        aria-label="Close add content sheet"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose?.(); } }}
      />
      <div className="relative flex-1 bg-white dark:bg-neutral-900 overflow-y-auto shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 backdrop-blur px-6 py-4">
          <h2 className="text-lg font-semibold">New Content Item</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
              onClick={async () => { await onSave?.(); onClose?.(); }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {!content ? (
            <p className="text-sm text-gray-500">Content not found.</p>
          ) : (
            <div className="space-y-6">
              {/* Header meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div><span className="font-medium">ID:</span> {content.courseContent.courseContentId}</div>
                <div className="flex items-center gap-1"><span className="font-medium">Type:</span> {content.contentType}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration((content.courseVideo?.duration) || (content.courseContent?.courseContentDuration) || 0)}</div>
              </div>

              {/* Core fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="content-title">Title *</Label>
                  <Input
                    id="content-title"
                    value={content.courseContent.courseContentTitle || ''}
                    onChange={(e) => updateCourseContent(contentId,'courseContentTitle', e.target.value)}
                    placeholder="Enter content title"
                  />
                </div>
                <div>
                  <Label htmlFor="content-type">Content Type *</Label>
                  <Select
                    value={content.contentType || 'CourseVideo'}
                    onValueChange={(value) => {
                      // Map to legacy newType param (choose simple tokens) until refactor
                      const legacy = value === 'CourseVideo' ? 'youtube' : value === 'CourseWritten' ? 'written' : value.toLowerCase();
                      updateContentType(contentId, legacy, value);
                    }}
                  >
                    <SelectTrigger id="content-type" className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content-category">Category</Label>
                  <Select
                    value={content.courseContent.courseContentCategory || 'Video Content'}
                    onValueChange={(value) => updateCourseContent(contentId,'courseContentCategory', value)}
                  >
                    <SelectTrigger id="content-category" className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video Content">Video Content</SelectItem>
                      <SelectItem value="Written Content">Written Content</SelectItem>
                      <SelectItem value="Interactive Content">Interactive Content</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                      <SelectItem value="Practice">Practice</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content-duration">Estimated Duration (sec)</Label>
                  <Input
                    id="content-duration"
                    type="number"
                    min={0}
                    value={content.courseContent.courseContentDuration || 0}
                    onChange={(e) => updateCourseContent(contentId,'courseContentDuration', parseInt(e.target.value)||0)}
                  />
                </div>
              </div>

              {/* Subtype specific fields */}
              <div className="border rounded-md p-4 bg-neutral-50 dark:bg-neutral-800/40">
                {renderSubtypeFields()}
              </div>

              {/* Publication / flags */}
              <div className="flex flex-wrap gap-6 text-xs pt-2">
                <Checkbox
                  label="Active / Published"
                  checked={content.courseContent.isActive || false}
                  onChange={(val) => updateCourseContent(contentId,'isActive', val)}
                />
                {content.contentType === 'CourseVideo' && (
                  <Checkbox
                    label="Preview Available"
                    checked={content.courseVideo?.isPreview || false}
                    onChange={(val) => updateCourseContent(contentId,'isPreview', val)}
                  />
                )}
                <Checkbox
                  label="Licensed Content"
                  checked={content.courseContent.coursecontentIsLicensed || false}
                  onChange={(val) => updateCourseContent(contentId,'coursecontentIsLicensed', val)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AddContentSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.object, // shape varies by content type
  updateCourseContent: PropTypes.func.isRequired,
  updateContentType: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  isLoading: PropTypes.bool,
  formatDuration: PropTypes.func.isRequired,
  updateSubtypeField: PropTypes.func
};

// Reusable label & checkbox helpers (local to this file for brevity)
function Label({ children, htmlFor }) {
  return <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-600 mb-1">{children}</label>;
}
Label.propTypes = { children: PropTypes.node, htmlFor: PropTypes.string };

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
Checkbox.propTypes = { label: PropTypes.node, checked: PropTypes.bool, onChange: PropTypes.func };
