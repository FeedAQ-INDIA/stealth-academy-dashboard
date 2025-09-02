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
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-500" />
      
      <div className="p-4">
        <CardHeader className="p-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {event.title}
                {event.overlappingCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    {event.overlappingCount} overlap{event.overlappingCount > 1 ? 's' : ''}
                  </span>
                )}
              </CardTitle>
              
              <div className="space-y-2 mt-2">
                {/* Event Header */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3 text-violet-500" />
                  <span className="font-medium">
                    {formatEventDateRange(event.scheduledStartDate, event.scheduledEndDate)}
                  </span>
                  {event.learningItemType && (
                    <>
                      <Clock className="h-3 w-3 text-violet-500 ml-1" />
                      <span>{event.learningItemType}</span>
                    </>
                  )}
                </div>

                <Separator />

                {/* Event Description */}
                {event.description && (
                  <div className="mb-2">
                    <p className="text-black leading-snug whitespace-pre-wrap break-words text-sm">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {event.overlappingCount > 0 && (
          <div className="mt-2 text-xs bg-yellow-50 rounded p-2">
            <div className="font-medium text-yellow-800 mb-1">Overlapping with:</div>
            <ul className="list-disc list-inside space-y-1">
              {event.overlappingMeetings.map(overlap => (
                <li key={overlap.id} className="text-gray-600">
                  {overlap.title} ({formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)})
                </li>
              ))}
            </ul>
          </div>
        )}

        <CardFooter className="p-0 pt-3">
          <div className="flex justify-end space-x-1 w-full">
            <Button
              variant="outline"
              size="xs"
              className="h-7 px-3 text-xs"
              onClick={() => setIsDetailsOpen(true)}
              title="View Details"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Details
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="h-7 px-3 text-xs"
              onClick={handleEditSchedule}
              title="Edit Schedule"
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="xs"
              className="h-7 px-3 text-xs"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete Schedule"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
            {event.scheduledLink && (
              <Button
                size="xs"
                variant="outline"
                className="h-7 px-3 text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-violet-600"
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Title and Type Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <div className="text-sm font-medium text-primary">
                {event.learningItemType}
              </div>
            </div>

            {/* Time Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(event.scheduledStartDate).toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="font-medium">End:</span>{" "}
                  {new Date(event.scheduledEndDate).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Description Section */}
            {event.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <div className="rounded-lg border p-4">
                  <p className="text-sm">{event.description}</p>
                </div>
              </div>
            )}

            {/* Link Section */}
            {event.scheduledLink && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Learning Resource</h4>
                <div className="rounded-lg border p-4">
                  <Button 
                    className="w-full"
                    onClick={() => window.open(event.scheduledLink, "_blank")}
                  >
                    Join Learning Session
                  </Button>
                </div>
              </div>
            )}

            {/* Conflicts Section */}
            {event.overlappingCount > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-800">
                  Scheduling Conflicts ({event.overlappingCount})
                </h4>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <ul className="space-y-2">
                    {event.overlappingMeetings?.map(overlap => (
                      <li key={overlap.id} className="text-sm">
                        <span className="font-medium">{overlap.title}</span>
                        <br />
                        <span className="text-muted-foreground">
                          {formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Metadata Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Additional Information</h4>
              <div className="rounded-lg border p-4 space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Created:</span>{" "}
                  {event.v_created_date} {event.v_created_time}
                </div>
                {event.updatedAt && (
                  <div className="text-sm">
                    <span className="font-medium">Last Updated:</span>{" "}
                    {event.v_updated_date} {event.v_updated_time}
                  </div>
                )}
              </div>
            </div>

            <SheetFooter>
              <Button
                variant="outline"
                onClick={() => {
                  handleEditSchedule();
                  setIsDetailsOpen(false);
                }}
              >
                Edit Schedule
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-800">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Schedule
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-700/80">
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchedule}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Forever"
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
        <SheetContent className="h-full flex flex-col bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-xl text-violet-800">
              <Pencil className="h-5 w-5 text-violet-600" />
              Edit Learning Schedule
            </SheetTitle>
            <SheetDescription className="text-violet-600/70">
              Update your existing learning schedule.
            </SheetDescription>
          </SheetHeader>
          <Form {...form} className="flex-1 flex flex-col h-full">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex-1 overflow-y-auto px-2"
            >
              {event.overlappingCount > 0 && (
                <div className="bg-yellow-50 p-2 rounded mt-2">
                  <div className="text-yellow-800 font-medium mb-1">
                    {event.overlappingCount} Scheduling Conflict{event.overlappingCount > 1 ? 's' : ''}
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {event.overlappingMeetings?.map(overlap => (
                      <li key={overlap.id} className="text-gray-600">
                        {overlap.title} ({formatEventTime(overlap.scheduledStartDate)} - {formatEventTime(overlap.scheduledEndDate)})
                      </li>
                    ))}
                  </ul>
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
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
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
                          <SelectValue placeholder="Select type" />
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
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
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
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://..."
                        {...field}
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
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
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sticky bottom-0 bg-background pt-4">
                <SheetFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className="border-violet-200 text-violet-600 hover:bg-violet-50"
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isEditing}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
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
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EventCard;
