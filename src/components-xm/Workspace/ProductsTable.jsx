import React, {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight, MoreHorizontal, Search, Terminal, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Pagination, PaginationContent, PaginationItem,} from "@/components/ui/pagination.jsx";
import {useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";

function ProductsTable() {
    const {WorkspaceId} = useParams();
    const navigate = useNavigate();

    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [storedDate, setStoredDate] = useState({
        from: localStorage.getItem("searchStartwindow"), to: localStorage.getItem("searchEndwindow"),
    });

    const [productList, setproductList] = useState({});

    const [apiQuery, setApiQuery] = useState({
        limit: limit, offset: offset, getThisData: {
            datasource: "Product", order: [["product_created_at", "DESC"]], attributes: [], where: {
                workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
            }, include: [{
                datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
            },],
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

            // Update the main datasource if it matches
            if (newQuery.getThisData.datasource === datasource) {
                if (keyValueUpdates.where) {
                    newQuery.getThisData.where = updateWhereClause(newQuery.getThisData.where || {}, keyValueUpdates.where);
                } else {
                    newQuery.getThisData = {
                        ...newQuery.getThisData, ...keyValueUpdates,
                    };
                }

                // Update the main query with other key-value pairs
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
        fetchProduct();
    }, [apiQuery]);

    const fetchProduct = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", apiQuery)
            .then((res) => {
                console.log(res.data);
                setproductList(res.data.data);
                setTotalCount(res.data.data.totalCount);
                setOffset(res.data.data.offset);
                setLimit(res.data.data.limit);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteProduct = (item) => {
        axiosConn
            .post("http://localhost:3000/deleteProduct",
                {
                    workspaceId : WorkspaceId, orgId : localStorage.getItem('currentOrg'),
                    productId: item?.productId, productStatus : item?.productStatus
                })
            .then((res) => {
                console.log(res.data);
                toast({
                    title: res.data?.data?.message
                })
                fetchProduct()
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (<div className="flex flex-col gap-4 ">
        <div className="flex items-center py-4">
            {/*<Button variant="ghost">*/}
            {/*    <Filter/>*/}
            {/*</Button>*/}
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    onChange={(e) => {
                        const searchValue = e.target.value;
                        updateApiQuery("Product", {
                            where: searchValue ? {
                                $or: [{
                                    productCode: {
                                        $like: `%${searchValue}%`,
                                    },
                                }, {
                                    productName: {
                                        $like: `%${searchValue}%`,
                                    },
                                },],
                            } : {},
                        })

                    }}
                />
            </div>
        </div>
        {productList?.results?.length > 0 ? <>

            <Table className="border">
                <TableHeader>
                    <TableRow>
                        {/*<TableHead className="hidden sm:table-cell"*/}
                        {/*           onClick={() => {*/}
                        {/*               fetchValueByDatasourceAndKey("Product", "order")[0][1] == "DESC" ? updateApiQuery("Product", {order: [["productId", "ASC"]],}) : updateApiQuery("Product", {order: [["productId", "DESC"]],});*/}
                        {/*           }}>*/}
                        {/*    <Button variant="ghost"> Product Id <ArrowDownUp className="ml-2 h-3.5 w-3.5"/>*/}
                        {/*    </Button>*/}
                        {/*</TableHead>*/}
                        <TableHead className="hidden sm:table-cell"></TableHead>
                        <TableHead className="hidden sm:table-cell"
                        >PRODUCT NAME
                            {/*<ArrowDownUp className="ml-2 h-3.5 w-3.5"/>*/}
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            PRODUCT CODE
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            STATUS
                        </TableHead>

                        <TableHead className="hidden sm:table-cell">
                            CREATED BY
                        </TableHead>
                        <TableHead className="text-right">
                            <Button
                                variant="ghost"

                            >
                                CREATED ON
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                            ACTIONS
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productList?.results?.map((a) => (<TableRow key={a.productId}>
                        <TableCell className="hidden sm:table-cell  ">
                         </TableCell>
                        <TableCell className="hidden sm:table-cell  font-medium ">
                            {a.productName}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell  ">
                            {a.productCode}
                        </TableCell>

                        <TableCell className="hidden sm:table-cell  ">
                           <StatusView initialStatus={a?.productStatus}/>
                        </TableCell>


                        <TableCell className="hidden sm:table-cell  items-center p-2">

                                <div
                                    className="">

                                    <AssigneeModule intialValue={a?.createdby} uiType={'Avatar'}   isEditable={false} />

                                </div>
                         </TableCell>

                        <TableCell className="text-right">
                            {a.created_date} <br/>{a.created_time}                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigate(`/workspace/${WorkspaceId}/products/${a.productId}`)}>
                                        View

                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => navigate(`/workspace/${WorkspaceId}/products/${a.productId}/edit`)}>
                                        Edit

                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={()=> deleteProduct(a)}
                                    >
                                        Delete
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>))}

                    {(productList?.results?.length === 0) ? (<TableRow>
                        <TableCell
                            colSpan={7}
                            className=" table-cell text-center py-4 italic	"
                        >
                            No Data Found
                        </TableCell>
                    </TableRow>) : (<></>)}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7} className="py-3">
                            <div className="flex flex-row items-center">
                                <div className="text-xs text-muted-foreground">
                                    {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} row(s) selected.
                                </div>
                                <Pagination className="ml-auto mr-0 w-auto">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    setOffset(Math.max(offset - limit, 0));
                                                    setApiQuery((prevQuery) => ({
                                                        ...prevQuery,
                                                        offset: Math.max(offset - limit, 0),
                                                    }));
                                                }}
                                            >
                                                <ChevronLeft className="h-3.5 w-3.5" />
                                                <span className="sr-only">Previous Order</span>
                                            </Button>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    setOffset(offset + limit < totalCount ? offset + limit : offset);
                                                    setApiQuery((prevQuery) => ({
                                                        ...prevQuery,
                                                        offset: offset + limit < totalCount ? offset + limit : offset,
                                                    }));
                                                }}
                                            >
                                                <ChevronRight className="h-3.5 w-3.5" />
                                                <span className="sr-only">Next Order</span>
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

        </> : <>
            <Alert>
                <Terminal className="h-4 w-4"/>
                <AlertTitle>No Product Found!</AlertTitle>
                <AlertDescription>
                    There are no products present in this workspace
                </AlertDescription>
            </Alert></>}


        {/*<div className="flex items-center py-4">*/}
        {/*    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>*/}
        {/*        <Input*/}
        {/*            type="search"*/}
        {/*            placeholder="Search..."*/}
        {/*            className="w-full  bg-background pl-8 md:w-[200px] lg:w-[336px]"*/}
        {/*            onChange={(e) => {*/}
        {/*                const searchValue = e.target.value;*/}
        {/*                updateApiQuery("Product", {*/}
        {/*                    where:*/}
        {/*                        searchValue && searchValue.length > 0*/}
        {/*                            ? {productId: `${searchValue}`}*/}
        {/*                            : {},*/}
        {/*                });*/}
        {/*            }}*/}
        {/*        />*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*{productList?.results?.map((a) => (*/}

        {/*    <Sheet>*/}
        {/*        <SheetTrigger asChild>*/}
        {/*            <a*/}
        {/*                key={a.productId}*/}
        {/*                className="flex flex-col items-start gap-2 rounded-lg border-0 shadow p-3 text-left text-sm transition-all hover:bg-accent bg-white"*/}
        {/*            >*/}
        {/*                <div className="flex w-full flex-col gap-1">*/}
        {/*                    <div className="flex items-center">*/}
        {/*                        <div className="flex items-center gap-2">*/}
        {/*                            <div className="font-semibold line-clamp-2 ">*/}
        {/*                                {a?.productMetadata?.find(*/}
        {/*                                    (m) => m.key === "SUMMARY" && m.category === "AI"*/}
        {/*                                )?.value || "No Summary Available"}*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                        <div className="ml-auto w-fit text-xs text-foreground whitespace-nowrap">*/}
        {/*                            {a?.product_created_at || "Date not available"}*/}
        {/*                        </div>*/}
        {/*                    </div>*/}

        {/*                    <div className="flex items-center">*/}
        {/*                        <div className="flex items-center gap-2">*/}
        {/*                            <div className="text-xs font-light">*/}
        {/*                                {a?.reportedByProfile?.firstName ==*/}
        {/*                                a?.submittedByProfile?.firstName &&*/}
        {/*                                a?.reportedByProfile?.firstName ==*/}
        {/*                                a?.submittedByProfile?.firstName ? (*/}
        {/*                                    <span>*/}
        {/*          <span className="font-light">Reported By{" - "}</span>*/}
        {/*                                        {a?.reportedByProfile?.firstName}{" "}*/}
        {/*                                        {a?.reportedByProfile?.lastName}*/}
        {/*        </span>*/}
        {/*                                ) : (*/}
        {/*                                    <span>*/}
        {/*          <span className="font-light">Reported By{" - "}</span>*/}
        {/*                                        {a?.reportedByProfile?.firstName}{" "}*/}
        {/*                                        {a?.reportedByProfile?.lastName}*/}
        {/*                                        <span className="font-bold">{" | "}</span>{" "}*/}
        {/*                                        <span className="font-light"> Submitted By{" - "}</span>*/}
        {/*                                        {a?.submittedByProfile?.firstName}{" "}*/}
        {/*                                        {a?.submittedByProfile?.lastName}*/}
        {/*        </span>*/}
        {/*                                )}*/}
        {/*                            </div>*/}
        {/*                        </div>*/}
        {/*                        <div className="ml-auto text-xs text-foreground">*/}
        {/*                            <div className="text-xs font-medium text-muted-foreground  whitespace-nowrap">*/}
        {/*                                product #{a.productId}*/}
        {/*                            </div>*/}
        {/*                            {" "}*/}
        {/*                        </div>*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <div className="text-xs text-muted-foreground">*/}
        {/*                    {a?.productData?.map((a) => (*/}
        {/*                        a.keyInputType*/}
        {/*                    )).join('  |  ')}*/}
        {/*                </div>*/}
        {/*                <div className="flex items-center gap-2">*/}
        {/*                    <Badge>{a?.productsource}</Badge>*/}

        {/*                </div>*/}
        {/*            </a>*/}
        {/*        </SheetTrigger>*/}
        {/*        <SheetContent side="right">*/}
        {/*            <SheetHeader>*/}
        {/*                <SheetTitle>product #{a?.productId}</SheetTitle>*/}
        {/*                <SheetDescription> Date: {a?.product_created_at}*/}
        {/*                </SheetDescription>*/}
        {/*            </SheetHeader>*/}
        {/*            <div className="flex flex-col gap-4 my-4">*/}
        {/*                <div className="flex gap-2 items-center ">*/}
        {/*                    Status*/}
        {/*                    <div className=" ml-auto flex-1 md:grow-0">*/}
        {/*                        <Select>*/}
        {/*                            <SelectTrigger className="w-[180px]">*/}
        {/*                                <SelectValue placeholder="Select a fruit"/>*/}
        {/*                            </SelectTrigger>*/}
        {/*                            <SelectContent>*/}
        {/*                                <SelectItem value="apple">In Progress</SelectItem>*/}
        {/*                                <SelectItem value="banana">Ready</SelectItem>*/}
        {/*                                <SelectItem value="blueberry">Completed</SelectItem>*/}
        {/*                                <SelectItem value="grapes">Closed</SelectItem>*/}
        {/*                                <SelectItem value="pineapple">Backlog</SelectItem>*/}
        {/*                            </SelectContent>*/}
        {/*                        </Select>*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <div className="flex gap-2 items-center">*/}
        {/*                    Assignee*/}
        {/*                    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*                        <Popover open={open} onOpenChange={setOpen}>*/}
        {/*                            <PopoverTrigger asChild>*/}
        {/*                                <Button*/}
        {/*                                    variant="outline"*/}
        {/*                                    role="combobox"*/}
        {/*                                    aria-expanded={open}*/}
        {/*                                    className="w-full mt-2 justify-between font-normal	"*/}
        {/*                                >*/}
        {/*                                    {value*/}
        {/*                                        ? assigneeList?.find(*/}
        {/*                                            (framework) => framework.userId === value*/}
        {/*                                        )?.firstName*/}
        {/*                                        : "Select framework..."}*/}
        {/*                                    <ChevronsUpDown className="opacity-50"/>*/}
        {/*                                </Button>*/}
        {/*                            </PopoverTrigger>*/}
        {/*                            <PopoverContent className="w-full p-0">*/}
        {/*                                <Command>*/}
        {/*                                    <CommandInput placeholder="Search framework..."/>*/}
        {/*                                    <CommandList>*/}
        {/*                                        <CommandEmpty>No framework found.</CommandEmpty>*/}
        {/*                                        <CommandGroup>*/}
        {/*                                            {assigneeList?.map((framework) => (*/}
        {/*                                                <CommandItem*/}
        {/*                                                    key={framework.userId}*/}
        {/*                                                    value={framework.userId}*/}
        {/*                                                    onSelect={(currentValue) => {*/}
        {/*                                                        setValue(*/}
        {/*                                                            currentValue === value ? "" : currentValue*/}
        {/*                                                        );*/}
        {/*                                                        setOpen(false);*/}
        {/*                                                    }}*/}
        {/*                                                >*/}
        {/*                                                    {framework?.firstName}*/}
        {/*                                                    <Check*/}
        {/*                                                        className={cn(*/}
        {/*                                                            "ml-auto",*/}
        {/*                                                            value === framework?.userId*/}
        {/*                                                                ? "opacity-100"*/}
        {/*                                                                : "opacity-0"*/}
        {/*                                                        )}*/}
        {/*                                                    />*/}
        {/*                                                </CommandItem>*/}
        {/*                                            ))}*/}
        {/*                                        </CommandGroup>*/}
        {/*                                    </CommandList>*/}
        {/*                                </Command>*/}
        {/*                            </PopoverContent>*/}
        {/*                        </Popover>*/}
        {/*                    </div>*/}
        {/*                </div>*/}

        {/*                <div className="flex gap-2">*/}
        {/*                    Reporter*/}
        {/*                    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*                        a?.reportedBy*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <div className="flex gap-2">*/}
        {/*                    Submitted by*/}
        {/*                    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*                        a?.reportedBy*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <div className="flex gap-2">*/}
        {/*                    Repository*/}
        {/*                    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*                        a?.reportedBy*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <div className="flex gap-2">*/}
        {/*                    Workspace*/}
        {/*                    <div className="relative ml-auto flex-1 md:grow-0">*/}
        {/*                        a?.reportedBy*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*                <Separator/>*/}
        {/*                <div className=" ">*/}
        {/*                    <p>Snapshot</p>*/}
        {/*                    <ol className="mt-2 list-decimal list-inside space-y-2">*/}
        {/*                        <li>*/}
        {/*                              <span>Question  </span>*/}
        {/*                            <p>Answer</p>*/}
        {/*                        </li>*/}
        {/*                        <li>*/}
        {/*                            <span>Question</span>*/}
        {/*                            <p>Answer</p>*/}
        {/*                        </li>*/}
        {/*                    </ol>*/}
        {/*                </div>*/}

        {/*            </div>*/}
        {/*            <SheetFooter className="flex gap-2">*/}
        {/*                <SheetClose asChild>*/}
        {/*                    <Button variant="outline">Close</Button>*/}
        {/*                </SheetClose>*/}
        {/*                <Button onClick={() => {*/}
        {/*                    window.open(`/ws/${WorkspaceId}/${*/}
        {/*                        RepositoryId ? `repository/${RepositoryId}/` : ""*/}
        {/*                    }product/${a.productId}?tab=product`, '_blank');*/}
        {/*                }}>View Detail</Button>*/}
        {/*            </SheetFooter>*/}
        {/*        </SheetContent>*/}
        {/*    </Sheet>*/}

        {/*))}*/}
        {/*{productList?.results && productList?.results?.length > 0 ? (*/}
        {/*    <div className="flex flex-row items-center   py-3">*/}
        {/*        <div className="text-xs text-muted-foreground">*/}
        {/*            {offset + 1} to {Math.min(offset + limit, totalCount)} of{" "}*/}
        {/*            {totalCount} row(s) selected.*/}
        {/*        </div>*/}
        {/*        <Pagination className="ml-auto mr-0 w-auto">*/}
        {/*            <PaginationContent>*/}
        {/*                <PaginationItem>*/}
        {/*                    <Button*/}
        {/*                        size="icon"*/}
        {/*                        variant="outline"*/}
        {/*                        className="h-6 w-6"*/}
        {/*                        onClick={() => {*/}
        {/*                            setOffset(Math.max(offset - limit, 0));*/}
        {/*                            setApiQuery((prevQuery) => ({*/}
        {/*                                ...prevQuery, // Spread the previous state*/}
        {/*                                offset: Math.max(offset - limit, 0), // Update the specific attribute*/}
        {/*                            }));*/}
        {/*                        }}*/}
        {/*                    >*/}
        {/*                        <ChevronLeft className="h-3.5 w-3.5"/>*/}
        {/*                        <span className="sr-only">Previous Order</span>*/}
        {/*                    </Button>*/}
        {/*                </PaginationItem>*/}
        {/*                <PaginationItem>*/}
        {/*                    <Button*/}
        {/*                        size="icon"*/}
        {/*                        variant="outline"*/}
        {/*                        className="h-6 w-6"*/}
        {/*                        onClick={() => {*/}
        {/*                            setOffset(*/}
        {/*                                offset + limit < totalCount ? offset + limit : offset*/}
        {/*                            );*/}
        {/*                            setApiQuery((prevQuery) => ({*/}
        {/*                                ...prevQuery, // Spread the previous state*/}
        {/*                                offset:*/}
        {/*                                    offset + limit < totalCount ? offset + limit : offset, // Update the specific attribute*/}
        {/*                            }));*/}
        {/*                        }}*/}
        {/*                    >*/}
        {/*                        <ChevronRight className="h-3.5 w-3.5"/>*/}
        {/*                        <span className="sr-only">Next Order</span>*/}
        {/*                    </Button>*/}
        {/*                </PaginationItem>*/}
        {/*            </PaginationContent>*/}
        {/*        </Pagination>*/}
        {/*    </div>*/}
        {/*) : (*/}
        {/*    <></>*/}
        {/*)}*/}


    </div>)

}

export default ProductsTable;
