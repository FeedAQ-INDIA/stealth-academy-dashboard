import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {AlertCircle, Check, Terminal, Video} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import axiosConn from "@/axioscon.js";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Link, useParams} from "react-router-dom";
import {toast} from "@/components/hooks/use-toast.js";
import {useWebinar} from "@/components-xm/Webinar/WebinarContext.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";


function WebinarOverview() {
    const {WebinarId} = useParams();
    const {
        userEnrollmentObj,
        userEnrollmentWebinarLog,
        isUserEnrolledAlready,
        webinarList,
        enroll,
        disroll,
        enrollStatus
    } = useWebinar();
    const {userDetail} = useAuthStore();

    const {
        state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar
    } = useSidebar();

    useEffect(() => {
        if (isUserEnrolledAlready) {
            setOpen(true);
        } else {
            setOpen(false);
        }

    }, [isUserEnrolledAlready]);


    const fetchWebinarStatus = (webinar) => {
        const now = new Date();
        const start = new Date(webinar.webinarStartDate);
        const end = new Date(webinar.webinarEndDate);
        const regStart = new Date(webinar.webinarRegistrationStartDateTime);
        const regEnd = new Date(webinar.webinarRegistrationEndDateTime);

        let status = '';

        if (now < regStart) {
            status = 'registration not started';
        } else if (now >= regStart && now <= regEnd) {
            if (now < start) {
                status = 'registration open';
            } else if (now >= start && now <= end) {
                status = 'live';
            } else if (now > end) {
                status = 'ended';
            }
        } else if (now > regEnd) {
            if (now < start) {
                status = 'registration closed';
            } else if (now >= start && now <= end) {
                status = 'live';
            } else {
                status = 'ended';
            }
        }

        return status;
    };





    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    useEffect(() => {
        console.log(webinarList?.webinarTitle?.trim())
        console.log(deleteConfirmation?.trim())
        console.log("Is delete confirmed", webinarList?.webinarTitle?.trim() == deleteConfirmation?.trim())
    }, [deleteConfirmation]);


    return (
        <>
            <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-white px-4">
                {isUserEnrolledAlready ? (<><SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/></>) : <></>}
                <Breadcrumb>
                    <BreadcrumbList>


                        <BreadcrumbItem>
                            <BreadcrumbPage className="truncate max-w-[30ch]">Overview</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <div className="p-4">
                <Card className="rounded-none bg-muted/50 border-none">
                    <CardHeader>


                        <div className="flex flex-wrap gap-2 w-full mb-3">

                            <Badge className="animate-blink bg-green-600 text-white">{webinarList?.webinarCost == 0 ? 'FREE' : `Rs.${webinarList?.webinarCost}/-`}</Badge>
                            <Badge variant="outline">WEBINAR</Badge>
                            <Badge variant="outline">
                                {`${Math.floor(+(webinarList?.webinarDuration) / 60)}hr ${+(webinarList?.webinarDuration) % 60}min`}
                            </Badge>
                            {webinarList?.webinarSource ? <Badge variant="outline">{webinarList?.webinarSource}</Badge> : <></>}
                            {webinarList?.webinarLevel ? <Badge variant="outline">{webinarList?.webinarLevel}</Badge> : <></>}
                        </div>
                        <div className="flex flex-wrap gap-2 w-full mb-3 items-center">
                            <div className=" ">
                                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                                    {webinarList?.webinarTitle}
                                </CardTitle>
                                <p  className="completed-stamp text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-light">Webinar Status : </span>{fetchWebinarStatus(webinarList)}</p>
                            </div>
                            <div className="ml-auto ">
                                {(isUserEnrolledAlready ?
                                    <>
                                        <div className="completed-stamp">
                                            ENROLLED
                                        </div>
                                        <p className='text-sm text-right cursor-pointer hover:text-blue-800 hover:underline  hover:underline-offset-4 italic'>View
                                            Order</p>
                                    </> :
                                    <Button onClick={() => enroll()}>ENROLL</Button>)
                                }
                            </div>
                        </div>

                    </CardHeader>


                </Card>




                {!userDetail?.number ? <section className="my-4">

                    <Alert  variant="destructive">
                        <AlertCircle className="h-4 w-4" />

                        <div className="flex flex-row md:flex-row flex-wrap gap-2 items-center">
                            <div>

                                <AlertTitle>Phone number missing in your account</AlertTitle>
                                <AlertDescription>
                                    <p>Please update your phone number to receive updates regarding this {webinarList?.webinarType}</p>

                                </AlertDescription>
                            </div>

                            <div className="md:ml-auto">
                                <Link to='/account-settings/profile'>
                                    <Button className="mt-2 flex-1" size={'sm'}  variant="destructive">Update</Button>
                                </Link>

                            </div>
                        </div>

                    </Alert>
                </section> : <></>}



                <section className="my-4">
                    <div className="flex flex-col md:flex-row gap-4">

                        <img src={webinarList?.webinarImageUrl?.[0]} className="h-72"/>



                        <Card className=" bg-muted/50 border-none">
                        <CardHeader>

                            <div className="flex flex-wrap justify-between gap-2 w-full ">

                                <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Date : </span>
                                    {`${webinarList?.webinar_start_date} ${webinarList?.webinar_start_time}`} <span className="text-black font-medium "> - </span> {`${webinarList?.webinar_end_date} ${webinarList?.webinar_end_time} `}
                                </p>

                                <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Registration : </span>
                                    {`${webinarList?.webinar_registration_start_date} ${webinarList?.webinar_registration_start_time}`} <span className="text-black font-medium "> - </span> {`${webinarList?.webinar_registration_end_date} ${webinarList?.webinar_registration_end_time} `}
                                </p>


                            </div>

                            <div className="flex flex-wrap  gap-4 w-full ">
                                {webinarList?.webinarMode  ?

                                <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Mode : </span>
                                    {webinarList?.webinarMode}
                                 </p> : <></>
                                }

                                {webinarList?.webinarSource  ?

                                    <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Via : </span>
                                    {webinarList?.webinarSource}
                                 </p>:<></>
                                }

                                {webinarList?.webinarLanguage  ?

                                    <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Language : </span>
                                    {webinarList?.webinarLanguage}
                                </p> :<></> }

                                {webinarList?.webinarDuration  ?

                                    <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Duration : </span>
                                    {`${Math.floor(+(webinarList?.webinarDuration) / 60)}hr ${+(webinarList?.webinarDuration) % 60}min`}
                                </p>:<></>
                                }

                                {webinarList?.webinarPresenter?.length > 0 ?
                                    <p  className=" text-base tracking-wide text-left mt-2"   >
                                        <span className="text-black font-medium ">Webinar Presenter : </span>
                                        {webinarList?.webinarPresenter?.map(i => i)  }
                                    </p>:<></>
                                }


                                <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Cost : </span>
                                    {webinarList?.webinarCost == 0 ? 'FREE' : `Rs.${webinarList?.webinarCost}/-`}
                                </p>


                            </div>

                            <div className="flex flex-wrap justify-between gap-2 w-full ">
                                <p  className=" text-base tracking-wide text-left mt-2"   >
                                    <span className="text-black font-medium ">Webinar Location : </span>
                                    {webinarList?.webinarHostLocation  }
                                </p>
                            </div>

                        </CardHeader>


                    </Card>  </div>
                </section>
                <section className="my-4">

                </section>


                <section className="my-4">
                    <Card className="border-0 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="">
                                Description
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="whitespace-pre-wrap break-words">
                                    {webinarList?.webinarDescription}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>



                <section className="my-4 flex">
                    {(userEnrollmentObj?.enrollmentStatus != 'CERTIFIED' &&
                        userEnrollmentObj?.enrollmentStatus != 'COMPLETED') ?
                        (isUserEnrolledAlready ?

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="ml-auto" variant="destructive">{ `LEAVE WEBINAR`}</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Are You Sure You Want To Leave The Webinar ?</DialogTitle>
                                        <DialogDescription>
                                            Type in <span className="font-medium text-black italic">{webinarList?.webinarTitle}</span> in the below input field and click on
                                            confirm to Leave the webinar
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center ">

                                        <Input
                                            id="link"
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value?.trim())}
                                        />

                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                        {webinarList?.webinarCost == 0 ?
                                            <Button
                                                disabled={webinarList?.webinarTitle?.trim() === deleteConfirmation?.trim() ? false : true}
                                                onClick={() => {
                                                    if (webinarList?.webinarTitle.trim() === deleteConfirmation?.trim()) {
                                                        disroll();
                                                        setDeleteConfirmation('')
                                                    } else {
                                                        toast({
                                                            title: 'Failed to leave the webinar'
                                                        })
                                                    }
                                                }}>
                                                Confirm
                                            </Button> :
                                            <></>

                                        }

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            :
                            <></>) : <></>
                    }
                </section>

            </div>

        </>)

}


export default WebinarOverview;