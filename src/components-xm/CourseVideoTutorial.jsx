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
                    <div className=" flex  items-center gap-2 ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                            What is Java ?
                        </CardTitle>
                        <div className="ml-auto flex gap-2">
                            <Button>Previous</Button> <Button>Next</Button>
                        </div>
                    </div>


                </section>

                <section className="my-8 ">

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Video container */}
                        <div className="w-full md:w-2/3">
                            <div className="w-full aspect-video">
                                <iframe
                                    id="player"
                                    src="https://www.youtube.com/embed/_WNIvJozdMY?enablejsapi=1"
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Side panel */}
                        <div className="w-full md:w-1/3 bg-gray-100 p-4 flex items-center justify-center">
                            <p className="overflow-y-auto h-full"> This content box will match the video height on
                                larger screens.</p>

                        </div>


                    </div>


                </section>
                <section className="my-8">
                    <h1 className="text-lg   font-medium ">Note Book</h1>
                    <div className="grid w-full gap-2 my-4">
                        <Textarea className="" placeholder="Type your notes here."/>
                        <Button className="w-fit ml-auto">Save</Button>
                    </div>
                </section>
            </div>

        </>)

}


export default CourseVideoTutorial;