import React, {useEffect, useState} from "react";
import {ChevronsUpDown, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import {Link, useParams} from "react-router-dom";
import {useAuthStore} from "@/zustland/store.js";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.jsx";

function AssigneeModule({intialValue, uiType, recordId, isEditable = true}) {
    const {WorkspaceId, RecordId, StakeholderId} = useParams();
    const [label, setLabel] = useState(null);
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);
    const [defaultFilteredLabels, setDefaultFilteredLabels] = useState([]);
    const {toast} = useToast();


    useEffect(() => {

        if (intialValue) {
            setLabel(intialValue)
        }
        if (isEditable) {
            fetchUsers()
        }
    }, [ intialValue, isEditable]);

    useEffect(() => {
            searchUsers();

     }, [query])


    const fetchUsers = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 1, offset: 0, getThisData: {
                datasource: "Workspace", order: [], attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg")}
                , include: [{
                    datasource: "User", as: "users", required: false, order: [], attributes: [],
                },
                    // {
                    //     datasource: "Team", as: "teams", required: false, order: [], attributes: [], where: {},
                    // },
                ],
            },
        }).then(res => {
            console.log(res?.data?.data?.results?.[0]?.users);
            setFilteredLabels(res?.data?.data?.results?.[0]?.users || [])
            setDefaultFilteredLabels(res?.data?.data?.results?.[0]?.users || []);
         }).catch(err => {
            console.log(err);
         })
    }

    const searchUsers = () => {
        if(query && query.length > 2 ) {

            axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "Workspace", order: [], attributes: [], where: {
                        workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg")
                    }
                    , include: [{
                        datasource: "User", as: "users", required: false, order: [], attributes: [], where: {
                            ...(query && query.length > 2 && {
                                firstName: {
                                    "$like": `%${query}%`
                                }
                            })
                        },
                    },
                        // {
                        //     datasource: "Team", as: "teams", required: false, order: [], attributes: [], where: {},
                        // },
                    ],
                },
            }).then(res => {
                console.log(res?.data?.data?.results?.[0]?.users);
                setFilteredLabels(res?.data?.data?.results?.[0]?.users || [])
            }).catch(err => {
                console.log(err);
            })
        }else{
            setFilteredLabels(defaultFilteredLabels)
        }
    }


    const handleAssigneeUpdate = (newAssignee) => {

        if (newAssignee && label?.userId != newAssignee?.userId) {
            axiosConn.post("http://localhost:3000/updateAssignee", {
                workspaceId: WorkspaceId, ...(recordId ? {recordId: recordId} : RecordId ? {recordId: RecordId} : {}),
                newAssigneeId: newAssignee?.userId,
                orgId: localStorage.getItem("currentOrg"),
            })
                .then(response => {
                    if (newAssignee?.userId) {
                        setLabel(newAssignee)
                    } else {
                        setLabel(null)
                    }
                    console.log("Assignee updated successfully:", response.data)
                    toast({
                        title: "Assignee updated successfully!",
                    })
                })
                .catch(error => {
                    toast({
                        title: "Status update failed!",
                    });
                    console.error("Error updating status:", error)
                });
        }

    }


    return (<div>

        {isEditable &&  !label?.stakeholderId &&
            <Popover open={labelDropOpen} onOpenChange={setLabelDropOpen}>
            <PopoverTrigger asChild>
                {uiType != 'Avatar' ? <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={labelDropOpen}
                    className="w-full  justify-between font-normal cursor-pointer"
                >
                    {label ? label?.firstName : "Select Assignee..."}
                    <ChevronsUpDown className="opacity-50"/>
                </Button> : <Avatar className="hover:shadow-lg  cursor-pointer">
                    <AvatarFallback>
                        {label?.nameInitial || <UserRound strokeWidth={1}/>}
                    </AvatarFallback>
                </Avatar>}

            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-2 rounded-1 "  >
                <Command  >
                    <CommandInput
                        placeholder="Filter label..."
                        autoFocus
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList   >
                        <CommandEmpty>No label found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    handleAssigneeUpdate({
                                        userId: null
                                    });
                                    setLabelDropOpen(false);
                                }}
                            >
                                NONE
                            </CommandItem>
                            {filteredLabels?.map((labelItem) => (<CommandItem
                                key={labelItem.userId}
                                value={labelItem.firstName}
                                onSelect={() => {
                                    handleAssigneeUpdate(labelItem);
                                    setLabelDropOpen(false);
                                }}
                            >
                                {labelItem?.firstName}
                            </CommandItem>))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover> }

        { !isEditable &&
          uiType != 'Avatar' &&
            !label?.stakeholderId &&

                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={labelDropOpen}
                            className="w-full  justify-between font-normal cursor-pointer"
                        >
                            {label ? label?.firstName : "NONE"}
                            <ChevronsUpDown className="opacity-50"/>
                        </Button>

                    </HoverCardTrigger>
                    {label?.firstName && <HoverCardContent className="w-fit z-[52]">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarFallback>{label?.nameInitial}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{label?.derivedUserName}</h4>
                                <p className="text-xs font-medium text-muted-foreground">{label?.email}</p>
                                <p className="text-sm line-clamp-2">
                                    {label?.number}
                                </p>

                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {label?.created_date}
                                      </span>
                                </div>
                                <div className="items-start pt-2">
                                    <Link target="blank" to={`/user/${label?.userId}`}>
                                        <Button size={"sm"} variant="secondary"
                                                className="rounded-none text-xs font-normal hover:shadow-sm">View
                                            Profile</Button>

                                    </Link>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>}
                </HoverCard> }

        { !isEditable &&
            uiType == 'Avatar' &&
             !label?.stakeholderId &&
            <HoverCard>
                    <HoverCardTrigger asChild>
                        <Avatar className="hover:drop-shadow-lg  cursor-pointer">
                            <AvatarFallback>
                                {label?.nameInitial || <UserRound strokeWidth={1}/>}
                            </AvatarFallback>
                        </Avatar>
                    </HoverCardTrigger>
                    {label?.nameInitial && <HoverCardContent className="w-fit z-[52]">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarFallback>{label?.nameInitial}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{label?.derivedUserName}</h4>
                                <p className="text-xs font-medium text-muted-foreground">{label?.email}</p>
                                <p className="text-sm line-clamp-2">
                                    {label?.number}
                                </p>

                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {label?.created_date}
                                      </span>
                                </div>
                                <div className="items-start pt-2">
                                    <Link target="blank" to={`/user/${label?.userId}`}>
                                        <Button size={"sm"} variant="secondary"
                                                className="rounded-none text-xs font-normal hover:shadow-sm">View
                                            Profile</Button>

                                    </Link>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>}
                </HoverCard>
        }

        { !isEditable &&
            uiType == 'Avatar' &&
            label?.stakeholderId &&
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Avatar className="hover:drop-shadow-lg  cursor-pointer">
                        <AvatarFallback>
                            {label?.nameInitial || <UserRound strokeWidth={1}/>}
                        </AvatarFallback>
                    </Avatar>
                </HoverCardTrigger>
                {label?.nameInitial && <HoverCardContent className="w-fit z-[52]">
                    <div className="flex justify-between space-x-4">
                        <Avatar>
                            <AvatarFallback>{label?.nameInitial}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{label?.derivedUserName}</h4>
                            <p className="text-xs font-medium text-muted-foreground">{label?.email}</p>
                            <p className="text-sm line-clamp-2">
                                {label?.number}
                            </p>

                            <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {label?.created_date}
                                      </span>
                            </div>
                            <div className="items-start pt-2">
                                <Link target="blank" to={`/workspace/${WorkspaceId}/stakeholder/${label?.stakeholderId}?tab=stakeholder`}>
                                    <Button size={"sm"} variant="secondary"
                                            className="rounded-none text-xs font-normal hover:shadow-sm">View
                                        Profile</Button>

                                </Link>
                            </div>
                        </div>
                    </div>
                </HoverCardContent>}
            </HoverCard>

        }

    </div>);
}

export default AssigneeModule;