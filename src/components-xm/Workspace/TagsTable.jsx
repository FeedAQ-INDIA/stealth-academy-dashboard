import React, {useEffect, useState} from "react";
import {ArrowDownUp, ChevronLeft, ChevronRight, MoreHorizontal, Search, Terminal, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";

function TagsTable() {
    const {WorkspaceId, StakeholderId} = useParams();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [storedDate, setStoredDate] = useState({
        from: localStorage.getItem("searchStartwindow"), to: localStorage.getItem("searchEndwindow"),
    });
    const {toast} = useToast();
    const navigate = useNavigate();

    const [isStatusUpdateAlertOpen, setIsStatusUpdateAlertOpen] = useState(false)
    const [updateTagItemSelected, setUpdateTagItemSelected] = useState(null)
    const [tagList, setTagList] = useState({});

    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Tags", order: [["tag_created_at", "DESC"]], attributes: [], where: {
                workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
            }, include: [{
                datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
            },],
        },
    });

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

    useEffect(() => {
        fetchTags();
    }, [apiQuery]);

    const fetchTags = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setTagList(res.data.data);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTags = (a) => {
        axiosConn
            .post("http://localhost:3000/deleteTags", {
                workspaceId: a?.workspaceId,
                orgId: a?.orgId,
                tagId: a?.tagId,
                tagStatus: a?.tagStatus
            })
            .then((res) => {
                console.log(res.data?.data);
                toast({
                    title: res?.data?.data?.message
                });
                fetchTags();
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: `Error Occured !`, description: `Failed to delete ${a.tagName}`
                })
            });
    }

    return (<div className="flex flex-col gap-4 ">
        <div className="flex items-center py-4">
            {/*<Button variant="ghost">*/}
            {/*    <Filter/>*/}
            {/*</Button>*/}
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    onChange={(e) => {
                        const searchValue = e.target.value;
                        updateApiQuery("Tags", {
                            where: searchValue ? {
                                tagName: {
                                    $like: `%${searchValue}%`,
                                },
                            } : {},
                        })

                    }}
                />
            </div>
        </div>
        {tagList?.results?.length > 0 ? <>

            <Table className="border">
                <TableHeader>
                    <TableRow>

                        <TableHead className="hidden sm:table-cell"
                                   onClick={() => {
                                       fetchValueByDatasourceAndKey("Tags", "order")[0][1] == "DESC" ? updateApiQuery("Tags", {order: [["tagName", "ASC"]],}) : updateApiQuery("Tags", {order: [["tagName", "DESC"]],});
                                   }}>
                            <Button variant="ghost"> TAG NAME <ArrowDownUp className="ml-2 h-3.5 w-3.5"/>
                            </Button>
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            DESCRIPTION
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            STATUS
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            CREATED BY
                        </TableHead>
                        <TableHead className="text-right">
                            <Button
                                variant="ghost"
                            >
                                CREATED ON
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tagList?.results?.map((a) => (<TableRow key={a.tagId}>
                        <TableCell className="hidden sm:table-cell font-medium">
                            {a.tagName}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell w-1/3 break-words whitespace-pre-wrap ">
                                    <span className="line-clamp-1" title={a?.tagDescription}>
                                        {a?.tagDescription}
                                    </span>
                        </TableCell>
<TableCell>
    <StatusView initialStatus={a?.tagStatus}/>
 </TableCell>

                        <TableCell className="hidden sm:table-cell p-2">

                                 <div
                                    className="">

                                     <AssigneeModule intialValue={a?.createdby} uiType={'Avatar'}   isEditable={false} />

                                 </div>

                         </TableCell>

                        <TableCell className="text-right">
                            {a.created_date} <br/>{a.created_time}
                        </TableCell>

                        <TableCell className="text-right">
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
                                        onClick={() => navigate(`/workspace/${WorkspaceId}/tags/${a.tagId}/edit`)}
                                    >
                                        Edit
                                    </DropdownMenuItem>

                                    <AlertDialog open={isStatusUpdateAlertOpen} onOpenChange={(open) => setIsStatusUpdateAlertOpen(open)} >
                                        <AlertDialogTitle asChild>
                                            <DropdownMenuItem
                                                className="font-normal text-sm"
                                                onSelect={(e) => {
                                                   e.preventDefault();
                                                    setIsStatusUpdateAlertOpen(true);
                                                    setUpdateTagItemSelected(a)
                                                }}

                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </AlertDialogTitle>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <span className="font-medium">{updateTagItemSelected?.tagName}</span> tag will be archived
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel  onClick={() => setIsStatusUpdateAlertOpen(false)}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => {
                                                    deleteTags(updateTagItemSelected)
                                                }}>Yes</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>



                                </DropdownMenuContent>
                            </DropdownMenu>

                      
                        </TableCell>

                    </TableRow>))}

                    {(tagList?.results?.length === 0) ? (<TableRow>
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

        </> : <>
            <Alert>
                <Terminal className="h-4 w-4"/>
                <AlertTitle>No Tags Found!</AlertTitle>
                <AlertDescription>
                    There are no tags present in this workspace
                </AlertDescription>
            </Alert></>}

    
        {/*<AlertDialog open={isStatusUpdateAlertOpen} onOpenChange={(open) => setIsStatusUpdateAlertOpen(open)}>*/}
        {/*    <AlertDialogContent>*/}
        {/*        <AlertDialogHeader>*/}
        {/*            <AlertDialogTitle>Are you sure?</AlertDialogTitle>*/}
        {/*            <AlertDialogDescription>*/}
        {/*                {updateTagItemSelected?.tagName} will be archived*/}
        {/*            </AlertDialogDescription>*/}
        {/*        </AlertDialogHeader>*/}
        {/*        <AlertDialogFooter>*/}
        {/*            <AlertDialogCancel  onClick={() => setIsStatusUpdateAlertOpen(false)}>Cancel</AlertDialogCancel>*/}
        {/*            <AlertDialogAction onClick={() => {*/}
        {/*                updateTagItemSelected.tagStatus = 'ARCHIVED';*/}
        {/*                updateTags(updateTagItemSelected)*/}
        {/*            }}>Continue</AlertDialogAction>*/}
        {/*        </AlertDialogFooter>*/}
        {/*    </AlertDialogContent>*/}
        {/*</AlertDialog>*/}

    </div>)

}

export default TagsTable;
