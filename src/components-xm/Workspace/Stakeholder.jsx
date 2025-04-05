import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage,} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import React from "react";
import {Link, useParams} from "react-router-dom";
import StakeholderTable from "./StakeholderTable.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Terminal} from "lucide-react";

function Stakeholder() {
    const {WorkspaceId, RepositoryId} = useParams();

    return (<div>
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Stakeholder</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial"></div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
                <div className=" ">
                    <CardTitle className="text-lg">Stakeholder</CardTitle>
                    <CardDescription>Reach to mass audience</CardDescription>
                </div>
                <div className=" md:ml-auto flex items-center gap-1">
                    <Button
                        className="h-8 gap-1 "
                    >Add Stakeholder</Button>
                </div>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4 ">

                {/*<Alert>*/}
                {/*    <Terminal className="h-4 w-4" />*/}
                {/*    <AlertTitle>Add context about your stakeholders!</AlertTitle>*/}
                {/*    <AlertDescription>*/}
                {/*        You can now add custom detail fields to your stakeholder profiles. To get started, create your fields in “<Link className="text-blue-600" to="">Manage details</Link>”*/}
                {/*    </AlertDescription>*/}
                {/*</Alert>*/}

                <StakeholderTable/>
            </div>
        </div>)

        ;
}

export default Stakeholder;
