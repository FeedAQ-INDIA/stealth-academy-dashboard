import * as React from "react"
import {useEffect, useState} from "react"
import {ChevronsUpDown, GalleryVerticalEnd, PanelsTopLeft} from "lucide-react"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem,} from "@/components/ui/sidebar.jsx"
import {
    CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command.jsx";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";
import {useDispatch} from "react-redux";
import axiosConn from "@/axioscon.js";

function VersionSwitcher({  workspaceDetail
                         }) {


    return (<SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                     size="xl"
                 >

                    <div className="flex flex-col gap-0.5 leading-none  " title={workspaceDetail?.name}>
                        <span
                            className="font-medium text-lg line-clamp-2">{workspaceDetail?.name}</span>
                        <span className="text-xs  text-muted-foreground">Workspace</span>

                    </div>
                 </SidebarMenuButton>


            </SidebarMenuItem>
        </SidebarMenu>)
}

export default VersionSwitcher