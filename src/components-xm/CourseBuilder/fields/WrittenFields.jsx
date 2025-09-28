import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function WrittenFields({ content, update }) {
  const written = content.courseWritten || {};
  const contentId = content.courseContent.courseContentId;
  const onChange = (field, value) => update(contentId, field, value);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="written-title">Written Title</Label>
          <Input
            id="written-title"
            value={written.courseWrittenTitle || content.courseContent.courseContentTitle || ''}
            onChange={e => onChange('courseWrittenTitle', e.target.value)}
            placeholder="(Optional override)"
          />
        </div>
        <div>
          <Label htmlFor="written-embed-url">Embed URL</Label>
          <Input
            id="written-embed-url"
            value={written.courseWrittenEmbedUrl || ''}
            onChange={e => onChange('courseWrittenEmbedUrl', e.target.value)}
            placeholder="https://..."
          />
          <div className="flex items-center gap-2 mt-2 text-xs">
            <input
              id="written-embeddable"
              type="checkbox"
              checked={written.courseWrittenUrlIsEmbeddable || false}
              onChange={e => onChange('courseWrittenUrlIsEmbeddable', e.target.checked)}
            />
            <Label inline htmlFor="written-embeddable">URL is embeddable</Label>
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="written-desc">Description</Label>
        <Textarea
          id="written-desc"
          rows={3}
          value={written.courseWrittenDescription || ''}
          onChange={e => onChange('courseWrittenDescription', e.target.value)}
          placeholder="Short description..."
        />
      </div>
      <div>
        <Label htmlFor="written-content">Content *</Label>
        <Textarea
          id="written-content"
          rows={8}
          value={written.courseWrittenContent || ''}
          onChange={e => onChange('courseWrittenContent', e.target.value)}
          placeholder="Markdown / text body..."
        />
      </div>
    </div>
  );
}

function Label({ children, htmlFor, inline }) {
  return (
    <label htmlFor={htmlFor} className={`block text-xs font-medium text-gray-600 mb-1 ${inline ? 'mb-0' : ''}`}>{children}</label>
  );
}
Label.propTypes = { children: PropTypes.node, htmlFor: PropTypes.string, inline: PropTypes.bool };

WrittenFields.propTypes = {
  content: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};
