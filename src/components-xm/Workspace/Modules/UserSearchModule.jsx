import React, {useEffect, useState} from "react";
import {Plus, X} from "lucide-react";
import {Badge} from "@/components/ui/badge.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import {useParams} from "react-router-dom";
import {useAuthStore} from "@/zustland/store.js";

function UserSearchModule({ initialValue , onChange }) {
    const {WorkspaceId, StakeholderId, RecordId} = useParams();
    const [label, setLabel] = useState([]);
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);

    useEffect(() => {
        if(initialValue){
            setLabel(initialValue);
        }
        fetchUsers()
    }, [initialValue]);

       useEffect(() => {
            if(query && query.length() > 2 ){
                fetchUsers();
            }
         }, [query])

    const fetchUsers = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 1, offset: 0, getThisData: {
                datasource: "Workspace", order: [], attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                }, include: [{
                    datasource: "User", as: "users", required: false, order: [], attributes: [], where: {
                        ...(query && query.length() > 2 && {firstName : {
                            "$like" : `%${query}%` 
                        }})
                    },
                },
                    // {
                    //     datasource: "Team", as: "teams", required: false, order: [], attributes: [], where: {},
                    // },
                ],
            },
        }).then(res => {
            console.log(res?.data);
            setFilteredLabels(res?.data?.data?.results?.[0]?.users)
        }).catch(err => {
            console.log(err);
         })
    } 


    const handleTagUpdate = (labelItem) => {
        if (!label.some(l => l.userId === labelItem.userId)) {
            const updatedLabels = [...label, labelItem];
            setLabel(updatedLabels);
            onChange?.(updatedLabels); // Notify parent
        }

    }

    const handleTagDelete = (labelItem) => {
        if (labelItem) {
            const updatedLabels = label.filter(l => l.userId !== labelItem.userId);
            setLabel(updatedLabels);
            onChange?.(updatedLabels); // Notify parent        }
        }
    }

    return (<div>
            <div className="flex max-w-screen flex-col items-start justify-between border px-4 py-3">
                <p className="text-sm font-medium leading-none flex flex-wrap gap-2 items-center">
                    {label?.map((a) => (<Badge
                            key={a.userId}
                            variant="secondary"
                            className="flex items-center gap-2 rounded-md px-2 py-1 text-xs"
                        >
                            <span>{a.firstName}</span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-4 w-4 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-100"
                                onClick={() => handleTagDelete(a)}
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
                                        {filteredLabels.map((labelItem) => (<CommandItem
                                                key={labelItem.userId}
                                                value={labelItem.firstName}
                                                onSelect={() => {
                                                    handleTagUpdate(labelItem)
                                                    // setLabel(prevLabels => {
                                                    //     if (!prevLabels.some(l => l.userId === labelItem.userId)) {
                                                    //         return [...prevLabels, labelItem];
                                                    //     }
                                                    //     return prevLabels;
                                                    // });
                                                    // if (!label.some(l => l.userId === label.userId)) {
                                                    //     setLabel((prevLabels) => [...prevLabels, label]);
                                                    // }
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

export default UserSearchModule;