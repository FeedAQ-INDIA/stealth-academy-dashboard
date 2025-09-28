import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Video subtype specific fields
export default function VideoFields({ content, update }) {
  const video = content.courseVideo || {};
  const contentId = content.courseContent.courseContentId;

  const onChange = (field, value) => update(contentId, field, value);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="video-url">Video URL *</Label>
          <Input
            id="video-url"
            value={video.courseVideoUrl || ''}
            onChange={e => onChange('courseVideoUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="video-duration">Duration (sec) *</Label>
          <Input
            id="video-duration"
            type="number"
            min={0}
            value={video.duration || 0}
            onChange={e => onChange('duration', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="video-thumb">Thumbnail URL</Label>
          <Input
            id="video-thumb"
            value={video.thumbnailUrl || ''}
            onChange={e => onChange('thumbnailUrl', e.target.value)}
            placeholder="https://.../thumb.jpg"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="video-preview"
            type="checkbox"
            checked={video.isPreview || false}
            onChange={e => onChange('isPreview', e.target.checked)}
          />
          <Label inline htmlFor="video-preview">Preview Available</Label>
        </div>
      </div>
      <div>
        <Label htmlFor="video-desc">Description</Label>
        <Textarea
          id="video-desc"
          rows={4}
            value={video.courseVideoDescription || ''}
            onChange={e => onChange('courseVideoDescription', e.target.value)}
            placeholder="Describe this video lesson..."
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

VideoFields.propTypes = {
  content: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};
