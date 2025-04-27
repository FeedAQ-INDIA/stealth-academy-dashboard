import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Badge} from "@/components/ui/badge.jsx";
 import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import AudioRecorder from "@/components-xm/Modules/AudioRecorder.jsx";
import {Link} from "react-router-dom";

function CourseComprehensionReading() {


    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        <BreadcrumbItem>
                            <BreadcrumbPage><Link to={`/explore`}>Course</Link></BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-6">
                <section>
                    <div className="flex flex-wrap gap-2 w-full mb-3 justify-items-center">
                        <Badge variant="outline">Reading</Badge>

                    </div>

                    {/* Title with responsive spacing */}
                    <div className=" flex  items-center gap-2 ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold ">
                            Comprehension Reading
                        </CardTitle>
                        <div className="ml-auto flex gap-2">
                            <Button>Previous</Button> <Button>Next</Button>
                        </div>
                    </div>


                </section>

                <section className="my-8 ">

                    <div className="flex  ">

                        {/* Side panel */}
                        <div className="w-full  bg-gray-100 p-4 flex items-center justify-center">
                            <p className="overflow-y-auto h-full">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic pariatur quia vel? Accusamus amet autem commodi consequuntur dolor dolore dolorum, ea est eum fuga fugit in itaque nam nihil quaerat quam quasi quidem quod ratione reprehenderit sit soluta velit. Ad adipisci aliquam consequuntur culpa cupiditate deleniti distinctio, dolore dolorem dolorum est et expedita facere harum hic impedit inventore laboriosam libero magni maiores maxime natus nobis non nostrum odit officia quae, quibusdam quis, quisquam ratione reprehenderit rerum saepe sapiente sint sunt tempora temporibus voluptate! Alias autem dicta distinctio expedita laboriosam, neque nisi nostrum quasi reiciendis rem sed tempore voluptates. Adipisci debitis dolor dolore doloribus ducimus eaque error ex facere fuga iusto maiores minus omnis placeat quas quisquam quos, sed unde voluptates. Aliquam eaque officia quod. Assumenda ea earum ex illum impedit nesciunt placeat recusandae temporibus. Aliquam animi architecto assumenda atque blanditiis, cumque deserunt dolore dolores eaque ex explicabo illum impedit inventore labore laboriosam maiores maxime minima natus neque nesciunt obcaecati officiis quaerat quam quas quod rem repellendus repudiandae sed sint veritatis. Animi beatae blanditiis corporis cumque dignissimos distinctio eius ex expedita harum incidunt ipsa magnam maiores maxime, nemo similique suscipit vel. Cumque dolore excepturi laboriosam modi mollitia optio rerum. Animi, voluptas.
                            </p>

                        </div>


                    </div>


                </section>
                <section className="my-8">
                    <AudioRecorder/>
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


export default CourseComprehensionReading;