import NavigationMenuDemo from "@/components-xm/Header/nav-menu.jsx";
import React, {useEffect, useState} from "react";
import {useAuthStore   } from "@/zustland/store.js";
import {Button} from "@/components/ui/button.jsx";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "@/components/ui/hover-card"
import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command.jsx";
import {Link, useNavigate} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {FolderKanban, Settings} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
    const [workspaceList, setWorkspaceList] = useState({});
    const [apiQuery, setApiQuery] = useState({
        limit: 10, offset: 0, getThisData: {
            datasource: "Workspace", order: [["w_created_at", "DESC"]], attributes: [], where: {
                orgId: localStorage.getItem("currentOrg"),
            },
        },
    });
    const {orgData} = useAuthStore();
    const {
        workspaceData, userDetail
    } = useAuthStore();
    const [wsSearchDialogOpen, setWsSearchDialogOpen] = useState(false);
    useEffect(() => {
         if (localStorage.getItem("currentOrg")) {
            fetchWorkspace();
        }
    }, [apiQuery]);
    const navigate = useNavigate();

    const fetchWorkspace = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setWorkspaceList(res.data.data);
                if (res.data.data?.results?.length == 0) {
                    navigate(`/workspace`)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };




    return (<header className="flex h-[4rem] shrink-0 items-center gap-2 bg-gray-800 text-white border-b px-4">
            {/*<img*/}
            {/*    className="dark:invert  mr-5"*/}
            {/*    src="https://nextjs.org/icons/next.svg"*/}
            {/*    alt="Next.js logo"*/}
            {/*    width={90}*/}
            {/*    height={19}*/}
            {/*/>*/}
            <h1 className="dark:invert  mr-5 text-2xl font-medium font-mono">FeedAQ</h1>
            <NavigationMenuDemo/>
            <div className="ml-auto sm:flex-initial items-center flex gap-2">


                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="secondary" className="" onClick={() => setWsSearchDialogOpen(!wsSearchDialogOpen)}>
                            { workspaceData?
                                (workspaceData?.name?.length > 15 ? workspaceData?.name?.slice(0, 15) + "..." : workspaceData?.name):
                            "Select a Workspace"}
                        </Button>
                    </HoverCardTrigger>
                    { workspaceData && <HoverCardContent className="w-80 z-[52]">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarFallback><FolderKanban color="#000000"/></AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{workspaceData?.name}</h4>
                                <p className="text-xs font-medium text-muted-foreground">{orgData?.orgName}</p>
                                <p className="text-sm line-clamp-2">
                                    {workspaceData?.description}
                                </p>

                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {workspaceData?.created_date}
                                      </span>
                                </div>
                                <div className="items-start pt-2">
                                    <Link to={`/workspace/${workspaceData?.workspaceId}`}>
                                        <Button size={"sm"} variant="secondary"
                                                className="rounded-none text-xs font-normal hover:shadow-sm text-muted-foreground">Open
                                            Workspace</Button>

                                    </Link>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>}
                </HoverCard>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary"  className="">
                            {/*<Settings style={{ width: "20px", height: "20px" }} />*/}
                            {userDetail?.nameInitial}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                 Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {userDetail?.userStatusList?.map(a => (
                                        <DropdownMenuItem>
                                            {a?.userStatusName}
                                        </DropdownMenuItem>
                                    ))}

                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                            <Link to={`/account-settings/personal-profile?tab=personal-profile`}>
                                <DropdownMenuItem>
                                Settings                        </DropdownMenuItem>

                            </Link>

                    </DropdownMenuContent>
                </DropdownMenu>
                {/*<Link to={`/account-settings/personal-profile?tab=personal-profile`}><Button variant="secondary" >*/}
                {/*    <Settings style={{ width: "20px", height: "20px" }} />*/}
                {/*</Button></Link>*/}



            </div>


        <CommandDialog
            open={wsSearchDialogOpen}
            onOpenChange={setWsSearchDialogOpen}
        >
            <CommandInput
                placeholder="Search workspace"
                onChange={(e) => {
                    updateApiQuery("Workspace", {
                        where: {
                            name: {
                                $like: `%${e.target.value}%`,
                            },
                        },
                    });
                }}
            />
            <CommandList>

                <CommandGroup heading="Suggestions">
                    {workspaceList?.results?.map((a) => (<Link
                        to={`/workspace/${a.workspaceId}`}
                        key={a.workspaceId}
                        onClick={() => {
                            localStorage.setItem("activeWorkspace", a?.workspaceId)
                            setWsSearchDialogOpen(false)
                        }}
                    >
                        <CommandItem className="cursor-pointer">{a.name}</CommandItem>
                    </Link>))}
                </CommandGroup><CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
            <div className="flex gap-1 p-2">
                <Link to="/workspace" className="w-full ">
                    <Button
                        className="w-full"
                        onClick={() => setWsSearchDialogOpen(false)}
                    >
                        View all workspace
                    </Button>
                </Link>
                <Link to="/createWorkspace" className="w-full ">
                    <Button
                        className="w-full"
                        onClick={() => setWsSearchDialogOpen(false)}
                    >
                        Create new workspace
                    </Button>
                </Link>
            </div>

        </CommandDialog>
        </header>)
}

export default Header;