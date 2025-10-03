import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dice5, Globe, Grip, Menu, Presentation, User, Video } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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

export default function Dashboard() {
  const { userDetail } = useAuthStore();

 
  return (
 <div className="p-4">
        


     <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700  ">
                    <CardHeader className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 shadow-xl">
                                        <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                            {userDetail?.nameInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0 ">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white">
                                        WELCOME, {userDetail?.derivedUserName}
                                    </h1>
                                    <p className="text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        <span className="break-words">Member since {userDetail?.created_date}</span>
                                    </p>
                                 </div>
                            </div>
                             
                        </div>
                    </CardHeader>
      
                </Card>
 


        </div>
  );
}
