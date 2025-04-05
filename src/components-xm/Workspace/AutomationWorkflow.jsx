import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React from "react";
import TagsTable from "@/components-xm/Workspace/TagsTable.jsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CreateTags from "@/components-xm/Workspace/CreateTags.jsx";
import {Link} from "react-router-dom";
import CreateProduct from "@/components-xm/Workspace/CreateProduct.jsx";
import ProductsTable from "@/components-xm/Workspace/ProductsTable.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Terminal} from "lucide-react";

function AutomationWorkflow() {


    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Automation & Workflow</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center bg-muted/50">
                <CardTitle className="text-lg">Automation & Workflow</CardTitle>
                <div className="ml-auto sm:flex-initial">


                </div>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4">
                <Alert>
                    <Terminal className="h-4 w-4"/>
                    <AlertTitle>Coming Soon !</AlertTitle>
                    <AlertDescription>
                        Automation Workflow Feature is Coming Soon
                    </AlertDescription>
                </Alert>
             </div>
        </>)

}


export default AutomationWorkflow;