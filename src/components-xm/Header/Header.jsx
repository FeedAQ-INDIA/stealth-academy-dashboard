import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import NavigationMenuDemo from "./nav-menu.jsx"
import {useAuthStore} from "@/zustland/store.js";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import React from "react";

export default function Header( ) {

    const {userDetail} = useAuthStore()


    return (
        <header className="flex h-16 items-center justify-between bg-white px-4 shadow-md border-b">
            {/* Logo */}
            <a
                className="text-2xl sm:text-3xl font-medium text-black"
                href="/dashboard"
                style={{ fontFamily: "Anta" }}
            >
                Fee
                <span className="text-[#ffdd00]">d</span>AQ{" "}
                <span
                    className="font-normal"
                    style={{
                        fontFamily: [
                            "Lucida Sans",
                            "Lucida Sans Regular",
                            "Lucida Grande",
                            "Lucida Sans Unicode",
                            "Geneva",
                        ],
                    }}
                >
          Academy
        </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 ml-4">
                <NavigationMenuDemo />
            </div>

            {/* Right-side button */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
                <Link to={`/account-settings/profile`}>
                    {/*<Button variant="secondary">*/}
                    {/*    {userDetail?.nameInitial}*/}
                    {/*</Button> */}
                    <Avatar className="w-12 h-12   bg-orange-400   shadow-sm hover:shadow-xl">
                    <AvatarFallback className="text-lg sm:text-lg bg-orange-400  text-white font-bold">
                        {userDetail?.nameInitial}
                    </AvatarFallback>
                </Avatar>
                </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden ml-auto">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-4 w-64">
                        <div className="flex flex-col gap-4 mt-4 ">
                            <NavigationMenuDemo orientation={"vertical"} />
                            <Link to={`/account-settings/profile`}>
                                <Button variant="secondary" className="w-full">
                                    {userDetail?.nameInitial}
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
