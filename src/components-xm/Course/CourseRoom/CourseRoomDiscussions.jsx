import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { MessageSquare, Send, Reply, Heart, MoreVertical, Trash2, Edit3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

function CourseRoomDiscussions() {
  const [newDiscussion, setNewDiscussion] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState(null);

  // Mock data for discussions - replace with real data
  const discussions = [
    {
      id: 1,
      author: {
        name: "John Doe",
        avatar: null,
        role: "Member"
      },
      content: "Has anyone else found the third module challenging? I'm struggling with the advanced concepts.",
      timestamp: "2 hours ago",
      likes: 3,
      replies: [
        {
          id: 1,
          author: {
            name: "Jane Smith",
            avatar: null,
            role: "Moderator"
          },
          content: "I found it helpful to review the prerequisites before diving into module 3. Also, the practice exercises really help solidify the concepts.",
          timestamp: "1 hour ago",
          likes: 2
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Alice Johnson",
        avatar: null,
        role: "Member"
      },
      content: "Great course so far! The video explanations are very clear and easy to follow.",
      timestamp: "1 day ago",
      likes: 5,
      replies: []
    }
  ];

  const handleSubmitDiscussion = () => {
    if (newDiscussion.trim()) {
      // Handle new discussion submission
      console.log("New discussion:", newDiscussion);
      setNewDiscussion("");
    }
  };

  const handleSubmitReply = (discussionId) => {
    if (replyText.trim()) {
      // Handle reply submission
      console.log("Reply to", discussionId, ":", replyText);
      setReplyText("");
      setActiveReply(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Owner":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "Moderator":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* New Discussion Form */}
      <Card className="border-0 bg-white shadow-sm rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Start a Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What would you like to discuss with your fellow learners?"
            rows={4}
            value={newDiscussion}
            onChange={(e) => setNewDiscussion(e.target.value)}
            className="w-full resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitDiscussion}
              disabled={!newDiscussion.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Post Discussion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card className="border-0 bg-white shadow-sm rounded-sm">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No discussions yet
              </h3>
              <p className="text-gray-500">
                Be the first to start a discussion with your fellow learners!
              </p>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} className="border-0 bg-white shadow-sm rounded-sm">
              <CardContent className="p-6">
                {/* Discussion Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {discussion.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{discussion.author.name}</h4>
                        <Badge className={`${getRoleColor(discussion.author.role)} border text-xs`}>
                          {discussion.author.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {discussion.timestamp}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Discussion Content */}
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed">{discussion.content}</p>
                </div>

                {/* Discussion Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                    <Heart className="h-4 w-4" />
                    {discussion.likes} {discussion.likes === 1 ? 'Like' : 'Likes'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    onClick={() => setActiveReply(activeReply === discussion.id ? null : discussion.id)}
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </Button>
                  {discussion.replies.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {discussion.replies.length} {discussion.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>

                {/* Reply Form */}
                {activeReply === discussion.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Write your reply..."
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full resize-none bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActiveReply(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitReply(discussion.id)}
                          disabled={!replyText.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {discussion.replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="ml-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                {reply.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-gray-900">{reply.author.name}</h5>
                                <Badge className={`${getRoleColor(reply.author.role)} border text-xs`}>
                                  {reply.author.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {reply.timestamp}
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 cursor-pointer">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-gray-800 text-sm leading-relaxed mb-2">{reply.content}</p>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                            <Heart className="h-3 w-3" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseRoomDiscussions;