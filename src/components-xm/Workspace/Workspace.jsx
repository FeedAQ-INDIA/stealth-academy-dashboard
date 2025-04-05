import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, Search, Terminal,} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {Link} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";
import {Avatar} from "@/components/ui/avatar.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table.jsx"
import {useAuthStore} from "@/zustland/store.js";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";


function Workspace() {
    const {toast} = useToast();
    const [workspaceList, setWorkspaceList] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(6);
    const [offset, setOffset] = useState(0);
    const {  userDetail } = useAuthStore();


    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, "getThisData": {
            "datasource": "Workspace", "order": [["w_created_at", "DESC"]], "attributes": [], "where": {
                "orgId": localStorage.getItem("currentOrg")
            }, "include": [{
                "datasource": "WorkspaceMetadata",
                "as": "workspacemetadata",
                "required": false,
                "order": [[]],
                "attributes": [],
                "where": {}
            }, {
                "datasource": "User", "as": "managedby", "required": false, "order": [[]], "attributes": [], "where": {}
            }, {
                "datasource": "User", "as": "createdby", "required": false, "order": [[]], "attributes": [], "where": {}
            }, {
                "datasource": "WorkspaceUser",
                "as": "workspaceusers",
                "required": false,
                "order": [[]],
                "attributes": [],
                "where": {
                    "userId": userDetail?.userId,
                }
            }

            ]
        }
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
        console.log(fetchValueByDatasourceAndKey("Workspace", "order")[0][1]);
        console.log(userDetail)
        if (userDetail && userDetail.userId) {

            fetchWorkspace();
        }
    }, [apiQuery, userDetail]);


    const fetchWorkspace = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setWorkspaceList(res.data.data?.results);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (<div className="p-4 sm:p-10">
        <Card className="rounded-none shadow-md">

            <CardHeader className="grid grid-cols-2 gap-2 items-center bg-muted/50">
                <CardTitle>Workspaces</CardTitle>
                <div className=" ml-auto">
                    <Link to={`/createworkspace`}>
                        <Button size="sm">Create Workspace</Button></Link>
                </div>

            </CardHeader>
            <CardContent>
                <div className="flex items-center py-4">
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            onChange={(e) => {
                                updateApiQuery("Workspace", {
                                    where: {
                                        name: {
                                            $like: `%${e.target.value}%`,
                                        },
                                    },
                                });
                            }}
                            className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                </div>

                {workspaceList?.length > 0 ? <>
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                {/*<TableHead className="w-[100px]">KEY</TableHead>*/}
                                <TableHead>WORKSPACE</TableHead>
                                <TableHead>MANAGED BY</TableHead>
                                <TableHead className="text-right">STATUS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workspaceList?.map((a) => (<TableRow>
                                {/*<TableCell className="font-medium"> {a.workspaceId} </TableCell>*/}
                                <TableCell className="font-medium">
                                    <Link to={`/workspace/${a.workspaceId}`}
                                       onClick={() => localStorage.setItem("activeWorkspace", a?.workspaceId)}>
                                    {a.name}</Link>
                                </TableCell>

                                <TableCell>
                                    <AssigneeModule intialValue={a?.managedby} uiType={'Avatar'} isEditable={false}/>

                                </TableCell>
                                <TableCell className="text-right"> <StatusView initialStatus={a?.status}/>
                                </TableCell>
                            </TableRow>))}
                            {(workspaceList?.results?.length === 0) ? (<TableRow>
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


            </CardContent>
        </Card></div>);
}

export default Workspace;
