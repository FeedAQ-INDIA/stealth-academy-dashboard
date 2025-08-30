import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "@/axioscon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const formatEventTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};

// Convert an ISO date string (eg. 2025-08-28T19:27:00.000Z) to a
// value compatible with <input type="datetime-local"> which expects
// "yyyy-MM-ddTHH:mm" (no timezone). This produces a local datetime string.
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
  // return without seconds to match the simple required format
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

// Convert a local datetime-local input value back to an ISO string
// suitable for sending to the backend. The input value is treated as
// local time by the Date constructor, so toISOString() yields the
// correct UTC representation.
const dateTimeLocalToIso = (localValue) => {
  if (!localValue) return "";
  const d = new Date(localValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
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

export default function MyLearningSchedule() {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Fetch schedules for the selected date
  const fetchSchedules = async (selectedDate) => {
    try {
      setLoading(true);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await axiosConn.post("/schedule/search", {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      });

      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schedules. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit schedule
  const handleEditSchedule = (event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setIsDialogOpen(true);
    
    form.reset({
      title: event.title,
      learningItemType: event.learningItemType,
      description: event.description || "",
  scheduledLink: event.scheduledLink || "",
  // convert ISO -> datetime-local
  scheduledStartDate: isoToDateTimeLocal(event.scheduledStartDate),
  scheduledEndDate: isoToDateTimeLocal(event.scheduledEndDate),
    });
  };

  // Create or update schedule
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      
      let response;
      if (isEditMode) {
        // Update existing schedule
        response = await axiosConn.post(`/schedule/update`, {
          userLearningScheduleId: selectedEvent.userLearningScheduleId,
          title: values.title,
          learningItemType: values.learningItemType,
          description: values.description,
          scheduledLink: values.scheduledLink,
          // convert datetime-local -> ISO
          scheduledStartDate: dateTimeLocalToIso(values.scheduledStartDate),
          scheduledEndDate: dateTimeLocalToIso(values.scheduledEndDate),
        });
      } else {
        // Create new schedule
        // ensure the create payload uses ISO datetimes
        const payload = {
          ...values,
          scheduledStartDate: dateTimeLocalToIso(values.scheduledStartDate),
          scheduledEndDate: dateTimeLocalToIso(values.scheduledEndDate),
        };
        response = await axiosConn.post("/schedule/create", payload);
      }

      if (response.data.success) {
        toast({
          title: "Success",
          description: `Schedule ${isEditMode ? "updated" : "created"} successfully`,
        });
        
        // Clear form and reset state
        form.reset({
          title: "",
          learningItemType: undefined,
          description: "",
          scheduledLink: "",
          scheduledStartDate: "",
          scheduledEndDate: "",
        });
        
        // Reset all state
        setIsDialogOpen(false);
        setIsEditMode(false);
        setSelectedEvent(null);
        
        // Refresh the schedules
        fetchSchedules(date);
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Schedule operation failed:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to process schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchSchedules(newDate);
  };

  // Initial fetch
  useEffect(() => {
    fetchSchedules(date);
  }, []);

  return (
    // <Card className="border-2 border-dashed border-gray-200">
    //   <CardContent className="text-center py-16">

    //     <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
    //       <BookOpen className="w-10 h-10 text-orange-500" />
    //     </div>
    //     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    //       No Learning Schedule Yet
    //     </h3>
    //     <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
    //       You haven’t created a learning schedule yet. Learn how to create your own to start organizing your study sessions.

    //     </p>
    //   </CardContent>
    // </Card>

    <Card className="min-h-[600px]">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar Section */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="bg-transparent p-0 flex-1/2"
            required
          />
          {/* Event Section */}
          <div className="flex flex-col items-start gap-3 flex-1">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm font-medium">
                {date?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Sheet 
                open={isDialogOpen} 
                onOpenChange={(open) => {
                  if (!open) {
                    // Reset form and state when dialog is closed
                    form.reset({
                      title: "",
                      learningItemType: undefined,
                      description: "",
                      scheduledLink: "",
                      scheduledStartDate: "",
                      scheduledEndDate: "",
                    });
                    setIsEditMode(false);
                    setSelectedEvent(null);
                  }
                  setIsDialogOpen(open);
                }}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    title="Add Event"
                  >
                    <PlusIcon />
                    <span className="sr-only">Add Event</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="h-full flex flex-col">
                  <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit Learning Schedule" : "Add New Learning Schedule"}</SheetTitle>
                    <SheetDescription>
                      {isEditMode ? "Update your existing learning schedule." : "Create a new learning schedule for your selected date."}
                    </SheetDescription>
                  </SheetHeader>
                  <Form {...form} className="flex-1 flex flex-col h-full">
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4 flex-1 overflow-y-auto  px-2"
                    >
                      {" "}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                                <SelectItem value="PRACTICE">
                                  Practice
                                </SelectItem>
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
                              <Input type="datetime-local" {...field} />
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
                              <Input type="datetime-local" {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
      
                      <div className="sticky bottom-0 bg-background pt-4">
                        <SheetFooter className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEditMode ? "Updating..." : "Creating..."}
                              </>
                            ) : (
                              isEditMode ? "Update Schedule" : "Create Schedule"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </SheetFooter>
                      </div>
                    </form>
                  </Form>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex w-full flex-col gap-2 overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="text-center py-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      No schedules for this date
                    </p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <div
                    key={event.userLearningScheduleId}
                    className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatEventDateRange(event.scheduledStartDate, event.scheduledEndDate)}
                      </div>
                      {event.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="size-8 p-0"
                        onClick={() => handleEditSchedule(event)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Schedule</span>
                      </Button>
                      {event.scheduledLink && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(event.scheduledLink, "_blank")
                          }
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
