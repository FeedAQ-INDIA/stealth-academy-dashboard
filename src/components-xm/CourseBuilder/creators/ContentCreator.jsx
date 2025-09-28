import VideoContentCreator from "./VideoContentCreator";
import WrittenContentCreator from "./WrittenContentCreator";
import QuizContentCreator from "./QuizContentCreator";
import FlashcardContentCreator from "./FlashcardContentCreator";

const CONTENT_CREATORS = {
  CourseVideo: VideoContentCreator,
  CourseWritten: WrittenContentCreator,
  CourseQuiz: QuizContentCreator,
  CourseFlashcard: FlashcardContentCreator,
};

export default function ContentCreator({
  contentType,
  onAdd,
  onCancel,
  isLoading = false,
}) {
  const CreatorComponent = CONTENT_CREATORS[contentType];

  if (!CreatorComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">
          Content creator for "{contentType}" is not available yet.
        </p>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full px-2">
      <CreatorComponent
        onAdd={onAdd}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
