import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import {useParams} from "react-router-dom";

function ProductsSearchModule({initialValue}) {
    const {WorkspaceId, StakeholderId, RecordId} = useParams();
    const [label, setLabel] = useState([]);
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);
    const [defaultFilteredLabels, setDefaultFilteredLabels] = useState([]);

    useEffect(() => {
        if(initialValue){
            setLabel(initialValue);
        }

    }, [initialValue]);

    useEffect(() => {
             axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "Product",  attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),

                    }
                },
            })
                .then(response => {
                    console.log(response.data);
                    setFilteredLabels(response.data?.data?.results)
                    setDefaultFilteredLabels(response.data?.data?.results)
                })
                .catch(error => console.error("Error fetching labels:", error));

    }, [ ]);

    useEffect(() => {
        if (query?.trim()?.length>0) {
            axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "Product",  attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                         productName: {
                            $like: `%${query}%`,
                        }
                     }
                },
            })
                .then(response => {
                    console.log(response.data);
                    setFilteredLabels(response.data?.data?.results)
                })
                .catch(error => console.error("Error fetching labels:", error));
        } else {
            setFilteredLabels(defaultFilteredLabels);
        }
    }, [query]);

    const handleTagUpdate = (labelItem) => {
        if (!label.some(l => l.productId === labelItem.productId)) {
            axiosConn.post("http://localhost:3000/addRecordStakeholderProducts", {
                workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                ...(RecordId && {recordId:RecordId}),
                ...(StakeholderId && {stakeholderId:StakeholderId}),
                productIdList: [labelItem.productId]
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
            axiosConn.post("http://localhost:3000/deleteRecordStakeholderProducts", {
                workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                ...(RecordId && {recordId:RecordId}),
                ...(StakeholderId && {stakeholderId:StakeholderId}),
                productIdList: [labelItem.productId]
            }).then(res => {
                console.log(res?.data);
                setLabel(prev => prev.filter(l => l.productId !== labelItem.productId))
            }).catch(err => {
                console.log(err)
            })
        }else{
            console.log("Error deleting tag list")
        }

    }

    return (
        <div>
            <div className="flex max-w-screen flex-col items-start justify-between border px-4 py-3">
                <p className="text-sm font-medium leading-none flex flex-wrap gap-2 items-center">
                    {label.map((a) => (
                        <Badge
                            key={a.productId}
                            variant="secondary"
                            className="flex items-center gap-2 rounded-md px-2 py-1 text-xs"
                        >
                            <span>{a.productName}</span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-4 w-4 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-100"
                                onClick={() =>handleTagDelete(a)}
                            >
                                <X className="h-3 w-3"/>
                            </Button>
                        </Badge>
                    ))}

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
                                        {filteredLabels.map((labelItem) => (
                                            <CommandItem
                                                key={labelItem.productId}
                                                value={labelItem.productName}
                                                onSelect={() => {
                                                    handleTagUpdate(labelItem)
                                                    // setLabel(prevLabels => {
                                                    //     if (!prevLabels.some(l => l.productId === labelItem.productId)) {
                                                    //         return [...prevLabels, labelItem];
                                                    //     }
                                                    //     return prevLabels;
                                                    // });
                                                    // if (!label.some(l => l.tagId === label.tagId)) {
                                                    //     setLabel((prevLabels) => [...prevLabels, label]);
                                                    // }
                                                    setLabelDropOpen(false);
                                                }}
                                            >
                                                {labelItem.productName}
                                            </CommandItem>
                                        ))}
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

export default ProductsSearchModule;