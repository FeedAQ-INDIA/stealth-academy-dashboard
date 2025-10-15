import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Grip, Menu, Presentation } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import NavigationMenuDemo from "./nav-menu.jsx";
import { useAuthStore } from "@/zustland/store.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

export default function Header() {
  const { userDetail } = useAuthStore();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  useEffect(() => {
    console.log("Header compoenent mounted", userDetail);
  }, []);

  return (
    <>
    <header className="flex h-14 items-center justify-between bg-white px-4 shadow-md border-b">
      <div className="flex gap-2 items-center">
        <div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger className="p-2 hover:bg-muted hover:cursor-pointer rounded-md">
              <Grip size={25} />
            </SheetTrigger>
            <SheetContent side="left" className="min-h-fit max-h-screen">
              <SheetHeader>
                <SheetTitle className="mb-4">Switch Apps</SheetTitle>
                <div className="grid grid-cols-1 gap-4 ">
                  <Link to="/" onClick={() => setIsSheetOpen(false)}>
                    <Card className="bg-blue-500  hover:bg-indigo-600 cursor-pointer">
                      <CardHeader className="flex flex-col items-center">
                        <Presentation size={42} className="text-white" />
                        <CardTitle className="text-lg font-semibold text-white tracking-wide">
                          Content Library
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                  <Link
                    to="/lang-studio"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Card className="bg-green-500 hover:bg-emerald-600  cursor-pointer">
                      <CardHeader className="flex flex-col items-center">
                        <Globe size={42} className="text-white" />
                        <CardTitle className="text-lg font-semibold text-white tracking-wide">
                          Lang Studio
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

          
        {/* Logo */}
        <a
          className="text-2xl sm:text-3xl font-medium text-black"
          href="/"
          style={{ fontFamily: "Anta" }}
        >
          HUSKITE
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
          <Avatar className="w-10 h-10   shadow-sm hover:shadow-xl">
            <AvatarFallback className="text-lg sm:text-lg  bg-black text-white font-bold">
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


    </>
  );
}
