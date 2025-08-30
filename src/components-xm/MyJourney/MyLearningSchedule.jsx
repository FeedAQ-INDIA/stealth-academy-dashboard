import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp } from "lucide-react";
import React, { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { formatDateRange } from "little-date";
import { PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function MyLearningSchedule() {
  const events = [
    {
      title: "Team Sync Meeting",
      from: "2025-06-12T09:00:00",
      to: "2025-06-12T10:00:00",
    },
    {
      title: "Design Review",
      from: "2025-06-12T11:30:00",
      to: "2025-06-12T12:30:00",
    },
    {
      title: "Client Presentation",
      from: "2025-06-12T14:00:00",
      to: "2025-06-12T15:00:00",
    },
  ];

  const [date, setDate] = useState(new Date(2025, 5, 12));

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

    <Card className=" ">
      <CardHeader className=" ">
        <div className="flex flex-col  md:flex-row gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-transparent p-0 flex-1/2"
            required
          />

          <div className="flex flex-col items-start gap-3   flex-1">
            <div className="flex w-full items-center justify-between ">
              <div className="text-sm font-medium">
                {date?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                title="Add Event"
              >
                <PlusIcon />
                <span className="sr-only">Add Event</span>
              </Button>
            </div>
            <div className="flex w-full flex-col gap-2 ">
              {events.map((event) => (
                <div
                  key={event.title}
                  className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex"
                >
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDateRange(
                        new Date(event.from),
                        new Date(event.to)
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Join
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
