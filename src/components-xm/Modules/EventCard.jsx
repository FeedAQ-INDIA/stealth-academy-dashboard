import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2, Loader2, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axiosConn from "@/axioscon";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  learningItemType: z
    .enum(["COURSE", "VIDEO", "ARTICLE", "QUIZ", "PRACTICE"])
    .nullish(),
  scheduledStartDate: z.string().min(1, "Start date is required"),
  scheduledEndDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
  scheduledLink: z.string().url().optional().or(z.literal("")),
});

// Convert an ISO date string to datetime-local format
const isoToDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

// Convert datetime-local format to ISO string
const dateTimeLocalToIso = (localValue) => {
  if (!localValue) return "";
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
};

const formatEventTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};

const formatEventDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day
  if (start.toDateString() === end.toDateString()) {
    return `${start.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    })} • ${formatEventTime(start)} - ${formatEventTime(end)}`;
  }
  
  // Different days
  return `${start.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  })} ${formatEventTime(start)} - ${end.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  })} ${formatEventTime(end)}`;
};

const EventCard = ({ 
  event, 
  onJoinLink,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      learningItemType: undefined,
      description: "",
      scheduledLink: "",
      scheduledStartDate: "",
      scheduledEndDate: "",
    },
  });

  // Handle edit schedule
  const handleEditSchedule = () => {
    setIsEditOpen(true);
    
    form.reset({
      title: event.title,
      learningItemType: event.learningItemType,
      description: event.description || "",
      scheduledLink: event.scheduledLink || "",
      scheduledStartDate: isoToDateTimeLocal(event.scheduledStartDate),
      scheduledEndDate: isoToDateTimeLocal(event.scheduledEndDate),
    });
  };

  // Handle form submission for editing
  const onSubmit = async (values) => {
    try {
      setIsEditing(true);
      
      const response = await axiosConn.post(`/schedule/update`, {
        userLearningScheduleId: event.userLearningScheduleId,
        title: values.title,
        learningItemType: values.learningItemType,
        description: values.description,
        scheduledLink: values.scheduledLink,
        scheduledStartDate: dateTimeLocalToIso(values.scheduledStartDate),
        scheduledEndDate: dateTimeLocalToIso(values.scheduledEndDate),
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        });
        
        // Reset form and close dialog
        form.reset();
        setIsEditOpen(false);
        
        // Refresh the schedules
        if (onRefresh) {
          onRefresh();
        }
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Schedule update failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update schedule",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async () => {
    try {
      setIsDeleting(true);
      const response = await axiosConn.post("/schedule/delete", {
        userLearningScheduleId: event.userLearningScheduleId,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Schedule deleted successfully",
        });
        
        setIsDeleteDialogOpen(false);
        
        // Refresh the schedules
        if (onRefresh) {
          onRefresh();
        }
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete schedule failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to delete schedule",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
    <Card className="relative overflow-hidden rounded-sm">
      {/* Compact gradient accent */}
      {/* <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 via-purple-500 to-indigo-500" /> */}
              <div
          className={`absolute top-0 left-0 w-1 h-full  bg-blue-500`}
        />
      {/* Subtle background pattern */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      
      <div className="p-3 relative z-10">
        <CardHeader className="p-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800 group-hover:text-violet-800 transition-colors">
                {event.title}
                {event.overlappingCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                    {event.overlappingCount}
                  </span>
                )}
              </CardTitle>
              
              <div className="space-y-1.5 mt-1.5">
                {/* Ultra Compact Event Header */}
                <div className="flex items-center justify-between text-xs text-gray-600 bg-violet-50 rounded p-1.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-violet-600" />
                    <span className="font-medium text-gray-700 text-xs">
                      {formatEventDateRange(event.scheduledStartDate, event.scheduledEndDate)}
                    </span>
                  </div>
                  {event.learningItemType && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-purple-600" />
                      <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-medium text-xs">
                        {event.learningItemType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ultra Compact Event Description */}
                {event.description && (
                  <div className="bg-gray-50 rounded p-1.5">
                    <p className="text-gray-700 text-xs leading-tight line-clamp-1">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {event.overlappingCount > 0 && (
          <div className="mt-2">
            <details className="group/details">
              <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors">
                <span className="flex items-center gap-1">
                  <span className="text-sm">⚠️</span>
                  <span>{event.overlappingCount} conflict{event.overlappingCount > 1 ? 's' : ''}</span>
                </span>
                <svg className="w-3 h-3 transition-transform group-open/details:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-1.5 space-y-1 border-l-2 border-amber-200 pl-2">
                {event.overlappingMeetings.map(overlap => (
                  <div key={overlap.id} className="text-xs bg-amber-50 rounded p-1.5 border border-amber-100">
                    <div className="font-medium text-amber-800 truncate text-xs">{overlap.title}</div>
                    <div className="text-amber-600 font-mono text-xs">
                      {formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        <CardFooter className="p-0 pt-2">
          <div className="flex justify-end space-x-1 w-full">
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-xs border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
              onClick={() => setIsDetailsOpen(true)}
              title="View Details"
            >
              <BookOpen className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              onClick={handleEditSchedule}
              title="Edit Schedule"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete Schedule"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            {event.scheduledLink && (
              <Button
                size="xs"
                className="h-6 px-2 text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => onJoinLink(event.scheduledLink)}
              >
                Join
              </Button>
            )}
          </div>
        </CardFooter>
      </div>
    </Card>

      {/* Event Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="text-xl font-semibold">Event Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto mt-6">
            <div className="space-y-6 pr-4">
            {/* Title and Type Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              {event.learningItemType && (
                <div className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-800 text-sm font-medium rounded-full">
                  {event.learningItemType}
                </div>
              )}
            </div>

            {/* Time Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Start</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.scheduledStartDate).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">End</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.scheduledEndDate).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {event.description && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            )}

            {/* Link Section */}
            {event.scheduledLink && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Learning Resource</h4>
                <Button 
                  className="w-full"
                  onClick={() => window.open(event.scheduledLink, "_blank")}
                >
                  Join Learning Session
                </Button>
              </div>
            )}

            {/* Conflicts Section */}
            {event.overlappingCount > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Scheduling Conflicts ({event.overlappingCount})
                </h4>
                <div className="space-y-2">
                  {event.overlappingMeetings?.map(overlap => (
                    <div key={overlap.id} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="font-medium text-sm">{overlap.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Additional Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">
                    {event.v_created_date} {event.v_created_time}
                  </span>
                </div>
                {event.updatedAt && (
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {event.v_updated_date} {event.v_updated_time}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  handleEditSchedule();
                  setIsDetailsOpen(false);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Schedule
              </Button>
            </SheetFooter>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Schedule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">"{event.title}"</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchedule}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Schedule Sheet */}
      <Sheet open={isEditOpen} onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setIsEditOpen(open);
      }}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Learning Schedule
            </SheetTitle>
            <SheetDescription>
              Update your learning schedule details.
            </SheetDescription>
          </SheetHeader>
          <Form {...form} className="flex-1 flex flex-col ">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex-1 overflow-y-auto py-4 px-2"
            >
              {event.overlappingCount > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800 font-medium mb-2 text-sm">
                    <span>⚠️</span>
                    <span>{event.overlappingCount} Scheduling Conflict{event.overlappingCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {event.overlappingMeetings?.map(overlap => (
                      <div key={overlap.id} className="text-sm bg-white rounded p-2 border border-amber-100">
                        <div className="font-medium text-gray-700 truncate">{overlap.title}</div>
                        <div className="text-amber-700 text-xs">
                          {formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter event title..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="learningItemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select learning type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="COURSE">Course</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="ARTICLE">Article</SelectItem>
                        <SelectItem value="QUIZ">Quiz</SelectItem>
                        <SelectItem value="PRACTICE">Practice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scheduledEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="scheduledLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/learning-resource"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Add a description for your learning session..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EventCard;
