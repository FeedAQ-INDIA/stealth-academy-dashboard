import React, {useEffect, useState} from "react";
import {Plus, X,} from "lucide-react";

import {Badge} from "@/components/ui/badge.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command.jsx";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import RecordComment from "@/components-xm/Workspace/RecordComment.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useAuthStore} from "@/zustland/store.js";

function MultiSelectTagComponent() {
    const { WorkspaceId } = useParams();

    const labels = ["feature", "bug", "enhancement", "documentation", "design", "question", "maintenance",]
    const [label, setLabel] = React.useState([])
    const [labelDropOpen, setLabelDropOpen] = React.useState(false)


    return (
        <div>
            <div
                className="flex max-w-screen flex-col items-start justify-between border px-4 py-3  ">

                <p className="text-sm font-medium leading-none flex flex-wrap gap-2 items-center ">
                    {label?.map((a, index) => (<Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 rounded-md px-2 py-1 text-xs"
                    >
                        <span>{a}</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-100"
                        >
                            <X className="h-3 w-3"/>
                        </Button>
                    </Badge>))}


                    <Popover open={labelDropOpen} onOpenChange={setLabelDropOpen}>
                        <PopoverTrigger asChild>
                            <Button size="xs" className="text-xs p-1">
                                <Plus/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[200px] p-2 rounded-1">

                            <Command className="">
                                <CommandInput
                                    placeholder="Filter label..."
                                    autoFocus={true}
                                />
                                <CommandList>
                                    <CommandEmpty>No label found.</CommandEmpty>
                                    <CommandGroup>
                                        {labels.map((label) => (<CommandItem
                                            key={label}
                                            value={label}
                                            onSelect={(value) => {
                                                setLabel((prevLabels) => [...prevLabels, value])
                                                setLabelDropOpen(false)
                                            }}
                                        >
                                            {label}
                                        </CommandItem>))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>

                        </PopoverContent>
                    </Popover>
                </p>
            </div>
           </div>
    );
}

export default MultiSelectTagComponent;
