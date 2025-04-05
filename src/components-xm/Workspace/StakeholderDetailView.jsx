import {ChevronLeft, ChevronRight, Copy,} from "lucide-react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import RecordTable from "./RecordTable.jsx";
import StakeholderComment from "./StakeholderComment.jsx";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import ProductsSearchModule from "@/components-xm/Workspace/Modules/ProductsSearchModule.jsx";
import TagSearchModule from "@/components-xm/Workspace/Modules/TagSearchModule.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import MultiSelectField from "@/components-xm/Workspace/Modules/MultiSelectField.jsx";
import * as _ from "lodash";
import StakeholderContext from "@/components-xm/Workspace/StakeholderContext.jsx";
 import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import StatusModule from "@/components-xm/Workspace/Modules/StatusModule.jsx";
import {Pagination, PaginationContent, PaginationItem} from "@/components/ui/pagination.jsx";
import RecordDetail from "@/components-xm/Workspace/RecordDetail.jsx";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import StakeholderDetail from "@/components-xm/Workspace/StakeholderDetail.jsx";



function StakeholderDetailView() {
    const {WorkspaceId, StakeholderId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);


    const [profileList, setProfileList] = useState([]);


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
        setApiQuery({
            limit: limit, offset: offset, getThisData: {
                datasource: "Stakeholder", order: [["stkhld_created_at", "DESC"]], attributes: [], where: {
                    orgId: localStorage.getItem("currentOrg"),

                }, include: [{
                    datasource: "Record", as: "submittedbyrecords", required: true, order: [], attributes: [], where: {
                        ...(WorkspaceId && {workspaceId: WorkspaceId}),
                    },
                },],
            },
        })
    }, [ StakeholderId, WorkspaceId]);


    useEffect(() => {
        fetchRecord();
    }, [apiQuery]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setProfileList(res.data.data?.results);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar,
    } = useSidebar()

    useEffect(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const limit = params.get("limit");
        const offset = params.get("offset");

        if(limit && offset) {
            setLimit(parseInt(limit));
            setOffset(parseInt(offset))
        }
    }, [location]);


    return (<div  className="h-[calc(100svh-4em)]" style={{overflowY: 'hidden'}}>
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link
                                to={`/workspace/${WorkspaceId}/stakeholder?tab=stakeholder`}>Stakeholder</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage> Stakeholder Detail </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </header>


        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[200px]  rounded-lg border w-full"
        >
            <ResizablePanel defaultSize={20}>
                <div className="col-span-1 bg-muted/50 border-r h-[calc(100svh-7em)] overflow-y-auto p-3">
                    <Select value="all">
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stakeholder</SelectItem>

                        </SelectContent>
                    </Select>
                    <div className="mt-4 flex flex-col gap-2">
                        {profileList?.map(a => (
                            <Card className={`hover:shadow-md rounded-1 cursor-pointer ${StakeholderId == a.stakeholderId ? 'border-2 border-blue-800  shadow-md' : ''}`}
                                  onClick={()=>navigate(`/workspace/${WorkspaceId}/stakeholder/${a.stakeholderId}?tab=stakeholder&limit=${limit}&offset=${offset}`)}>
                                <CardHeader className="p-2"><h3 className="text-sm font-medium">{a?.derivedUserName}</h3>
                                </CardHeader>
                                <CardContent className=" flex flex-col gap-1 p-2 text-xs">
                                    <p>{a?.email}</p>
                                    <p>{a?.number}</p>
                                    <p className="text-muted-foreground">Stakeholder Id : #{a?.stakeholderId}</p>
                            </CardContent>
                            </Card>
                        ))}
                        <div className="my-3">
                            <div className="flex flex-row items-center">
                                <div className="text-xs text-muted-foreground">
                                    ( {parseInt(offset) + 1} to {Math.min(offset + limit, totalCount)} )  of {totalCount} items
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
                        </div>

                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
                <div  className="col-span-4 h-[calc(100svh-6em)] overflow-y-auto">
                    <StakeholderDetail/>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>


    </div>);
}

export default StakeholderDetailView;
