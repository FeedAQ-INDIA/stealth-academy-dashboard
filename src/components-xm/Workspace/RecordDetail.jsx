import React, {useEffect, useState} from "react";

import {Badge} from "@/components/ui/badge.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useSidebar} from "@/components/ui/sidebar.jsx";
import RecordComment from "@/components-xm/Workspace/RecordComment.jsx";
import TagSearchModule from "@/components-xm/Workspace/Modules/TagSearchModule.jsx";
import ProductsSearchModule from "@/components-xm/Workspace/Modules/ProductsSearchModule.jsx";
import StatusModule from "@/components-xm/Workspace/Modules/StatusModule.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import TeamSearchModule from "@/components-xm/Workspace/Modules/TeamSearchModule.jsx";
import {Button} from "@/components/ui/button.jsx";
import WatcherSearchModule from "@/components-xm/Workspace/Modules/WatcherSearchModule.jsx";
import {CircleDot, Terminal, UserRound} from "lucide-react";
import RecordLink from "@/components-xm/Workspace/RecordLink.jsx";
import RecordContext from "@/components-xm/Workspace/RecordContext.jsx";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import RecordInteraction from "@/components-xm/Workspace/RecordInteraction.jsx";
import JsonParserUI from "@/components-xm/Workspace/Modules/JsonParserUI.jsx";

