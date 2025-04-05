import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axiosConn from "@/axioscon.js";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {useNavigate, useParams} from "react-router-dom";
import EditCustomField from "@/components-xm/Workspace/WorkspaceSettings/EditCustomField.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {MoreHorizontal, Pencil, Trash2} from "lucide-react";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Badge} from "@/components/ui/badge.jsx";


function EditCustomFieldConfiguration() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const {WorkspaceId, ContextConfigurationId} = useParams();
    const [selectedField, setSelectedField] = useState([]);
    const [contextConfigDetails, setContextConfigDetails] = useState({});

    const fieldConfigSchema = z.object({
        name: z.string()
            .min(1, "Name must be at least one character long.")
            .max(63, "Name must be less than 64 characters."),
        description: z.string().optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
        contextConfigurationType: z.enum(["RECORD", "STAKEHOLDER, RECORD DATA", 'PRODUCT']),
        contextConfigurationSectionLabel: z.string()
            .min(1, "Label must be at least one character long.")
            .max(25, "Label must be less than 64 characters."),
    });
    const form = useForm({
        resolver: zodResolver(fieldConfigSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
            contextConfigurationType: "RECORD",
            contextConfigurationSectionLabel: ''
        },
    });

    useEffect(() => {
        if (ContextConfigurationId) {
            fetchCustomFieldConfigDetail()
        }

    }, [ContextConfigurationId]);

    const fetchCustomFieldConfigDetail = () => {
        axiosConn.post('http://localhost:3000/searchRecord', {
            limit: 5, offset: 0, getThisData: {
                datasource: "ContextConfiguration", attributes: [], where: {
                    workspaceId: WorkspaceId,
                    orgId: localStorage.getItem("currentOrg"),
                    contextConfigurationId: ContextConfigurationId
                }, include: [{
                    datasource: "WorkspaceField", as: "workspacefields", order: [], attributes: [], where: {},
                },]
            },
        }).then(res => {
            console.log(res)
            setContextConfigDetails(res?.data?.data?.results?.[0])
            const resVal = res?.data?.data?.results?.[0]
            form.reset({
                name: resVal?.contextConfigurationName || "",
                description: resVal?.contextConfigurationDescription || "",
                status: resVal?.contextConfigurationStatus || "",
                contextConfigurationType: resVal?.contextConfigurationType,
                contextConfigurationSectionLabel: resVal?.contextConfigurationSectionLabel
            });
            setSelectedField(resVal?.workspacefields)

        }).catch(err => {
            console.log(err)
        });
    }

    function onSubmit(data) {
        console.log(data)
        console.log(selectedField)
        axiosConn.post('http://localhost:3000/createConfiguration', {
            contextConfigurationId: contextConfigDetails?.contextConfigurationId,
            contextConfigurationStatus: data.status,
            contextConfigurationName: data.name,
            contextConfigurationDescription: data.description,
            contextConfigurationType: data.contextConfigurationType,
            contextConfigurationSectionLabel: data.contextConfigurationSectionLabel,
            fieldList: selectedField,
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
        }).then(res => {
            console.log(res)
            toast({
                title: "Configuration updated successfully !",
            });
            form.reset();
            setSelectedField([])
            navigate(`/workspace/${WorkspaceId}/settings/field-configuration/`)

        }).catch(err => {
            toast({
                title: "Configuration updation failed !",
            });
        });
    }

    useEffect(() => {
        console.log(selectedField)
    }, [selectedField]);


    return (<>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4"/>
            <Breadcrumb>
                <BreadcrumbList>

                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit Field Configurations</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto sm:flex-initial">

            </div>
        </header>

        <CardHeader className="   bg-muted/50">
            <CardTitle className="text-lg">{contextConfigDetails?.contextConfigurationName}</CardTitle>
            <CardDescription>Edit Field Configurations</CardDescription>
        </CardHeader>

        <div className="flex flex-col gap-4  ">

            <div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                    >
                        <CardContent>
                            <div className="py-4">

                                <Card className="rounded-none shadow-md my-4">
                                    <CardHeader className="bg-muted/50">
                                        <CardTitle className="text-lg font-normal">General Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid w-full   items-center gap-3 my-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({field}) => (<FormItem>
                                                        <FormLabel>Configuration Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Configuration name" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>)}
                                            />
                                        </div>
                                        <div className="grid w-full   items-center gap-3 my-4">
                                            <FormField
                                                control={form.control}
                                                name="contextConfigurationSectionLabel"
                                                render={({field}) => (<FormItem>
                                                        <FormLabel>Configuration Section Label</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Configuration name" {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>)}
                                            />
                                        </div>

                                        <div className="grid w-full   items-center gap-3 my-4">
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({field}) => (<FormItem>
                                                        <FormLabel>Configuration Description</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Type your Configuration description here."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>)}
                                            />
                                        </div>
                                        <div className="grid w-full   items-center gap-3 my-4">
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({field}) => (<FormItem>
                                                        <FormLabel>Configuration Status</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder="Select a Configuration Status"/>
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

                                        <div className="grid w-full   items-center gap-3 my-4">
                                            <FormField
                                                control={form.control}
                                                name="contextConfigurationType"
                                                render={({field}) => (<FormItem>
                                                        <FormLabel>Configuration Type</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder="Select a Configuration Type"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="RECORD">Record</SelectItem>
                                                                    <SelectItem
                                                                        value="STAKEHOLDER">Stakeholder</SelectItem>
                                                                    <SelectItem value="RECORD DATA">Record
                                                                        Data</SelectItem>
                                                                    <SelectItem value="PRODUCT">Product</SelectItem>

                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-none shadow-md my-4">
                                    <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center bg-muted/50">
                                        <CardTitle className="text-lg font-normal">Fields <Badge  variant="outline"
                                            className="ml-2 ">  {selectedField?.length} Fields </Badge></CardTitle>
                                        <div className="ml-auto sm:flex-initial">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button type={"button"} variant="outline" className="w-full">Add a
                                                        Field</Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Create Field</SheetTitle>
                                                    </SheetHeader>
                                                    <EditCustomField fullFieldList={selectedField}
                                                                     onFieldUpdate={(fieldData) => {
                                                                         setSelectedField([...selectedField, fieldData]);
                                                                     }}/>

                                                </SheetContent>
                                            </Sheet>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div>


                                            <div className="mt-4">
                                                <Table className="border">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="hidden sm:table-cell"
                                                            >
                                                                KEY
                                                            </TableHead>
                                                            <TableHead className="hidden sm:table-cell">
                                                                LABEL
                                                            </TableHead>
                                                            <TableHead className="hidden sm:table-cell">
                                                                TYPE
                                                            </TableHead>
                                                            <TableHead className="hidden sm:table-cell">
                                                                STATUS
                                                            </TableHead>
                                                            <TableHead className="hidden sm:table-cell">
                                                                MANDATORY
                                                            </TableHead>

                                                         </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedField?.map((a) => (<TableRow key={a.layoutId}>
                                                            <TableCell className="hidden sm:table-cell font-medium">
                                                                {a.fieldKey}
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell font-medium">
                                                                {a.fieldLabel}
                                                            </TableCell>

                                                            <TableCell className="hidden sm:table-cell  ">
                                                                {a?.fieldType}
                                                            </TableCell>
                                                            <TableCell>
                                                                <StatusView initialStatus={a?.fieldStatus}/>
                                                            </TableCell>

                                                            <TableCell className="hidden sm:table-cell p-2">
                                                                {a?.fieldIsMandatory.toString()}
                                                            </TableCell>

                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Button type="button" variant="outline" size="sm" onClick={ () =>  setSelectedField(selectedField.filter(l => a.fieldLabel !== l.fieldLabel))
                                                                    }><Trash2 /></Button>
                                                                {ContextConfigurationId && <Sheet>
                                                                    <SheetTrigger asChild>
                                                                        <Button type="button" variant="outline"
                                                                                size="sm"><Pencil /></Button>
                                                                    </SheetTrigger>
                                                                    <SheetContent>
                                                                        <SheetHeader>
                                                                            <SheetTitle>Edit Field</SheetTitle>
                                                                        </SheetHeader>
                                                                        <div >
                                                                            <EditCustomField initialValue={a} fullFieldList={selectedField}
                                                                                             onFieldUpdate={(fieldData) => {
                                                                                                 setSelectedField((prevFields) =>
                                                                                                     prevFields.map((field) =>
                                                                                                         field.workspaceFieldId === fieldData.workspaceFieldId ? fieldData : field
                                                                                                     )
                                                                                                 );
                                                                                             }}/>
                                                                        </div>


                                                                    </SheetContent>
                                                                </Sheet>  }
                                                                </div>
                                                            </TableCell>


                                                        </TableRow>))}

                                                        {(selectedField?.length === 0) ? (<TableRow>
                                                            <TableCell
                                                                colSpan={7}
                                                                className=" table-cell text-center py-4 italic	"
                                                            >
                                                                No Data Found
                                                            </TableCell>
                                                        </TableRow>) : (<></>)}
                                                    </TableBody>

                                                </Table>

                                            </div>

                                        </div>

                                    </CardContent>
                                </Card>

                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={fetchCustomFieldConfigDetail}>
                                    Reset
                                </Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </CardFooter>
                    </form>
                </Form>
            </div>
        </div>
    </>)

}


export default EditCustomFieldConfiguration;