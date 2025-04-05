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
    const {WorkspaceId} = useParams();
    const [workspaceDetail, setWorkspaceDetail] = useState({});
    const [wsSearchDialogOpen, setWsSearchDialogOpen] = useState(false);

    const [workspaceList, setWorkspaceList] = useState({});
    const [apiQuery, setApiQuery] = useState({
        limit: 10, offset: 0, getThisData: {
            datasource: "Workspace", order: [["w_created_at", "DESC"]], attributes: [], where: {
                orgId: localStorage.getItem("currentOrg"),
            },
        },
    });

    const updateApiQuery = (datasource, keyValueUpdates) => {
        setApiQuery((prevQuery) => {
            const newQuery = {...prevQuery};

            // Function to handle the merging of where clauses
            const updateWhereClause = (currentWhere, newWhere) => {
                // Start with a copy of the current where clause
                const updatedWhere = {...currentWhere};

                // Loop through each key in the new where object
                for (const [key, value] of Object.entries(newWhere)) {
                    // Replace the value only if the key exists
                    if (updatedWhere.hasOwnProperty(key)) {
                        updatedWhere[key] = value; // Replace value if key exists
                    } else {
                        // Optionally log or handle the case where the key does not exist
                        updatedWhere[key] = value;
                        console.log(`Key ${key} does not exist, skipping addition.`);
                    }
                }
                console.log(updatedWhere);
                return updatedWhere; // Return the updated where clause
            };

            const updateNestedIncludes = (includes) => {
                for (const include of includes) {
                    if (include.datasource === datasource) {
                        // Update where clause if keyValueUpdates contains `where`
                        if (keyValueUpdates.where) {
                            include.where = updateWhereClause(include.where || {}, keyValueUpdates.where);
                        }

                        // Update other keys directly
                        Object.keys(keyValueUpdates).forEach((key) => {
                            if (key !== "where" && include.hasOwnProperty(key)) {
                                include[key] = keyValueUpdates[key]; // Replace existing keys
                            } else {
                                include[key] = keyValueUpdates[key];
                                console.log(`Key ${key} does not exist, skipping replacememnt.`);
                            }
                        });
                    }

                    if (include.include) {
                        updateNestedIncludes(include.include);
                    }
                }
            };

            if (newQuery.getThisData.datasource === datasource) {
                if (keyValueUpdates.where) {
                    newQuery.getThisData.where = updateWhereClause(newQuery.getThisData.where || {}, keyValueUpdates.where);
                }
            } else {
                updateNestedIncludes(newQuery.getThisData.include);
            }

            return newQuery; // Return the updated query
        });
    };

    const fetchValueByDatasourceAndKey = (datasource, key) => {
        const {getThisData} = apiQuery;

        // Helper function to search recursively through includes
        const findInNestedIncludes = (includes) => {
            for (const include of includes) {
                // Check if the datasource matches
                if (include.datasource === datasource) {
                    return include[key]; // Return the value for the specified key
                }

                // If there are nested includes, search deeper
                if (include.include) {
                    const result = findInNestedIncludes(include.include);
                    if (result !== undefined) {
                        return result; // Return if found in nested includes
                    }
                }
            }
            return undefined; // Return undefined if not found
        };

        // Check main datasource
        if (getThisData.datasource === datasource) {
            return getThisData[key]; // Return the value for the specified key
        }

        // Search in nested includes
        return findInNestedIncludes(getThisData.include);
    };

    useEffect(() => {
        console.log(fetchValueByDatasourceAndKey("Workspace", "order")[0][1]);
        if (localStorage.getItem("currentOrg")) {
            fetchWorkspace();
        }


    }, [apiQuery]);


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

    useEffect(() => {
        fetchWorkspaceDetail();
    }, []);

    const fetchWorkspaceDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "Workspace", order: [], attributes: [], where: {
                        orgId: localStorage.getItem("currentOrg"), workspaceId: WorkspaceId,
                    },
                },
            })
            .then((res) => {
                console.log(res.data);
                setWorkspaceDetail(res.data?.data?.results[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
                    <Button variant="ghost">HOME</Button>
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