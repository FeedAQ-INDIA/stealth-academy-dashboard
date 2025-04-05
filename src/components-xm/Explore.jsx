import {Clock, Search,} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Link} from "react-router-dom";

export function Explore() {


    return (
        <div  className="p-6">
            <div className=" items-center justify-items-center">
                <div className="my-4">
                    <h1 className="text-center text-2xl font-medium">Explore Courses</h1>
                </div>
                <div className="flex gap-2 w-full md:w-3/4 lg:w-1/2 mx-auto items-center my-8">
                    <Input type="text" placeholder="What do you want to learn today ?"/>
                    <Button type="submit"><Search/></Button>
                </div>
                <div className="my-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 items-center">
                        <Card className=" border shadow-sm hover:shadow-md cursor-pointer ">
                            <CardHeader>
                                {/* Badge row - wraps on smaller screens */}
                                <div className="flex flex-wrap gap-2 w-full mb-3">
                                    <Badge variant="outline">Course</Badge>
                                    <Badge variant="outline">Beginner</Badge>
                                </div>

                                {/* Title with responsive spacing */}
                                <div className=" ">
                                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                        Basic/Core Java
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 line-clamp-3">A beginner-friendly course covering core Java concepts,
                                    including
                                    syntax, object-oriented programming, data structures, exception handling, and file
                                    handling. Ideal for
                                    those starting their Java programming journey.</p>
                                {/*<p className="my-2 animate-blink text-blue-800 font-medium"> Registration Started</p>*/}
                                <div className="font-medium  ">
                                    <div className="flex gap-2 items-center">
                                        <Clock size={18}/>  3 hours 30 minutes</div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex gap-2 ">
                                <Link to={`/course/20`} className="  w-full "><Button className="  w-full ">Learn More</Button>
                                </Link>   {/*<Button className="  w-full  ">Learn More</Button>*/}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>


                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
