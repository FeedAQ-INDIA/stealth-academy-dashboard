import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";
import {Badge} from "@/components/ui/badge.jsx";

function CustomFieldConfigurationDetail() {

    const {WorkspaceId, ContextConfigurationId} = useParams();

    const [configDetail, setConfigDetail] = useState(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 5, offset: 0, getThisData: {
                    datasource: "ContextConfiguration", attributes: [], where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"),
                        contextConfigurationId: ContextConfigurationId
                    }, include: [{
                        datasource: "WorkspaceField", as: "workspacefields", order: [], attributes: [], where: {},
                    }, {
                        datasource: "User", as: "createdby", order: [], attributes: [], where: {},
                    },]
                },
            })
            .then((res) => {
                console.log(res.data);
                setConfigDetail(res?.data?.data?.results?.[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={`/workspace/${WorkspaceId}/views?tab=views`}>Workspace</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={`/workspace/${WorkspaceId}/settings/field-configuration?tab=field-configuration`}>Field
                                Configuration</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{configDetail?.contextConfigurationName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial">

            </div>
        </header>

        <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center rounded-none  bg-muted/50">
            <div>
            <CardTitle className="text-lg">{configDetail?.contextConfigurationName} -
                #{configDetail?.contextConfigurationId}</CardTitle>
            <CardDescription>Field Configuration Detail</CardDescription>
        </div>
            <div className="ml-auto sm:flex-initial">
                <Link
                    to={`/workspace/${WorkspaceId}/settings/field-configuration/${ContextConfigurationId}/edit?tab=field-configuration/`}>
                    <Button
                        className="h-8 gap-1 "
                    >Edit</Button>
                </Link>
            </div>
        </CardHeader>

        <div className="flex flex-col gap-4 p-4">
            <div className=" ">

                <Card className=" rounded-none  shadow-md my-4 ">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-normal">General Information</CardTitle>
                    </CardHeader>
                    <Separator className="mb-3"/>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                <p className="text-muted-foreground">Description</p>
                                <h5>{configDetail?.contextConfigurationDescription || "N/A"}</h5>
                            </div>

                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Status</p>
                                <h5>{configDetail?.contextConfigurationStatus || "N/A"}</h5>
                            </div>
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Created By</p>
                                <h5>{configDetail?.createdby?.firstName || "N/A"}</h5>
                            </div>
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Type</p>
                                <h5>{configDetail?.contextConfigurationType || "N/A"}</h5>
                            </div>

                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Created at</p>
                                <h5>{configDetail?.cxtconf_created_at ? new Date(configDetail.cxtconf_created_at).toLocaleString() : "N/A"}</h5>
                            </div>
                            <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                <p className="text-muted-foreground">Last updated at</p>
                                <h5>{configDetail?.cxtconf_updated_at ? new Date(configDetail.cxtconf_updated_at).toLocaleString() : "N/A"}</h5>
                            </div>
                        </div>


                    </CardContent>
                </Card>

                <Card className="  rounded-none  shadow-md  my-4">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-normal">Fields <Badge variant="outline"
                            className="ml-2 ">  {configDetail?.workspacefields?.length} Fields </Badge></CardTitle>
                    </CardHeader>
                    <Separator className="mb-3"/>
                    <CardContent>

                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden sm:table-cell"
                                    >
                                        KEY
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        LABEL
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        TYPE
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        STATUS
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        MANDATORY
                                    </TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {configDetail?.workspacefields?.map((a) => (<TableRow key={a.layoutId}>
                                    <TableCell className="hidden sm:table-cell font-medium">
                                        {a.fieldKey}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell font-medium">
                                        {a.fieldLabel}
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell  ">
                                        {a?.fieldType}
                                    </TableCell>
                                    <TableCell>
                                        <StatusView initialStatus={a?.fieldStatus}/>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell p-2">
                                        {a?.fieldIsMandatory.toString()}
                                    </TableCell>


                                </TableRow>))}

                                {(configDetail?.workspacefields?.length === 0) ? (<TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className=" table-cell text-center py-4 italic	"
                                    >
                                        No Data Found
                                    </TableCell>
                                </TableRow>) : (<></>)}
                            </TableBody>

                        </Table>


                        {/*{configDetail?.workspacefields?.map(a => (*/}
                        {/*    <Accordion className="border my-2 " type="single" collapsible>*/}
                        {/*        <AccordionItem value={`item-1`}>*/}
                        {/*            <AccordionTrigger className=" hover:no-underline hover:bg-muted/50 px-3 py-2 ">*/}
                        {/*                <div className="flex gap-2 items-center">*/}
                        {/*                    <span className="truncate">{a?.fieldLabel}</span>*/}
                        {/*                    <Button variant="secondary" size="sm">{a?.fieldType}</Button>*/}
                        {/*                </div>*/}
                        {/*            </AccordionTrigger>*/}


                        {/*            <AccordionContent className="px-3">*/}
                        {/*                <div className="grid grid-cols-4 gap-2 mb-2">*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  col-span-2">*/}
                        {/*                        <p className="text-muted-foreground">Field Label</p>*/}
                        {/*                        <h5>{a?.fieldLabel || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  col-span-2">*/}
                        {/*                        <p className="text-muted-foreground">Field Key</p>*/}
                        {/*                        <h5>{a?.fieldKey || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1 col-span-4">*/}
                        {/*                        <p className="text-muted-foreground">Tooltip Text</p>*/}
                        {/*                        <h5>{a?.fieldToolTipText || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  ">*/}
                        {/*                        <p className="text-muted-foreground">Field Type</p>*/}
                        {/*                        <h5>{a?.fieldType || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  ">*/}
                        {/*                        <p className="text-muted-foreground">Status</p>*/}
                        {/*                        <h5>{a?.fieldStatus || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  ">*/}
                        {/*                        <p className="text-muted-foreground">Is Manadatory ?</p>*/}
                        {/*                        <h5>{String(a?.fieldIsMandatory) || "N/A"}</h5>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="border-none  rounded-1 hover:bg-muted/50 p-1  ">*/}
                        {/*                        <p className="text-muted-foreground">Field Options</p>*/}
                        {/*                        <h5>{a?.fieldOption || "N/A"}</h5>*/}
                        {/*                    </div>*/}

                        {/*                </div>*/}

                        {/*            </AccordionContent>*/}
                        {/*        </AccordionItem>*/}
                        {/*    </Accordion>))}*/}
                    </CardContent>
                </Card>


            </div>
        </div>
    </>)


}


export default CustomFieldConfigurationDetail;