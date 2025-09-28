import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Video, FileText, HelpCircle, BookOpen } from "lucide-react";
import { CONTENT_TYPES } from "./contentTypeRegistry";

const CONTENT_TYPE_ICONS = {
  CourseVideo: Video,
  CourseWritten: FileText,
  CourseQuiz: HelpCircle,
  CourseFlashcard: BookOpen,
};

export default function ContentTypeSelector({ onSelectType, disabled = false }) {
  const [open, setOpen] = useState(false);

  const handleSelectType = (contentType) => {
    setOpen(false);
    onSelectType?.(contentType);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(CONTENT_TYPES).map(([contentType, config]) => {
          const IconComponent = CONTENT_TYPE_ICONS[contentType];
          return (
            <DropdownMenuItem
              key={contentType}
              onClick={() => handleSelectType(contentType)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <IconComponent className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="font-medium text-sm">{config.label}</div>
                <div className="text-xs text-gray-500">{config.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
