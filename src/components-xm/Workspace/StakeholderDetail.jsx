import {Copy,} from "lucide-react";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import React, {useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import {Link, useNavigate, useParams} from "react-router-dom";
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
import RecordContext from "@/components-xm/Workspace/RecordContext.jsx";

function StakeholderDetail() {
    const {WorkspaceId, StakeholderId} = useParams();
    const navigate = useNavigate();



    const [profileDetail, setProfileDetail] = useState({});
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
            limit: 10, offset: 0, getThisData: {
                datasource: "Stakeholder", order: [], attributes: [], where: {
                    ...(StakeholderId && {stakeholderId: StakeholderId}), orgId: localStorage.getItem("currentOrg"),
                }, include: [{
                    datasource: "Record", as: "submittedbyrecords", required: false, order: [], attributes: [],
                }, {
                    datasource: "StakeholderMetadata",
                    as: "stakeholdermetadata",
                    required: false,
                    order: [],
                    attributes: [],
                }, {
                    datasource: "StakeholderExternalIdentifier",
                    as: "externalIdentifiers",
                    required: false,
                    order: [],
                    attributes: [],
                }, {
                    datasource: "Tags", as: "tags", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "Product", as: "products", required: false, order: [], attributes: [], where: {},
                }, {
                    datasource: "StakeholderContext",
                    as: "stakeholdercontext",
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
                },],
            },
        });

    }, [ StakeholderId, WorkspaceId]);


    useEffect(() => {
        fetchRecord();
    }, [apiQuery]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setProfileDetail(res.data?.data?.results[0]);

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
        console.log("layoutId :: ", profileDetail?.layoutId)
        if(profileDetail){
            fetchStakeholderContextAssociation()
        }
    }, [profileDetail]);

    const [contextConfigId, setContextConfigId] = useState([]);

    const fetchStakeholderContextAssociation = () => {
        console.log(profileDetail?.layoutId);
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "LayoutContextConfig", attributes: ["contextConfigurationId"], where: {layoutId: profileDetail?.layoutId},
                },
            })
            .then((res) => {
                const fetchedData = res.data?.data?.results || [];
                console.log("fetchRecordContextAssociation", fetchedData)
                setContextConfigId(fetchedData.map(item => item?.contextConfigurationId));
            })
            .catch((err) => console.log(err));
    };



    return (<div>
        <CardHeader className="flex flex-row gap-2 items-center bg-muted/50">

            <div className="flex gap-0.5 items-center gap-4">
                <Avatar className="mx-auto h-10 w-10 md:h-14 md:w-14 shadow-md">
                    <AvatarFallback className="text-lg md:text-md">
                        {profileDetail?.nameInitial}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="group flex items-center gap-2 text-lg">

                        {profileDetail?.firstName} - <span className="text-muted-foreground">#{StakeholderId}</span>
                        {/*<Badge>Customer</Badge>*/}
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Copy className="h-3 w-3"/>
                            <span className="sr-only">Copy Order ID</span>
                        </Button>
                    </CardTitle>
                    <CardDescription>Stakeholder Detail </CardDescription></div>
            </div>
        </CardHeader>
        <div className="p-4">

            <div className="grid grid-cols-1 md:grid-cols-6  gap-4">
                <div className="col-span-4">

                        {/*<div className="items-center my-7">*/}
                        {/*    <Avatar className="mx-auto h-16 w-16 md:h-28 md:w-28 shadow-md">*/}
                        {/*        <AvatarFallback className="text-lg md:text-3xl">*/}
                        {/*            {profileDetail?.nameInitial}*/}
                        {/*        </AvatarFallback>*/}
                        {/*    </Avatar>*/}
                        {/*</div>*/}

                        <Card className="rounded-none my-4 shadow-md">
                            <CardHeader className="bg-muted/50">

                                <CardTitle className="text-lg font-normal">General Information</CardTitle>
                            </CardHeader>
                            <Separator className="mb-3"/>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div
                                        className="border-none rounded-1 hover:bg-muted/50 p-2  ">
                                        <p className="text-muted-foreground">Stakeholder Id</p>
                                        <h5># {profileDetail?.stakeholderId}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">First Name</p>
                                        <h5> {profileDetail?.firstName || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">
                                            Last Name
                                        </p>
                                        <h5>{profileDetail?.lastName || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">
                                            Email
                                        </p>
                                        <h5>{profileDetail?.email || "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">
                                            Contact
                                        </p>
                                        <h5>{profileDetail?.contact || "N/A"}</h5>
                                    </div>

                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Created at</p>
                                        <h5>{profileDetail?.stkhld_created_at ? new Date(profileDetail.stkhld_created_at).toLocaleString() : "N/A"}</h5>
                                    </div>
                                    <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                        <p className="text-muted-foreground">Last updated at</p>
                                        <h5>{profileDetail?.stkhld_updated_at ? new Date(profileDetail.stkhld_updated_at).toLocaleString() : "N/A"}</h5>
                                    </div>


                                </div>

                            </CardContent>
                        </Card>


                        <Card className=" rounded-none my-4  shadow-md">
                            <CardHeader className="font-semibold bg-muted/50">
                                <CardTitle className="text-lg font-normal">Record History</CardTitle>
                            </CardHeader>
                            <Separator className="mb-3"/>

                            <CardContent>
                                <RecordTable/>
                            </CardContent>
                        </Card>

                        {StakeholderId && WorkspaceId ? (<StakeholderComment
                            recordId={StakeholderId}
                            workspaceId={WorkspaceId}
                            commentSource="StakeholderComment"
                        />) : (<></>)}
                 </div>

                <div className="col-span-2" >
                    <Card className="my-4 rounded-none  shadow-md">
                        <CardHeader>

                        </CardHeader>
                        <CardContent>


                            <div className="mb-3">
                                <p className="text-muted-foreground mb-3">Tags</p>
                                <TagSearchModule initialValue={profileDetail?.tags}/>

                            </div>

                            <div className="my-3">
                                <p className="text-muted-foreground mb-3">Products</p>
                                <ProductsSearchModule initialValue={profileDetail?.products}/></div>

                        </CardContent>
                    </Card>

                     {contextConfigId?.map(a => (<StakeholderContext contextConfigId={a}/>))}

                </div>
            </div>


         </div>
    </div>);
}

export default StakeholderDetail;