function RecordDetail() {
    const navigate = useNavigate();

    const {WorkspaceId, RecordId} = useParams();

    const [recordDetail, setRecordDetail] = useState({});


    const [apiQuery, setApiQuery] = useState({
        limit: 10, offset: 0, getThisData: {
            datasource: "Record", order: [], attributes: [], where: {
                recordId: RecordId, orgId: localStorage.getItem("currentOrg"), workspaceId: WorkspaceId,
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
        setApiQuery((prevQuery) => ({
            ...prevQuery, getThisData: {
                ...prevQuery.getThisData, where: {
                    ...prevQuery.getThisData.where,
                    recordId: RecordId,
                    orgId: localStorage.getItem("currentOrg"),
                    workspaceId: WorkspaceId,
                },
            },
        }));

    }, [RecordId, WorkspaceId]);

    useEffect(() => {

        fetchRecord();

    }, [apiQuery]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/getRecords", apiQuery)
            .then((res) => {
                console.log(res.data?.data?.results[0]);

                setRecordDetail(res.data?.data?.results?.[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar()

    useEffect(() => {
        setOpen(false);
    }, []);


    useEffect(() => {
        console.log("layoutId :: ", recordDetail?.layoutId)
        if (recordDetail) {
            fetchRecordContextAssociation()
        }
    }, [recordDetail]);

    const [contextConfig, setContextConfig] = useState([]);

    const fetchRecordContextAssociation = () => {
        console.log(recordDetail?.layoutId);
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "LayoutContextConfig",
                    // attributes: ["contextConfigurationId"],
                    where: {layoutId: recordDetail?.layoutId},
                    include:[
                        {
                            datasource: 'ContextConfiguration',
                            as: 'configdetail'
                        }
                    ]
                },
            })
            .then((res) => {
                const fetchedData = res.data?.data?.results || [];
                console.log("fetchRecordContextAssociation", fetchedData)
                const contextConfigList = fetchedData?.map(item => item.configdetail)
                console.log("contextConfig :: ",  contextConfigList?.map(a => a?.contextConfigurationId))
                setContextConfig(contextConfigList);
            })
            .catch((err) => console.log(err));
    };


    return (<div>

        <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                    {recordDetail?.recordTitle} -

                </CardTitle>
                <CardDescription>
                    RECORD ID : #{recordDetail?.recordId}
                </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">


            </div>
        </CardHeader>

        <div className="p-4">

            <div className="grid grid-cols-1 md:grid-cols-6  gap-4">
                <div className="col-span-4">
                    <Card className="rounded-none my-4 shadow-md">
                        <CardHeader className="bg-muted/50">

                            <CardTitle className="text-lg font-normal">General Information</CardTitle>
                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div
                                    className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-1 md:col-span-2 lg:col-span-3">
                                    <div className="gap-2 flex items-center">
                                        <p className="text-muted-foreground">Subject </p>
                                        <span className="text-xs text-white font-medium rounded-sm bg-gradient-to-r from-purple-500 to-pink-500 py-0.5 px-1 text-black">AI GEN</span>
                                    </div>                                    <h5>{recordDetail?.recordTitle || "N/A"}</h5>
                                </div>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-1 md:col-span-2 lg:col-span-3">
                                               <div className="gap-2 flex items-center">
                                                   <p className="text-muted-foreground">Description </p>
                                                   <span className="text-xs text-white font-medium rounded-sm bg-gradient-to-r from-purple-500 to-pink-500 py-0.5 px-1 text-black">AI GEN</span>
                                               </div>
                                                <h5 className="overflow-hidden text-ellipsis line-clamp-4">
                                                    {recordDetail?.recordDescription || "N/A"}                                                </h5>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="flex flex-col w-fit max-w-80 max-h-80 overflow-y-auto p-4">
                                            <h5 className="font-medium">Description</h5>
                                            <p className="text-justify text-ellipsis ">
                                                {recordDetail?.recordDescription || "N/A"}                                            </p>
                                            <div className="flex gap-2 ml-auto">
                                                <Button size={"sm"} variant="secondary"
                                                        className="rounded-none text-xs font-normal hover:shadow-sm text-muted-foreground">
                                                    Edit</Button>

                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>


                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Record Id</p>
                                    <h5>#{recordDetail?.recordId || "N/A"}</h5>
                                </div>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="border-none rounded-1 hover:bg-muted/50 p-2  cursor-pointer">
                                            <p className="text-muted-foreground">
                                                Reporter
                                            </p>
                                            <h5>{recordDetail?.reportedByProfile?.derivedUserName || "N/A"}</h5>
                                        </div>

                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-fit max-w-80  z-[52]">
                                        <div className="flex  space-x-4">
                                            <Avatar>
                                                <AvatarFallback>{recordDetail?.reportedByProfile?.nameInitial ||
                                                    <UserRound strokeWidth={1}/>}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{recordDetail?.reportedByProfile?.derivedUserName}</h4>
                                                <p className="text-xs font-medium text-muted-foreground">                  {recordDetail?.reportedByProfile?.email}<br/>
                                                    {recordDetail?.reportedByProfile?.number}</p>
                                                {/*<p className="text-sm line-clamp-2">*/}
                                                {/*    {workspaceData?.description}*/}
                                                {/*</p>*/}

                                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {recordDetail?.reportedByProfile?.created_date}
                                      </span>
                                                </div>
                                                <div className="items-start pt-2">
                                                    <Link
                                                        to={`/workspace/${WorkspaceId}/stakeholder/${recordDetail?.reportedByProfile?.stakeholderId}?tab=stakeholder&limit=10&offset=0`}>
                                                        <Button size={"sm"} variant="secondary"
                                                                className="rounded-none text-xs font-normal hover:shadow-sm text-muted-foreground">
                                                            View Profile
                                                        </Button>

                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="border-none rounded-1 hover:bg-muted/50 p-2 cursor-pointer">
                                            <p className="text-muted-foreground">
                                                Submitted By
                                            </p>
                                            <h5>{recordDetail?.submittedByProfile?.derivedUserName || "N/A"}</h5>
                                        </div>

                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-fit max-w-80  z-[52]">
                                        <div className="flex  space-x-4">
                                            <Avatar>
                                                <AvatarFallback>{recordDetail?.submittedByProfile?.nameInitial ||
                                                    <UserRound strokeWidth={1}/>}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{recordDetail?.submittedByProfile?.derivedUserName}</h4>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {recordDetail?.submittedByProfile?.email}<br/>
                                                    {recordDetail?.submittedByProfile?.number}
                                                </p>
                                                {/*<p className="text-sm line-clamp-2">*/}
                                                {/*    {workspaceData?.description}*/}
                                                {/*</p>*/}

                                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {recordDetail?.submittedByProfile?.created_date}
                                      </span>
                                                </div>
                                                <div className="items-start pt-2">
                                                    <Link
                                                        to={`/workspace/${WorkspaceId}/stakeholder/${recordDetail?.submittedByProfile?.stakeholderId}?tab=stakeholder&limit=10&offset=0`}>
                                                        <Button size={"sm"} variant="secondary"
                                                                className="rounded-none text-xs font-normal hover:shadow-sm text-muted-foreground">
                                                            View Profile
                                                        </Button>

                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{recordDetail?.rec_created_at ? new Date(recordDetail.rec_created_at).toLocaleString() : "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{recordDetail?.rec_updated_at ? new Date(recordDetail.rec_updated_at).toLocaleString() : "N/A"}</h5>
                                </div>


                            </div>

                        </CardContent>
                    </Card>

                    {(contextConfig || [])?.filter(a=> a.contextConfigurationType == 'RECORD DATA')?.map((a) => (
                        <RecordContext
                            key={a?.contextConfigurationId}
                            contextConfigId={a.contextConfigurationId}
                        />
                    ))}


                    <RecordInteraction/>

                    <RecordLink/>

                    {RecordId && WorkspaceId ? (<RecordComment
                        recordId={RecordId}
                        workspaceId={WorkspaceId}
                        commentSource="Comment"
                    />) : (<></>)}
                </div>

                <div className="col-span-2">
                    <Card className="my-4 rounded-none  shadow-md">
                        <CardHeader>

                        </CardHeader>
                        <CardContent>

                            <div className="mb-3">
                                <p className="text-muted-foreground mb-2">Status</p>
                                <StatusModule initialStatus={recordDetail?.currentstatusdetail}
                                              possibleTransitions={recordDetail?.possiblestatusestransition}/>
                            </div>


                            <div className="my-3">
                                <p className="text-muted-foreground mb-2">Assignee</p>
                                <AssigneeModule intialValue={recordDetail?.assignedto}/>

                            </div>

                            <div className="my-3">
                                <p className="text-muted-foreground mb-2">Tags</p>
                                <TagSearchModule initialValue={recordDetail?.tags}/>

                            </div>

                            <div className="my-3">
                                <p className="text-muted-foreground mb-2">Products</p>
                                <ProductsSearchModule initialValue={recordDetail?.products}/></div>

                            <div className="my-3">
                                <p className="text-muted-foreground mb-2">Teams</p>
                                <TeamSearchModule initialValue={recordDetail?.teams}/></div>

                            <div className="my-3">
                                <p className="text-muted-foreground mb-2 flex items-center gap-1">
                                    <CircleDot color="#00d636" size={18}/>
                                    Viewers &  <CircleDot color="#020aed"  size={18}/> Watchers
                                </p>
                                <WatcherSearchModule initialValue={recordDetail?.recordwatcherdetail}/>
                            </div>

                        </CardContent>
                    </Card>

                    {(contextConfig || [])?.filter(a=> a.contextConfigurationType != 'RECORD DATA')?.map((a) => (
                        <RecordContext
                            key={a?.contextConfigurationId}
                            contextConfigId={a.contextConfigurationId}
                        />
                    ))}

                    <Card className="my-4 rounded-none  shadow-md">
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg font-normal">Attachments</CardTitle>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="py-3">
                            {  <>
                                <Alert>
                                    <Terminal className="h-4 w-4"/>
                                    <AlertTitle>No Attachment Exist !</AlertTitle>
                                    <AlertDescription>
                                        There are no attachment present for this record
                                    </AlertDescription>
                                </Alert></>}

                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>

    </div>);
}

export default RecordDetail;
