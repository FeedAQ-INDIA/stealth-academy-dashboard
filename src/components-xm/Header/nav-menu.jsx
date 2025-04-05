import * as React from "react";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams,} from "react-router-dom";

import {cn} from "@/lib/utils.js";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.jsx";
import axiosConn from "@/axioscon.js";
import {
    CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useAuthStore} from "@/zustland/store.js";
import {Separator} from "@/components/ui/separator.jsx";


function NavigationMenuDemo() {
    const navigate = useNavigate();
     const [wsSearchDialogOpen, setWsSearchDialogOpen] = useState(false);


    const handleNavigate = (url) => {
        console.log(url)
        if (url.startsWith('http')) {
            if (url.includes('auth/logout')) {
                localStorage.clear();
                console.log("Storage cleared")
                window.location.href = url;
            } else {
                window.open(url); // External link
            }

        } else {
            navigate(url); // Internal route
        }
    }


    return (<NavigationMenu className="z-20">
            <NavigationMenuList>

                <NavigationMenuItem>
                    <Link to={'/dashboard'}><Button variant="ghost">DASHBOARD</Button></Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link to={'/explore'}><Button variant="ghost">EXPLORE</Button></Link>
                </NavigationMenuItem>


                <NavigationMenuItem>
                    <Link to={'/my-learning-path'}> <Button variant="ghost">MY LEARNING PATH</Button></Link>
                </NavigationMenuItem>


            </NavigationMenuList>


        </NavigationMenu>);
}


const ListItem = ({className, title, children, ...props}) => {
    return (<li>
            <NavigationMenuLink asChild>
                <a
                    className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>);
}

export default NavigationMenuDemo;