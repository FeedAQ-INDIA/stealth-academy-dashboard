import {
  Card,
  CardContent,
} from "@/components/ui/card.jsx";
import { BookOpen, Download, FileText, Video, ExternalLink, Search, Filter, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useState } from "react";

function CourseRoomResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Mock data for resources - replace with real data
  const resources = [
    {
      id: 1,
      title: "Course Syllabus",
      description: "Complete course outline and learning objectives",
      type: "PDF",
      size: "1.2 MB",
      uploadedBy: "Instructor",
      uploadedAt: "2024-01-15",
      downloads: 45,
      url: "#"
    },
    {
      id: 2,
      title: "Supplementary Reading Materials",
      description: "Additional articles and research papers",
      type: "Document",
      size: "3.5 MB",
      uploadedBy: "Instructor",
      uploadedAt: "2024-01-10",
      downloads: 32,
      url: "#"
    },
    {
      id: 3,
      title: "Practice Exercises Solutions",
      description: "Step-by-step solutions for all practice problems",
      type: "PDF",
      size: "2.1 MB",
      uploadedBy: "TA Assistant",
      uploadedAt: "2024-01-08",
      downloads: 28,
      url: "#"
    },
    {
      id: 4,
      title: "Video Lecture Slides",
      description: "Presentation slides from video lectures",
      type: "PowerPoint",
      size: "15.2 MB",
      uploadedBy: "Instructor",
      uploadedAt: "2024-01-05",
      downloads: 67,
      url: "#"
    },
    {
      id: 5,
      title: "External Learning Resources",
      description: "Curated list of helpful external websites and tools",
      type: "Link",
      size: "N/A",
      uploadedBy: "Community",
      uploadedAt: "2024-01-03",
      downloads: 15,
      url: "https://example.com"
    }
  ];

  const resourceTypes = ["ALL", "PDF", "Document", "PowerPoint", "Video", "Link"];

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF":
        return FileText;
      case "Video":
        return Video;
      case "Link":
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "PDF":
        return "text-red-600 bg-red-100 border-red-200";
      case "Video":
        return "text-purple-600 bg-purple-100 border-purple-200";
      case "Link":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "PowerPoint":
        return "text-orange-600 bg-orange-100 border-orange-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Course Resources</h2>
          <p className="text-gray-600">Access and download course materials and resources</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Resource
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === "ALL" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.length === 0 ? (
          <Card className="border-0 bg-white shadow-sm rounded-sm">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || filterType !== "ALL" ? "No resources match your search" : "No resources available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "ALL" 
                  ? "Try adjusting your search terms or filters"
                  : "Course resources will be available here once uploaded"
                }
              </p>
              {searchTerm || filterType !== "ALL" ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("ALL");
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Resource
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              
              return (
                <Card key={resource.id} className="border-0 bg-white shadow-sm rounded-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Resource Icon */}
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TypeIcon className="h-6 w-6 text-blue-600" />
                        </div>

                        {/* Resource Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                            <Badge className={`${getTypeColor(resource.type)} border text-xs`}>
                              {resource.type}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Uploaded by {resource.uploadedBy}</span>
                            <span>•</span>
                            <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                            <span>•</span>
                            <span>{resource.downloads} downloads</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 ml-4">
                        {resource.type === "Link" ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => {
                              // Handle download
                              console.log("Download", resource.title);
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Resource Statistics */}
      {filteredResources.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {filteredResources.length} of {resources.length} resources
              </span>
              <span className="text-gray-600">
                Total downloads: {resources.reduce((sum, r) => sum + r.downloads, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CourseRoomResources;