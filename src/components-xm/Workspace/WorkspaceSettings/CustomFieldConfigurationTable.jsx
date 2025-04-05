import React, {useEffect, useState} from "react";
import {ArrowDownUp, ChevronLeft, ChevronRight, Filter, MoreHorizontal, Search, Terminal} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";

function CustomFieldConfigurationTable() {
    const {WorkspaceId} = useParams();
    const navigate = useNavigate();

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [storedDate, setStoredDate] = useState({
        from: localStorage.getItem("searchStartwindow"), to: localStorage.getItem("searchEndwindow"),
    });

    const [configList, setConfigList] = useState({});

    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "ContextConfiguration",  attributes: [], where: {
                workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
             }, include: [{
                datasource: "WorkspaceField", as: "workspacefields", order: [], attributes: [], where: {},
            },]
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
        console.log("UseEffect");
        // const fetchDate = () => {
        //     console.log(
        //         localStorage.getItem("searchStartwindow"),
        //         localStorage.getItem("searchEndwindow")
        //     );
        //     setStoredDate({
        //         from: localStorage.getItem("searchStartwindow"),
        //         to: localStorage.getItem("searchEndwindow"),
        //     });
        //     apiQuery.getThisData.where.team_created_at.$between = [
        //         new Date(localStorage.getItem("searchStartwindow"))?.toISOString(),
        //         new Date(localStorage.getItem("searchEndwindow"))?.toISOString(),
        //     ];
        // };
        // fetchDate();
        // const handleStorageChange = () => {
        //     console.log("Time changed");
        //     fetchDate();
        // };
        // window.addEventListener("dateChanged", handleStorageChange);
    }, []);

    // useEffect(() => {
    //     fetchRecord();
    // }, [storedDate]);

    useEffect(() => {
        fetchRecord();
    }, [apiQuery]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setConfigList(res.data.data);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteContextConfiguration = (item) => {
        axiosConn
            .post("http://localhost:3000/deleteContextConfiguration",
                {
                    workspaceId : WorkspaceId, orgId : localStorage.getItem('currentOrg'),
                    contextConfigId: item?.contextConfigurationId, contextConfigFlow : item?.contextConfigurationStatus
                })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: res.data?.data?.message
                })
                fetchRecord()
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<div className="flex flex-col gap-4 ">
        <div className="flex items-center py-4">
            <Button variant="ghost">
                <Filter/>
            </Button>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"

                    onChange={(e) => {
                        const searchValue = e.target.value;
                        updateApiQuery("ContextConfiguration", {
                            where: searchValue ? {
                                contextConfigurationName: {
                                    $like: `%${searchValue}%`,
                                },
                            } : {},
                        });
                    }}
                />
            </div>
        </div>
        {configList?.results?.length > 0 ? <>

            <Table className="border">
                <TableHeader>
                    <TableRow>

                        <TableHead className="hidden sm:table-cell">
                            CONFIG NAME
                        </TableHead>
                        <TableHead className=" ">

                            CONFIG TYPE
                        </TableHead>
                        <TableHead className=" ">

                                STATUS
                         </TableHead>

                        <TableHead className="text-right">ACTIONS</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configList?.results?.map((a) => (<TableRow key={a.contextConfigurationId}>

                        <TableCell className=" w-1/3 break-words whitespace-pre-wrap ">
                                    <span className="line-clamp-1  font-medium" title="Dadadad">
                                         {a?.contextConfigurationName}
                                    </span>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell">
                            {a?.contextConfigurationType}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <StatusView initialStatus={a?.contextConfigurationStatus}/>
                         </TableCell>



                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={()=> navigate(`/workspace/${WorkspaceId}/settings/field-configuration/${a.contextConfigurationId}?tab=field-configuration/`)}>
                                        View

                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=> navigate(`/workspace/${WorkspaceId}/settings/field-configuration/${a.contextConfigurationId}/edit?tab=field-configuration/`)}>
                                        Edit

                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={()=>deleteContextConfiguration(a)}
                                    >
                                        Delete
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>))}

                    {(configList?.results?.length === 0) ? (<TableRow>
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
            </Table> </> : <>
            <Alert>
                <Terminal className="h-4 w-4"/>
                <AlertTitle>No Records Found!</AlertTitle>
                <AlertDescription>
                    There are no teams present in this workspace
                </AlertDescription>
            </Alert></>}


    </div>);
}

export default CustomFieldConfigurationTable;
