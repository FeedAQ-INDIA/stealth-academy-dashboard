import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleDollarSign, Clock} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";

function CourseVideoTutorial() {


    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage>Course</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-6">
                <section>
                    <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                        <Badge variant="outline">Video</Badge>

                    </div>

                    {/* Title with responsive spacing */}
                    <div className=" ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                            What is Java ?
                        </CardTitle>
                    </div>


                </section>
            </div>

        </>)

}


export default CourseVideoTutorial;