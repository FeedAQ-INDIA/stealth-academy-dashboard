import VideoContentCreator from "./VideoContentCreator";
import WrittenContentCreator from "./WrittenContentCreator";
import QuizContentCreator from "./QuizContentCreator";
import FlashcardContentCreator from "./FlashcardContentCreator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTENT_CREATORS = {
  CourseVideo: VideoContentCreator,
  CourseWritten: WrittenContentCreator,
  CourseQuiz: QuizContentCreator,
  CourseFlashcard: FlashcardContentCreator,
};

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (e) {
    return (
      <Alert variant="destructive" className="mx-4 my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Failed to render creator: {e.message}
        </AlertDescription>
      </Alert>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ContentCreator({
  contentType,
  onAdd,
  onUpdate,
  onCancel,
  isLoading = false,
  courseContentSequence = 1,
  mode = "create",
  existingContent = null,
}) {
  const CreatorComponent = CONTENT_CREATORS[contentType];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!CreatorComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Creator Not Available
              </h3>
              <p className="text-sm text-gray-600">
                Content creator for &quot;{contentType}&quot; is not available yet.
              </p>
            </div>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
              aria-label={`Go back from ${contentType} creator`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full" role="main" aria-label="Content creator interface">
      <ErrorBoundary>
        <CreatorComponent
          // Creation props
          onAdd={onAdd}
          // Edit props
          onUpdate={onUpdate}
          existingContent={existingContent}
          mode={mode}
          // Common
          onCancel={onCancel}
          isLoading={isLoading}
          courseContentSequence={courseContentSequence}
        />
      </ErrorBoundary>
    </div>
  );
}
