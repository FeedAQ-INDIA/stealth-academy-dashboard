import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dice5, Globe, Grip, Menu, Presentation, Video } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import NavigationMenuDemo from "./nav-menu.jsx";
import { useAuthStore } from "@/zustland/store.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

export default function Header() {
  const { userDetail } = useAuthStore();

  useEffect(() => {
    console.log("Header compoenent mounted", userDetail);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 shadow-md border-b">
      <div className="flex gap-2 items-center">
        <div>
          <Dialog>
            <DialogTrigger className="p-2 hover:bg-muted/50 hover:cursor-pointer rounded-md">
                 <Grip size={30} />
             </DialogTrigger>
            <DialogContent className="  max-h-[90vw]">
              <DialogHeader>
                <DialogTitle className="mb-4">Switch Apps</DialogTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">

                  <Card className="bg-blue-500  hover:bg-indigo-600 cursor-pointer">
                    <CardHeader className="flex flex-col items-center">
                     <Presentation size={42} className="text-white" />
                      <CardTitle className="text-lg font-semibold text-white">Content Library</CardTitle>
                    </CardHeader>
                  </Card>

                   <Card className="bg-green-500 hover:bg-emerald-600  cursor-pointer">
                    <CardHeader className="flex flex-col items-center">
                      <Globe size={42} className="text-white" />
                      <CardTitle className="text-lg font-semibold text-white">Lang Studio</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {/* Logo */}
        <a
          className="text-2xl sm:text-3xl font-medium text-black"
          href="/dashboard"
          style={{ fontFamily: "Anta" }}
        >
          STEALTH
        </a>
      </div>

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
            <AvatarFallback className="text-lg sm:text-lg  bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
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
  );
}
