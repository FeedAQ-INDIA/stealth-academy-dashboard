import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, MoreHorizontal, Search, Terminal, UserRound,} from "lucide-react";

import {Badge} from "@/components/ui/badge.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import axiosConn from "@/axioscon.js";
import {toast, useToast} from "@/components/hooks/use-toast.js";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import {Link} from "react-router-dom";

function OrganizationUsers() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {toast} = useToast();
    const [memberList, setMemberList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false)
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "OrgUser", order: [], attributes: [],where: {
                orgId: localStorage.getItem("currentOrg"),
            }, include: [
                {
                    datasource: "User", as: "userid", required: false, order: [[]], attributes: [],
                }, {
                    datasource: "User", as: "userinviteby", required: false, order: [[]], attributes: [],
                },]
        },
    })

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


    const InviteMemberSchema = z.object({
        email: z.string().refine((value) => value.split(",").every((email) => emailRegex.test(email)), // Simplified email validation
            {message: "One or more emails are invalid"}),
    });

    const form = useForm({
        resolver: zodResolver(InviteMemberSchema), defaultValues: {email: ""},
    });

    const onInviteSubmit = (data) => {
        axiosConn.post("http://localhost:3000/sendUserInvite", {
            userInviteEmail: data.email, orgId: localStorage.getItem("currentOrg")
        }).then(res => {
            console.log(res.data);
            toast({
                title: "Member Invite has been sent successfully", description: res?.data?.data,
            });
            setOpenDialog(false)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [apiQuery]);


    const fetchMembers = () => {
        axiosConn.post("http://localhost:3000/searchRecord", apiQuery).then(res => {
            console.log(res.data);
            setMemberList(res?.data?.data);
            setTotalCount(res?.data?.data?.totalCount);
            setOffset(res?.data?.data?.offset);
            setLimit(res?.data?.data?.limit);
            setOpenDialog(false);

        }).catch(err => {
            console.error(err);
        })
    }

    const removeAssociatedMembers = (a) => {
        axiosConn.post("http://localhost:3000/deleteUserOrgLink", {
            userId: a?.userId,
            orgId: a?.orgId,
        }).then(res => {
            console.log(res.data);
            toast({
                title: res?.data?.data,
            })
        }).catch(err => {
            console.error(err);
            toast({
                title: "Error occured while deleting the user from this org",
            })
        })
    }

    return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/><Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Organization Users / Members</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>
        <div className=" gap-4 items-center p-4">
            <div className="flex items-center">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button size="sm" className=" ml-0 gap-1">Invite Members</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invite Members</DialogTitle>
                            <DialogDescription>
                                You can add comma separated emails for sending bullk invite
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onInviteSubmit)}
                                className="w-full space-y-6"
                            >
                                {" "}
                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (<FormItem>
                                            <FormLabel>Enter the Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Type email here."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>)}
                                    />
                                </div>


                                <DialogFooter>
                                    <Button type="submit">Send Invite </Button>
                                </DialogFooter></form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        onChange={(e) => {
                            const searchValue = e.target.value;
                            updateApiQuery("User", {
                                where: searchValue && searchValue.length > 0 ? {email: `${searchValue}`} : {},
                            });
                        }}
                    />
                </div>
            </div>
            <div className=" mt-4 w-full">


                {memberList?.results?.length > 0 ? (<>
                    <Table className="border">
                        <TableHeader>
                            <TableRow>

                                <TableHead className="hidden sm:table-cell">
                                    NAME
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    EMAIL
                                </TableHead>

                                <TableHead className="hidden sm:table-cell">
                                    ROLE
                                </TableHead>
                                <TableHead className="hidden sm:table-cell text-right">
                                    ACTIONS
                                </TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {memberList?.results?.map((a) => (<TableRow key={a?.userid?.userId}>
                                <TableCell className=" ">
                                    <Link target="blank" to={`/user/${a?.userid?.userId}`}>
                                        <div className="line-clamp-1 flex gap-2 items-center font-medium"
                                             title={a?.userid?.firstName}>
                                            <div
                                                className=" p-2">

                                                <AssigneeModule intialValue={a?.userid} uiType={'Avatar'}   isEditable={false} />

                                            </div>
                                            <div className="flex flex-col gap-0.5 leading-none  "
                                                 title={a?.userid?.firstName}>
                                                <span  >{a?.userid?.firstName}</span>
                                            </div>
                                        </div>
                                    </Link>

                                </TableCell>
                                <TableCell>
                                    <div className=" ">{a?.userid?.email}</div>

                                </TableCell>

                                {/*<TableCell className="hidden sm:table-cell  ">*/}
                                {/*<div*/}
                                {/*            className="">*/}

                                {/*            <AssigneeModule   intialValue={a?.userInviteBy} uiType={'Avatar'}   isEditable={false} />*/}

                                {/*        </div>*/}


                                {/*</TableCell>*/}
                                <TableCell className="hidden sm:table-cell ">
                                    {a?.userOrgRole}
                                    {/*<Select value={a?.userOrgRole} className="mx-auto" disabled={a?.userOrgRole == 'OWNER'}>*/}
                                    {/*    <SelectTrigger className="w-fit border-0">*/}
                                    {/*        <SelectValue/>*/}
                                    {/*    </SelectTrigger>*/}
                                    {/*    <SelectContent>*/}
                                    {/*        <SelectGroup>*/}
                                    {/*            <SelectItem value="OWNER">OWNER</SelectItem>*/}
                                    {/*            <SelectItem value="ADMINISTRATOR">ADMIN</SelectItem>*/}
                                    {/*            <SelectItem value="MEMBER">MEMBER</SelectItem>*/}
                                    {/*        </SelectGroup>*/}
                                    {/*    </SelectContent>*/}
                                    {/*</Select>*/}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell  text-right ">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => removeAssociatedMembers(a)}
                                        >
                                            Remove User
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>))}

                            {(memberList?.results?.length === 0) ? (<TableRow>
                                <TableCell
                                    colSpan={7}
                                    className=" table-cell text-center py-4 italic	"
                                >
                                    No Data Found
                                </TableCell>
                            </TableRow>) : (<></>)}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6} className="py-3">
                                    <div className="flex flex-row items-center">
                                        <div className="text-xs text-muted-foreground">
                                            {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} row(s) selected.
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
                                                                ...prevQuery,
                                                                offset: Math.max(offset - limit, 0),
                                                            }));
                                                        }}
                                                    >
                                                        <ChevronLeft className="h-3.5 w-3.5" />
                                                        <span className="sr-only">Previous Order</span>
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
                                                                ...prevQuery,
                                                                offset: offset + limit < totalCount ? offset + limit : offset,
                                                            }));
                                                        }}
                                                    >
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                        <span className="sr-only">Next Order</span>
                                                    </Button>
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
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

export default OrganizationUsers;
