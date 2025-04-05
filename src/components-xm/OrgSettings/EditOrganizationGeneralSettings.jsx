import React, {useEffect, useState} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Label} from "@/components/ui/label.jsx";
import axiosConn from "@/axioscon.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form.jsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.jsx";
import { HiBuildingOffice2 } from "react-icons/hi2";
import {Link} from "react-router-dom";
import {useAuthStore} from "@/zustland/store.js";

function OrganizationGeneralSettings() {
    const [orgDetail, setOrgDetail] = useState([]);
    const {toast} = useToast();
    const {orgData, setOrgData} = useAuthStore();

    const OrgSchema = z.object({
        orgName: z.string().min(3, "Repository name is required"),
        orgEmail: z.string().min(3, "Repository name is required"),
        orgNumber: z.string().min(3, "Repository name is required"),
        orgHeadCount: z.string().min(3, "Repository name is required"),
        orgDomain: z.string().min(3, "Repository name is required"),
    });

    const orgForm = useForm({
        resolver: zodResolver(OrgSchema),
        defaultValues: {
            orgName: "",
            orgEmail: "",
            orgNumber: "",
            orgHeadCount: "",
            orgDomain: "",
        },
    });

    const {watch, reset, handleSubmit, control, formState} = orgForm;

    useEffect(() => {
        fetchorgDetail();
    }, []);

    const fetchorgDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 20,
                offset: 0,
                getThisData: {
                    datasource: "Org",
                    order: [],
                    attributes: [],
                    where: {
                        orgId: localStorage.getItem("currentOrg"),
                    },
                },
            })
            .then((res) => {
                console.log(res?.data?.data?.results?.[0]);
                setOrgDetail(res?.data?.data?.results?.[0]);

                const orgDetail = res?.data?.data?.results?.[0];
                setOrgData(orgDetail)
                if (orgDetail) {
                    orgForm.reset({
                        orgName: orgDetail.orgName || "",
                        orgEmail: orgDetail.orgEmail || "",
                        orgNumber: orgDetail.orgNumber || "",
                        orgHeadCount: orgDetail.orgHeadCount || "",
                        orgDomain: orgDetail.orgDomain || "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const watchedValues = watch();

    // Compare current form values with userDetail to determine if they are different
    const isFormChanged =
        orgDetail &&
        Object.keys(watchedValues).some(
            (key) => watchedValues[key] !== (orgDetail[key] || "")
        );

    const onSubmit = (data) => {
        axiosConn
            .post("http://localhost:3000/updateOrg", {
                orgId: localStorage.getItem("currentOrg"),
                orgName: data.orgName,
                orgEmail: data.orgEmail,
                orgNumber: data.orgNumber,
                orgHeadCount: data.orgHeadCount,
                orgDomain: data.orgDomain,
            })
            .then((res) => {
                console.log(res?.data);
                toast({
                    title: "Organization Updated Successfully",
                    description:
                        " Organization Updated Successfully  ",
                });
                fetchorgDetail();
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Error Occured:"
                });
            });
    };

    return (<div>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
              <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink >
                            <Link to={`/account-settings/organization-profile?tab=organization-profile`}>Organization Profile</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Organization Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial"></div>
        </header>
        <div className="p-4">
            <div  >

                <div className="p-4 w-4/6 mx-auto ">
                    <div className="items-center my-12">
                        <Avatar className="mx-auto h-16 w-16 md:h-28 md:w-28 shadow-md">
                            <AvatarFallback className="text-lg md:text-3xl">
                                <HiBuildingOffice2/>
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <Form {...orgForm}>
                        <form
                            onSubmit={orgForm.handleSubmit(onSubmit)}
                            className="w-full"
                        >
                            {" "}
                            <div className=" py-4 grid grid-cols-1 gap-6">


                                <div className="grid w-full items-center gap-3  ">
                                    <FormField
                                        control={orgForm.control}
                                        name="orgName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organisation Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Organisation Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full items-center gap-3  ">
                                    <FormField
                                        control={orgForm.control}
                                        name="orgEmail"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organisation Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Secondary Email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full items-center gap-3  ">
                                    <FormField
                                        control={orgForm.control}
                                        name="orgNumber"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organisation Contact</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Contact Number"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full items-center gap-3  ">
                                    <FormField
                                        control={orgForm.control}
                                        name="orgHeadCount"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organisation Head Count</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        id="orgHeadCount"
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a Head Count"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="1">1-10</SelectItem>
                                                                <SelectItem value="11-50">11-50</SelectItem>
                                                                <SelectItem value="51-100">51-100</SelectItem>
                                                                <SelectItem value="101-500">
                                                                    101-500
                                                                </SelectItem>
                                                                <SelectItem value="500+">500+</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full items-center gap-3  ">
                                    <FormField
                                        control={orgForm.control}
                                        name="orgDomain"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Organisation Domain</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        id="orgDomain"
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue
                                                                placeholder="Select Organisation Domain"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="technology">
                                                                    Technology
                                                                </SelectItem>
                                                                <SelectItem value="healthcare">
                                                                    Healthcare
                                                                </SelectItem>
                                                                <SelectItem value="finance">
                                                                    Finance
                                                                </SelectItem>
                                                                <SelectItem value="education">
                                                                    Education
                                                                </SelectItem>
                                                                <SelectItem value="retail">Retail</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                            {isFormChanged && (
                                <div className="flex gap-2 ">
                                    <Button
                                        onClick={() =>
                                            orgForm.reset({
                                                orgName: orgDetail.orgName || "",
                                                orgEmail: orgDetail.orgEmail || "",
                                                orgNumber: orgDetail.orgNumber || "",
                                                orgHeadCount: orgDetail.orgHeadCount || "",
                                                orgDomain: orgDetail.orgDomain || "",
                                            })
                                        }
                                    >
                                        Reset
                                    </Button>
                                    <Button type="submit">Update</Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default OrganizationGeneralSettings;
