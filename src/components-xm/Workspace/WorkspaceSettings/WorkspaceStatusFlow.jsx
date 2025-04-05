import React, {useEffect, useState} from "react";
import {
    Check, ChevronLeft, ChevronRight, ChevronsUpDown, CircleX, MoreHorizontal, Search, Terminal,
} from "lucide-react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useParams} from "react-router-dom";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import axiosConn from "@/axioscon.js";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {cn} from "@/lib/utils.js";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

function WorkspaceStatusFlow() {
    const {WorkspaceId} = useParams();
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [memberList, setMemberList] = React.useState([])
    const [associatedMemberList, setAssociatedMemberList] = React.useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "WorkspaceUser", order: [], attributes: [], where: {
                workspaceId: WorkspaceId,
            }, include: [{
                datasource: "User", as: "userid", required: true, order: [[]], attributes: [],
            }, {
                datasource: "User", as: "userinviteby", required: true, order: [[]], attributes: [],
            },]
        }
    })

    useEffect(() => {
        fetchOrgMembers();
        fetchAssociatedMembers();
    }, []);

    useEffect(() => {
        fetchAssociatedMembers();
    }, [apiQuery]);

    const updateApiQuery = (datasource, keyValueUpdates) => {
        setApiQuery((prevQuery) => {
            const newQuery = {...prevQuery};

            // Function to handle the merging of where clauses
            const updateWhereClause = (currentWhere, newWhere) => {
                // Start with a copy of the current where clause
                const updatedWhere = {...currentWhere};

                // Loop through each key in the new where object
                for (const [key, value] of Object.entries(newWhere)) {
                    // Replace the value only if the key exists
                    if (updatedWhere.hasOwnProperty(key)) {
                        updatedWhere[key] = value; // Replace value if key exists
                    } else {
                        // Optionally log or handle the case where the key does not exist
                        updatedWhere[key] = value;
                        console.log(`Key ${key} does not exist, skipping addition.`);
                    }
                }
                console.log(updatedWhere);
                return updatedWhere; // Return the updated where clause
            };

            const updateNestedIncludes = (includes) => {
                for (const include of includes) {
                    if (include.datasource === datasource) {
                        // Update where clause if keyValueUpdates contains `where`
                        if (keyValueUpdates.where) {
                            include.where = updateWhereClause(include.where || {}, keyValueUpdates.where);
                        }

                        // Update other keys directly
                        Object.keys(keyValueUpdates).forEach((key) => {
                            if (key !== "where" && include.hasOwnProperty(key)) {
                                include[key] = keyValueUpdates[key]; // Replace existing keys
                            } else {
                                include[key] = keyValueUpdates[key];
                                console.log(`Key ${key} does not exist, skipping replacememnt.`);
                            }
                        });
                    }

                    if (include.include) {
                        updateNestedIncludes(include.include);
                    }
                }
            };

            // Update the main datasource if it matches
            if (newQuery.getThisData.datasource === datasource) {
                if (keyValueUpdates.where) {
                    newQuery.getThisData.where = updateWhereClause(newQuery.getThisData.where || {}, keyValueUpdates.where);
                } else {
                    newQuery.getThisData = {
                        ...newQuery.getThisData, ...keyValueUpdates,
                    };
                }

                // Update the main query with other key-value pairs
            } else {
                updateNestedIncludes(newQuery.getThisData.include);
            }

            return newQuery; // Return the updated query
        });
    };

    const fetchValueByDatasourceAndKey = (datasource, key) => {
        const {getThisData} = apiQuery;

        // Helper function to search recursively through includes
        const findInNestedIncludes = (includes) => {
            for (const include of includes) {
                // Check if the datasource matches
                if (include.datasource === datasource) {
                    return include[key]; // Return the value for the specified key
                }

                // If there are nested includes, search deeper
                if (include.include) {
                    const result = findInNestedIncludes(include.include);
                    if (result !== undefined) {
                        return result; // Return if found in nested includes
                    }
                }
            }
            return undefined; // Return undefined if not found
        };

        // Check main datasource
        if (getThisData.datasource === datasource) {
            return getThisData[key]; // Return the value for the specified key
        }

        // Search in nested includes
        return findInNestedIncludes(getThisData.include);
    };


    const fetchAssociatedMembers = () => {
        axiosConn.post("http://localhost:3000/searchRecord", apiQuery).then(res => {
            console.log(res.data);
            setAssociatedMemberList(res?.data?.data);
            setTotalCount(res?.data?.data?.totalCount);
            setOffset(res?.data?.data?.offset);
            setLimit(res?.data?.data?.limit);
        }).catch(err => {
            console.error(err);
        })
    }

    const removeAssociatedMembers = (a) => {
        axiosConn.post("http://localhost:3000/deleteWorkspaceUserLink", {
            workspaceId: WorkspaceId, workspaceUserLink: [{
                userId: a?.userId, workspaceId: a?.workspaceId,
            }]
        }).then(res => {
            console.log(res.data);
            toast({
                title: "Member Removed Successfully",
            });
            fetchAssociatedMembers();

        }).catch(err => {
            console.error(err);
        })
    }

    const [selectedMemberList, setSelectedMemberList] = useState([]);
    const [selectedMemberRole, setSelectedMemberRole] = useState('ADMINISTRATOR')
    const [disableAddButton, setDisableAddButton] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        if (value && selectedMemberRole) {
            setDisableAddButton(true);
        } else {
            setDisableAddButton(false);
        }
    }, [value, selectedMemberRole]);

    const addMemberToList = (obj) => {
        if (obj) {
            console.log(obj)
            console.log(selectedMemberList.filter(i => i?.member?.userId === obj?.member?.userId)?.length)
            if (selectedMemberList.filter(i => i?.member?.userId === obj?.member.userId)?.length == 0) {
                setSelectedMemberList([...selectedMemberList, obj])
            }
        }
    }


    const removeMemberFromList = (obj) => {
        if (obj) {
            setSelectedMemberList(selectedMemberList.filter(i => i?.member?.userId != obj?.member?.userId))
        }
    }

    const addMemberToWorkspace = () => {
        axiosConn.post("http://localhost:3000/createWorkspaceUserLink", {

            workspaceId: WorkspaceId, workspaceUserLink: selectedMemberList.map((i) => ({
                userId: i?.member?.userId, userWorkspaceRole: i?.role
            }))
        }).then(res => {
            console.log(res.data);
            toast({
                title: "Member added to workspace successfully",
            });
            setSelectedMemberList([])
            setOpenDialog(false);
            fetchAssociatedMembers();
        }).catch(err => {
            console.error(err);
        })
    }

    const fetchOrgMembers = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "User", order: [], attributes: [], include: [{
                    datasource: "Org", as: "organizations", required: true, order: [[]], attributes: [], through: {
                        where: {
                            orgId: localStorage.getItem("currentOrg"),
                        },
                    },
                },]
            },
        }).then(res => {
            console.log(res.data);
            setMemberList(res?.data?.data?.results);
        }).catch(err => {
            console.error(err);
        })
    }


    return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={`/ws/${WorkspaceId}`}>Workspace</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Access Control</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>

        <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
            <div className=" ">
                <CardTitle className="text-lg">Workspace Access Control</CardTitle>
                <CardDescription>Reach to mass audience</CardDescription>
            </div>
            <div className=" md:ml-auto flex items-center gap-1">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Member</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {value ? value?.firstName : "Select Member..."}
                                            <ChevronsUpDown className="opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search Member..." onChange={(e) => {
                                                setSearch(e.target.value)
                                            }}/>
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                    {memberList.map((framework) => (<CommandItem
                                                        key={framework.userId}
                                                        value={framework.userId}
                                                        onSelect={(currentValue) => {
                                                            console.log(currentValue + " , " + value);
                                                            setValue(framework.userId === value?.userId ? "" : framework)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        {framework.firstName}
                                                        <Check
                                                            className={cn("ml-auto", value?.userId === framework.userId ? "opacity-100" : "opacity-0")}
                                                        />
                                                    </CommandItem>))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <Select onValueChange={(val) => setSelectedMemberRole(val)}
                                        defaultValue={selectedMemberRole}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="ADMINISTRATOR">ADMINISTRATOR</SelectItem>
                                            <SelectItem value="MEMBER">MEMBER</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="grid grid-cols-2 gap-1">
                                    <Button variant="outline" onClick={() => setValue(null)}>Reset</Button>
                                    <Button disabled={!disableAddButton} onClick={() => addMemberToList({
                                        member: value, role: selectedMemberRole
                                    })}>Add</Button>
                                </div>
                            </div>

                            <div className="grid gap-1 max-h-28 overflow-y-auto">

                                {selectedMemberList?.map((i) => (
                                    <Card className="flex gap-1 w-full p-2" key={i?.member?.userId}>
                                        <div>
                                            <p>{i?.member?.email}</p>
                                            <CardDescription>{i?.role}</CardDescription>
                                        </div>
                                        <div className=" md:ml-auto flex items-center gap-1">
                                            <Button onClick={() => removeMemberFromList(i)}> <CircleX/> </Button>
                                        </div>
                                    </Card>))}

                            </div>
                        </div>
                        <DialogFooter>
                            {selectedMemberList?.length > 0 ?
                                <Button onClick={() => addMemberToWorkspace()}>Save changes</Button> : <></>}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>

        <div className="flex flex-col gap-4 p-4 ">

            <div className="  w-full">
                <div className="flex items-center py-4">
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                </div>
                {associatedMemberList?.results?.length > 0 ? (<>
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead className="hidden sm:table-cell">
                                    Member Email
                                </TableHead>

                                <TableHead className="hidden sm:table-cell">
                                    Invited by
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Role
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Actions
                                </TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {associatedMemberList?.results?.map((a) => (<TableRow key={a?.userid?.email}>
                                <TableCell className=" ">
                                    <div className="font-medium">{a?.userid?.email}</div>
                                </TableCell>

                                <TableCell className="hidden sm:table-cell w-36 break-words whitespace-pre-wrap ">
                                    <div className="line-clamp-1 flex gap-2 items-center"
                                         title={a?.userinviteby?.email}>
                                        <div
                                            className="">
                                            <Avatar>
                                                <AvatarFallback>{a?.nameInitial}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col gap-0.5 leading-none  "
                                             title={a?.userinviteby?.firstName}>
                                            <span className="line-clamp-1">{a?.userinviteby?.firstName}</span>
                                        </div>
                                    </div>

                                </TableCell>

                                <TableCell className="hidden sm:table-cell w-1/3 break-words whitespace-pre-wrap ">

                                    <Select value={a?.userWorkspaceRole} className="mx-auto">
                                        <SelectTrigger className="w-fit border-0">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="OWNER">OWNER</SelectItem>
                                                <SelectItem value="MEMBER">MEMBER</SelectItem>
                                                <SelectItem value="ADMINISTRATOR">ADMINISTRATOR</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell w-36 break-words whitespace-pre-wrap ">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => removeAssociatedMembers(a)}
                                            >
                                                Remove User
                                            </DropdownMenuItem>
                                            {/*<DropdownMenuSeparator />*/}
                                            {/*<DropdownMenuItem>View customer</DropdownMenuItem>*/}
                                            {/*<DropdownMenuItem>View payment details</DropdownMenuItem>*/}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>))}

                            {(associatedMemberList?.results?.length === 0) ? (<TableRow>
                                <TableCell
                                    colSpan={7}
                                    className=" table-cell text-center py-4 italic	"
                                >
                                    No Data Found
                                </TableCell>
                            </TableRow>) : (<></>)}
                        </TableBody>
                    </Table>
                    <div className="flex flex-row items-center  py-3">
                        <div className="text-xs text-muted-foreground">
                            {offset + 1} to {Math.min(offset + limit, totalCount)} of{" "}
                            {totalCount} row(s) selected.
                        </div>
                        <Pagination className="ml-auto mr-0 w-auto">
                            <PaginationContent>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        onClick={() => {
                                            setOffset(Math.max(offset - limit, 0));
                                            setApiQuery((prevQuery) => ({
                                                ...prevQuery, // Spread the previous state
                                                offset: Math.max(offset - limit, 0), // Update the specific attribute
                                            }));
                                        }}
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5"/>
                                        <span className="sr-only">Previous </span>
                                    </Button>
                                </PaginationItem>
                                <PaginationItem>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6"
                                        onClick={() => {
                                            setOffset(offset + limit < totalCount ? offset + limit : offset);
                                            setApiQuery((prevQuery) => ({
                                                ...prevQuery, // Spread the previous state
                                                offset: offset + limit < totalCount ? offset + limit : offset, // Update the specific attribute
                                            }));
                                        }}
                                    >
                                        <ChevronRight className="h-3.5 w-3.5"/>
                                        <span className="sr-only">Next </span>
                                    </Button>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>

                </>) : (<>
                    <Alert>
                        <Terminal className="h-4 w-4"/>
                        <AlertTitle>No Records Found!</AlertTitle>
                        <AlertDescription>
                            There are no records present in this workspace
                        </AlertDescription>
                    </Alert></>)}

            </div>
        </div>
    </div>);
}

export default WorkspaceStatusFlow;
