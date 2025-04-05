import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@/components/hooks/use-toast.js";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axiosConn from "@/axioscon.js";
import ContextConfigSearchModule from "@/components-xm/Workspace/Modules/ContextConfigSearchModule.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";

function CreateEditPortalGroup({groupId = null, portalId = null}) {

    const {toast} = useToast();
    const navigate = useNavigate();
    const {WorkspaceId, LayoutId} = useParams();
    const [portalGroupDetail, setPortalGroupDetail] = useState({});

    const fieldConfigSchema = z.object({
        groupName: z.string().min(3, "Portal Group Name is required"),
        groupAnnouncements: z.string().optional(),
        groupDescription: z.string().optional(),
        contextConfigId: z.array(z.number()).min(1, "At least one portal group must be added"),
    })

    const form = useForm({
        resolver: zodResolver(fieldConfigSchema),
        defaultValues: {groupName: "", groupDescription: "", groupAnnouncements: "", contextConfigId: []},
    });

    useEffect(() => {
        fetchPortalGroupDetail();
    }, [groupId]);

    const fetchPortalGroupDetail = () => {
        if(groupId) {
            axiosConn.post('http://localhost:3000/searchRecord', {
                limit: 5, offset: 0, getThisData: {
                    datasource: "PortalGroup", attributes: [], where: {
                         portalGroupId: groupId
                    },
                    include: [
                        {datasource: 'ContextConfiguration', as: 'configdetail'}
                    ]
                },
            }).then(res => {
                console.log(res)
                const resVal = res?.data?.data?.results?.[0]
                form.reset({
                    groupName: resVal?.portalGroupName,
                    groupDescription: resVal?.portalGroupDescription,
                    groupAnnouncements: resVal?.portalGroupAnnouncements,
                    contextConfigId: resVal?.configdetail?.map(a => a?.contextConfigurationId)
                });
                setPortalGroupDetail(resVal || {})

            }).catch(err => {
                console.log(err)
            });
        }
    }

    function onSubmit(data) {
        console.log(data)
        axiosConn.post('http://localhost:3000/createEditPortalGroup', {
            ...(groupId   && {portalGroupId : groupId}),
            orgId: localStorage.getItem("currentOrg"),
            workspaceId: WorkspaceId,
            portalId: portalId,
            portalGroupName: data?.groupName,
            portalGroupDescription: data?.groupDescription,
            portalGroupInputConfig: data?.contextConfigId
        }).then(res => {
            console.log(res)
            toast({
                title: res.data.data,
            });
            form.reset();
            fetchPortalGroupDetail();
        }).catch(err => {
            toast({
                title: "Request failed!",
            });
        });
    }


    return (
        <>

            <Form {...form}>
                <form   onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                >
                    <div className="grid w-full   items-center gap-3 my-4">
                        <FormField
                            control={form.control}
                            name="groupName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Portal Group Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Portal Group Name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid w-full   items-center gap-3 my-4">
                        <FormField
                            control={form.control}
                            name="groupDescription"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Portal Group Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your Portal Group description here."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid w-full   items-center gap-3 my-4">


                        <FormField
                            control={form.control}
                            name="contextConfigId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Layout Context Config</FormLabel>
                                    <FormControl>
                                        <ContextConfigSearchModule value={field.value}
                                                                   onChange={field.onChange}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="grid w-full   items-center gap-3 my-4">
                        <div className="flex gap-2">
                            <Button type="button">
                                Reset
                            </Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </div>
                </form>
            </Form>


        </>)

}


export default CreateEditPortalGroup;