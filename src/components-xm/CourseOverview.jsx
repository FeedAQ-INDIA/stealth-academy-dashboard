import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleDollarSign, Clock} from "lucide-react";

function CourseOverview() {


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
                    <div className="flex flex-wrap gap-2 w-full mb-3">
                        <Badge variant="outline">Course</Badge>


                    </div>

                    {/* Title with responsive spacing */}
                    <div className=" ">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                            Basic/Core Java
                        </CardTitle>
                    </div>


                </section>
                <section className="my-8">
                    <div className="flex flex-wrap gap-4 w-full ">
                        <div className="flex gap-1 items-center">
                            <Clock size={18}/> 3 hours 30 minutes
                        </div>
                        <div className="flex gap-2 items-center">
                            < CircleDollarSign size={18}/> Free
                        </div>
                        <div className="flex gap-2 items-center">
                            <Badge variant="outline">Beginner</Badge>
                        </div>
                    </div>
                </section>
                <section className="my-8">
                    <div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci aliquid atque
                            culpa deserunt ducimus, ea earum enim eos fuga impedit iste natus nemo perspiciatis quam
                            quis saepe similique! Debitis dolor dolore esse exercitationem, explicabo illo ipsam ipsum
                            iste laboriosam, maxime nulla, numquam placeat reiciendis sapiente sint sit tempora vel
                            veritatis vitae voluptates. Reiciendis, unde voluptas? Architecto deserunt et officia velit.
                            Consequatur ratione sed sunt! Adipisci aspernatur blanditiis deserunt dolores, eaque et fuga
                            fugiat ipsam itaque magni maiores maxime, necessitatibus nesciunt possimus quo quos,
                            veritatis voluptate voluptates. Blanditiis ex illo ipsum itaque libero minus quam quibusdam,
                            recusandae tempora? A accusantium at consequatur deleniti eligendi et, expedita magnam
                            minima, mollitia nam obcaecati odio quia quos repudiandae vitae. Aliquam aliquid asperiores
                            aut autem deserunt ducimus eius enim error expedita fugiat harum illo illum ipsa ipsum
                            laudantium libero maxime obcaecati odio pariatur, quibusdam repellat reprehenderit soluta
                            vitae voluptates voluptatum. Cupiditate eos excepturi quae.</p>
                    </div>
                </section>
                <section className="my-8">
                    <h1 className="font-medium text-2xl">Course Structure</h1>
                </section>
            </div>

        </>)

}


export default CourseOverview;