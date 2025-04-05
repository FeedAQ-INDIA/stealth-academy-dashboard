import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import TagsTable from "@/components-xm/Workspace/TagsTable.jsx";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import CreateTags from "@/components-xm/Workspace/CreateTags.jsx";
import {Link, useParams} from "react-router-dom";
import CreateProduct from "@/components-xm/Workspace/CreateProduct.jsx";
import ProductsTable from "@/components-xm/Workspace/ProductsTable.jsx";
import axiosConn from "@/axioscon.js";
import ProductContext from "@/components-xm/Workspace/ProductContext.jsx";
import StakeholderContext from "@/components-xm/Workspace/StakeholderContext.jsx";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import {UserRound} from "lucide-react";

function ProductDetail() {
    const {WorkspaceId, ProductId} = useParams();

    const [productDetail, setProductDetail] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord",
                {
                    limit: 10, offset: 0, getThisData: {
                        datasource: "Product", order: [], attributes: [], where: {
                            // workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                            productId: ProductId
                        }, include: [{
                            datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
                        },],
                    },
                })
            .then((res) => {
                console.log(res.data);
                setProductDetail(res?.data?.data?.results?.[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        console.log("layoutId :: ", productDetail?.layoutId)
        if(productDetail){
            fetchRecordContextAssociation()
        }
    }, [productDetail]);

    const [contextConfigId, setContextConfigId] = useState([]);

    const fetchRecordContextAssociation = () => {
        console.log(productDetail?.layoutId);
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "LayoutContextConfig", attributes: ["contextConfigurationId"], where: {layoutId: productDetail?.layoutId},
                },
            })
            .then((res) => {
                const fetchedData = res.data?.data?.results || [];
                console.log("fetchRecordContextAssociation", fetchedData)
                setContextConfigId(fetchedData.map(item => item?.contextConfigurationId));
            })
            .catch((err) => console.log(err));
    };




    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={ `/workspace/${WorkspaceId}/views?tab=views`}>Workspace</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={`/workspace/${WorkspaceId}/products?tab=products`}>Product & Services</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{productDetail?.productName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start  bg-muted/50">
                <div>
                    <CardTitle className="text-lg">{productDetail?.productName} - #{productDetail?.productId}</CardTitle>
                    <CardDescription>Products & Services Detail</CardDescription>
                </div>

                <div className="ml-auto sm:flex-initial">
                </div>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4">
                <div className=" ">

                    <Card className="rounded-none my-4 shadow-md">
                        <CardHeader className="flex flex-row items-center gap-4 bg-muted/50">
                            <CardTitle className="text-lg font-normal">General Information</CardTitle>
                            <div className="ml-auto sm:flex-initial">
                                <Link to={`/workspace/${WorkspaceId}/products/${ProductId}/edit`}>
                                    <Button
                                        className="h-8 gap-1 "
                                    >Edit</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">Description</p>
                                    <h5>{productDetail?.productDescription || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Code</p>
                                    <h5>{productDetail?.productCode || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Status</p>
                                    <h5>{productDetail?.productStatus || "N/A"}</h5>
                                </div>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="border-none rounded-1 hover:bg-muted/50 p-2 cursor-pointer">
                                            <p className="text-muted-foreground">Created By</p>
                                            <h5>{productDetail?.createdby?.firstName || "N/A"}</h5>
                                        </div>

                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-fit max-w-80  z-[52]">
                                        <div className="flex  space-x-4">
                                            <Avatar>
                                                <AvatarFallback>{productDetail?.createdby?.nameInitial ||
                                                    <UserRound strokeWidth={1}/>}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">{productDetail?.createdby?.derivedUserName}</h4>
                                                <p className="text-xs font-medium text-muted-foreground">                  {productDetail?.createdby?.email}<br/>
                                                    {productDetail?.createdby?.reportedByProfile?.number}</p>
                                                {/*<p className="text-sm line-clamp-2">*/}
                                                {/*    {workspaceData?.description}*/}
                                                {/*</p>*/}

                                                <div className="flex items-center pt-2">
                                     <span className="text-xs text-muted-foreground">
                                        Joined on {productDetail?.createdby?.created_date}
                                      </span>
                                                </div>
                                                <div className="items-start pt-2">
                                                    <Link
                                                        to={`/workspace/${WorkspaceId}/stakeholder/${productDetail?.createdby?.stakeholderId}?tab=stakeholder&limit=10&offset=0`}>
                                                        <Button size={"sm"} variant="secondary"
                                                                className="rounded-none text-xs font-normal hover:shadow-sm text-muted-foreground">
                                                            View Profile
                                                        </Button>

                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{productDetail?.product_created_at ? new Date(productDetail.product_created_at).toLocaleString() : "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{productDetail?.product_updated_at ? new Date(productDetail.product_updated_at).toLocaleString() : "N/A"}</h5>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                     {contextConfigId?.map(a => (<ProductContext contextConfigId={a}/>))}
                </div>
             </div>
        </>)

}


export default ProductDetail;