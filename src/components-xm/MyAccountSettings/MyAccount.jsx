import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import React from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {CircleDollarSign, Clock} from "lucide-react";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";

function MyAccount() {


    return (
        <>


            <div className="p-6">
                <Card className="border-0 bg-[#ffdd00]">
                    <CardHeader>
                        <div className="flex flex-sm justify-items-center gap-4 items-center">
                            <Avatar className="w-12 h-12">
                                <AvatarFallback className="text-xl">TS</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl font-medium">Welcome TECHFUSION STUDIO</h1>
                                <p>Member since 2021</p>
                            </div>
                        </div>


                    </CardHeader>
                </Card>
                <div className="my-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid w-full   items-center gap-1.5">
                            <Label htmlFor="email">First Name</Label>
                            <Input type="text" id="firstName" placeholder="First Name" />
                        </div>
                        <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="email">Last Name</Label>
                            <Input type="text" id="lastName" placeholder="Last Name" />
                        </div>
                        <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" placeholder="Email" />
                        </div>
                        <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input type="tel" id="phoneNumber" placeholder="Phone Number" />
                        </div>
                        <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="language">Language</Label>
                            <Input type="text" id="language" value="English" readOnly />
                        </div>
                        <div className="grid w-full  items-center gap-1.5">
                            <Label htmlFor="country">Phone Number</Label>
                            <Input type="text" id="country" value="India" readOnly />
                        </div>
                    </div>
                    <div className="flex gap-4 my-6">
                       <Button variant="outline">Reset</Button> <Button>Save</Button>
                    </div>

                </div>
            </div>

        </>)

}


export default MyAccount;