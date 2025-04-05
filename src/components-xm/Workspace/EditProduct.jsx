import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";


function Product() {
    const {WorkspaceId, ProductId} = useParams();
    const [productDetail, setProductDetail] = useState();

    const {toast} = useToast();
    const navigate = useNavigate();

    const createProductSchema = z.object({
        productName: z.string().min(3, "Product name is required"),
        productDescription: z.string().optional(),
        productCode: z.string().regex(/^\S*$/, "Product Code must not contain spaces").optional(),
           productStatus: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),

     });
    const createProductForm = useForm({
        resolver: zodResolver(createProductSchema),
        defaultValues: {productName: "", productDescription: "", productCode: "", productStatus:""},
    });

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditProduct', {
            ...(ProductId && {productId: ProductId}),
            productName: data.productName,
            productDescription: data.productDescription,
            productCode: data.productCode,
            productStatus: data.productStatus,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId
        }).then(res => {
            toast({
                title: "Product updated successfully!",
            });
            navigate(`/workspace/${WorkspaceId}/products?tab=products`);
        }).catch(err => {
            toast({
                title: "Product updation failed!",
            });
        });

    }

    useEffect(() => {
        fetchProductDetail();
    }, []);

    const fetchProductDetail = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 1, offset: 0, getThisData: {
                datasource: "Product", order: [], attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"), productId: ProductId
                }, include: [{
                    datasource: "User", as: "createdby", required: false, order: [], attributes: [], where: {},
                },],
            },
        }).then(res => {
            console.log(res.data)
            setProductDetail(res?.data?.data?.results?.[0]);
            const productDetail = res?.data?.data?.results?.[0];
            if (productDetail) {
                createProductForm.reset({
                    productName: productDetail?.productName,
                    productDescription: productDetail?.productDescription,
                    productCode: productDetail?.productCode,
                    productStatus: productDetail?.productStatus,
                });
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (<div>
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
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            <Link to={`/workspace/${WorkspaceId}/products/${ProductId}?tab=products`}>{productDetail?.productName}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Product & Services</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>

        {/*<CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">*/}
        {/*    <div className=" ">*/}
        {/*        <CardTitle className="text-lg">Edit Product & Services</CardTitle>*/}
        {/*        <CardDescription>Reach to mass audience</CardDescription>*/}
        {/*    </div>*/}

        {/*</CardHeader>*/}

        <CardHeader className=" flex md:flex-row sm:flex-col gap-4 items-start bg-muted/50">
            <div>
                <CardTitle className="text-lg">{productDetail?.productName} - <span className="text-muted-foreground">#{productDetail?.productId}  </span></CardTitle>
                <CardDescription>Edit Products & Services</CardDescription>
            </div>


            <div className="ml-auto sm:flex-initial">
                <Link to={`/workspace/${WorkspaceId}/products/${ProductId}`}>
                    <Button size="sm">
                       View Detail
                    </Button>
                </Link>
            </div>

        </CardHeader>


        <div className="flex flex-col gap-4 p-4 ">

            <Form {...createProductForm}>
                <form
                    onSubmit={createProductForm.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                >
                    <div>
                        <div className="py-4">
                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createProductForm.control}
                                    name="productName"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>

                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createProductForm.control}
                                    name="productDescription"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Product Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your Product description here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createProductForm.control}
                                    name="productCode"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Product Code</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your Product rule here."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>
                            <div className="grid w-full   items-center gap-3 my-4">
                                <FormField
                                    control={createProductForm.control}
                                    name="productStatus"
                                    render={({field}) => (<FormItem>
                                        <FormLabel>Product Status</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Product Status"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <Button type="button" onClick={() => createProductForm.reset()}>
                                Reset
                            </Button>
                            <Button type="submit">Update</Button>
                        </div>
                    </div>
                </form>
            </Form>

        </div>
    </div>);
}

export default Product;
