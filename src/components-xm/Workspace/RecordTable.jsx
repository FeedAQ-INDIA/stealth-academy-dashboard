import React, {useEffect, useState} from "react";
import {ArrowDownUp, ChevronLeft, ChevronRight, Filter, Search, Terminal, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {Link, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import StatusModule from "@/components-xm/Workspace/Modules/StatusModule.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Separator} from "@/components/ui/separator.jsx";


function RecordTable() {
    const {WorkspaceId,   StakeholderId} = useParams();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    const [recordList, setRecordList] = useState({});

    const [apiQuery, setApiQuery] = useState({});

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
        setApiQuery(({
            limit: limit, offset: offset, getThisData: {
                datasource: "Record", order: [["rec_created_at", "DESC"]], attributes: [], where: {
                     orgId: localStorage.getItem("currentOrg"), workspaceId: WorkspaceId,
                    ...(StakeholderId && {reportedBy: StakeholderId}),

                }, include: [{
                    datasource: "RecordData",
                    as: "recordData",
                    required: false,
                    order: [],
                    attributes: [],
                    where: {},

                },  {
                    datasource: "Workspace", as: "workspace", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "User", as: "assignedto", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "Stakeholder",
                    as: "submittedByProfile",
                    required: false,
                    order: [],
                    attributes: [],
                    where: {},
                }, {
                    datasource: "Stakeholder",
                    as: "reportedByProfile",
                    required: false,
                    order: [],
                    attributes: [],
                    where: {},

                }, {
                    datasource: "Session", as: "session", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "Tags", as: "tags", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "Product", as: "products", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "Team", as: "teams", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "RecordContext",
                    as: "recordcontext",
                    required: false,
                    order: [],
                    attributes: [],
                    where: {},
                    include: [{
                        datasource: "WorkspaceField",
                        as: "fielddetail",
                        required: false,
                        order: [],
                        attributes: [],
                        where: {},
                    },]
                }, {
                    datasource: "Statuses",
                    as: "currentstatusdetail",
                    required: false,
                    order: [],
                    attributes: ["statusName", "statusId"],
                    where: {},
                },],
            },
        }))
    }, [StakeholderId]);

    useEffect(() => {
        fetchRecord();
    }, [apiQuery]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/getRecords", apiQuery)
            .then((res) => {
                console.log(res.data);
                setRecordList(res.data.data);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    return (<div className="flex flex-col gap-4 ">
        <div className="flex items-center py-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost">
                        <Filter/>
                    </Button>
                </SheetTrigger>
                <SheetContent side={'bottom'} className="h-3/4">
                    <SheetHeader>
                        <SheetTitle>SETUP FILTERS</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                        <Separator />
<div>
<div className="grid grid-cols-3">
    <AssigneeModule intialValue={null}   />

</div>
</div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    onChange={(e) => {
                        const searchValue = e.target.value;
                        updateApiQuery("Record", {
                            where: searchValue && searchValue.length > 0 ? {recordId: `${searchValue}`} : {},
                        });
                    }}
                />
            </div>
        </div>
        {recordList?.results?.length > 0 ? <>

            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden sm:table-cell">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    fetchValueByDatasourceAndKey("Record", "order")[0][1] == "DESC" ? updateApiQuery("Record", {
                                        order: [["recordId", "ASC"]],
                                    }) : updateApiQuery("Record", {
                                        order: [["recordId", "DESC"]],
                                    });
                                }}
                            >
                                ID <ArrowDownUp className="ml-1 h-3.5 w-3.5"/>
                            </Button>
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            SUBJECT
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            ASSIGNEE
                        </TableHead>  <TableHead className="hidden sm:table-cell">PROPOSER

                        </TableHead>

                        <TableHead className="hidden sm:table-cell  ">
                            STATUS
                        </TableHead>


                        <TableHead className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    fetchValueByDatasourceAndKey("Record", "order")[0][1] == "DESC" ? updateApiQuery("Record", {
                                        order: [["rec_created_at", "ASC"]],
                                    }) : updateApiQuery("Record", {
                                        order: [["rec_created_at", "DESC"]],
                                    });
                                }}
                            >
                                CREATED ON <ArrowDownUp className="ml-2 h-3.5 w-3.5"/>
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recordList?.results?.map((a) => (<TableRow key={a.recordId}>
                        <TableCell className="text-center w-8  ">
                            <a
                                href={`/workspace/${WorkspaceId}/record/${a.recordId}?tab=record&limit=${limit}&offset=${offset}`}
                                target="_blank"
                            >
                                <div className="font-medium">{a.recordId}</div>
                            </a>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell w-1/3 break-words whitespace-pre-wrap ">
                            <Link to={`/workspace/${WorkspaceId}/record/${a.recordId}?tab=record&limit=${limit}&offset=${offset}`}>
                                   <span className="line-clamp-1" title={a.recordTitle}>
{a.recordTitle}                                    </span>
                            </Link>

                        </TableCell>


                        <TableCell className="hidden sm:table-cell p-2">

                                <div
                                    className="">

                                    <AssigneeModule intialValue={a?.assignedto} uiType={'Avatar'} recordId={a?.recordId}/>
                                </div>

                        </TableCell>


                        <TableCell
                            className="hidden sm:table-cell p-2 ">

                                <div
                                    className="">

                                    <AssigneeModule intialValue={a?.submittedByProfile} uiType={'Avatar'} recordId={a?.recordId} isEditable={false} />

                                </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <StatusModule initialStatus={a?.currentstatusdetail} possibleTransitions={a?.possiblestatusestransition} recordId={a?.recordId}/>

                        </TableCell>
                        <TableCell className="text-right">
                            {a.created_date} <br/>{a.created_time}                        </TableCell>
                    </TableRow>))}

                    {(recordList?.results?.length === 0) ? (<TableRow>
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
                <AlertTitle>No Records Found!</AlertTitle>
                <AlertDescription>
                    There are no records present in this workspace
                </AlertDescription>
            </Alert></>}


    </div>);
}

export default RecordTable;
