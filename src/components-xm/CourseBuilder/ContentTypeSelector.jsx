import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Video, FileText, HelpCircle, BookOpen, Download, Youtube } from "lucide-react";
import { CONTENT_TYPES } from "./contentTypeRegistry";

const CONTENT_TYPE_ICONS = {
  CourseVideo: Video,
  CourseWritten: FileText,
  CourseQuiz: HelpCircle,
  CourseFlashcard: BookOpen,
};

export default function ContentTypeSelector({ onSelectType, onImportYoutube, disabled = false }) {
  const [open, setOpen] = useState(false);

  const handleSelectType = (contentType) => {
    setOpen(false);
    onSelectType?.(contentType);
  };

  const handleImportYoutube = () => {
    setOpen(false);
    onImportYoutube?.();
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
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer">
            <Download className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-sm">Import Videos</div>
              <div className="text-xs text-gray-500">Import from external sources</div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={handleImportYoutube}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Youtube className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <div className="font-medium text-sm">YouTube Playlist</div>
                <div className="text-xs text-gray-500">Import entire playlist</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
