import React, {useEffect, useState} from "react";
import {Plus, X} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import {useParams} from "react-router-dom";
 import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";

function WatcherSearchModule( ) {
    const {WorkspaceId , RecordId} = useParams();
    const [label, setLabel] = useState([]);
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);
    const [defaultFilteredLabels, setDefaultFilteredLabels] = useState([]);
    const [viewers, setViewers] = useState([]);

    



    useEffect(() => {

        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "RecordWatcher", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                    recordId: RecordId
                },
                include:[
                    {
                        datasource: "User",
                        as: "watcherdetail",
                        required: false,
                        order: [],
                        attributes: [],
                        where: {},
                    },
                ]
            },
        })
            .then(response => {
                console.log(response.data);
                console.log(response.data?.data?.results?.map(a => a?.watcherdetail))
                setLabel(response.data?.data?.results?.map(a => a?.watcherdetail) || [])
            })
            .catch(error => console.error("Error fetching labels:", error));

        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "RecordViewer", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                    recordId: RecordId
                },
                include:[
                    {
                        datasource: "User",
                        as: "viewerdetail",
                        required: false,
                        order: [],
                        attributes: [],
                        where: {},
                    },
                ]
            },
        })
            .then(response => {
                console.log(response.data);
                console.log(response.data?.data?.results?.map(a => a?.viewerdetail))

                 setViewers(response.data?.data?.results?.map(a => a?.viewerdetail) || [])
            })
            .catch(error => console.error("Error fetching labels:", error));


        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 1, offset: 0, getThisData: {
                datasource: "Workspace", order: [], attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                }, include: [{
                    datasource: "User", as: "users", required: false, order: [], attributes: [], where: {
                    },
                }, ],
            },
        } )
            .then(response => {
                console.log(response.data);
                setFilteredLabels(response.data?.data?.results?.[0]?.users)
                setDefaultFilteredLabels(response.data?.data?.results?.[0]?.users)

            })
            .catch(error => console.error("Error fetching labels:", error));

    }, [RecordId, WorkspaceId]);



useEffect(() => {
        if (query?.trim()?.length > 0) {
            axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "Workspace", order: [], attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                    }, include: [{
                        datasource: "User", as: "users", required: false, order: [], attributes: [], where: {
                            firstName: {
                                $like: `%${query}%`,
                            }
                        },
                    }, ],
                },
            } )
                .then(response => {
                    console.log(response.data);
                    setFilteredLabels(response.data?.data?.results?.[0]?.users)
                })
                .catch(error => console.error("Error fetching labels:", error));
        } else {
            setFilteredLabels(defaultFilteredLabels);
        }
    }, [query]);



    const handleTagUpdate = (labelItem) => {
        console.log(label)
        console.log(labelItem)
        if (!label.some(l => l.userId === labelItem.userId)) {
            axiosConn.post("http://localhost:3000/updateRecordWatcher", {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem("currentOrg"),
                recordId : RecordId,
                userId: labelItem?.userId
            }).then(res => {
                console.log(res?.data);
                setLabel(prevLabels => {
                    return [...prevLabels, labelItem];
                });
            }).catch(err => {
                console.log(err)
            })
        }else{
            console.log("tag already exists")
        }

    }


    const handleTagDelete = (labelItem) => {
        if (labelItem) {
            axiosConn.post("http://localhost:3000/deleteRecordWatcher", {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem("currentOrg"),
                recordId : RecordId,
                recordWatcherId: labelItem?.userId
            }).then(res => {
                console.log(res?.data);
                setLabel(prev => prev.filter(l => l.userId !== labelItem.userId))
            }).catch(err => {
                console.log(err)
            })
        }else{
            console.log("Error deleting tag list")
        }

    }

    return (<div>
        <div className="flex max-w-screen flex-col items-start justify-between border px-4 py-3">
            <p className="text-sm font-medium leading-none flex flex-wrap gap-2 items-center">
                {viewers?.map((a) => (
                    <Badge
                        key={a.userId}
                        variant="outline"

                        className={` items-center rounded-md px-2 py-1 text-xs bg-green-500`}
                    >
                        <div  className="flex items-center gap-1">
                            <AssigneeModule intialValue={a} uiType={'Avatar'}   isEditable={false} />

                        </div>
                    </Badge>))}

                {label?.map((a) => (
                    <Badge
                    key={a.userId}
                    variant="outline"

                    className={` items-center rounded-md px-2 py-1 text-xs bg-blue-600`}
                >
                        <div  className="flex items-center gap-1">
                            <AssigneeModule intialValue={a} uiType={'Avatar'}   isEditable={false} />

                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-4 w-4 p-0 text-white hover:text-red-500 hover:bg-red-100"
                                onClick={() => handleTagDelete(a)}
                            >
                                <X className="h-3 w-3"/>
                            </Button>
                        </div>
                 </Badge>))}

                <Popover open={labelDropOpen} onOpenChange={setLabelDropOpen}>
                    <PopoverTrigger asChild>
                        <Button size="xs" className="text-xs p-1">
                            <Plus/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-1">
                        <Command>
                            <CommandInput
                                placeholder="Filter label..."
                                autoFocus
                                value={query}
                                onValueChange={setQuery}
                            />
                            <CommandList>
                                <CommandEmpty>No label found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredLabels?.map((labelItem) => (<CommandItem
                                        key={labelItem.userId}
                                        value={labelItem.firstName}
                                        onSelect={() => {
                                            handleTagUpdate(labelItem)
                                            setLabelDropOpen(false);
                                        }}
                                    >
                                        {labelItem.firstName}
                                    </CommandItem>))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </p>
        </div>
    </div>);
}

export default WatcherSearchModule;