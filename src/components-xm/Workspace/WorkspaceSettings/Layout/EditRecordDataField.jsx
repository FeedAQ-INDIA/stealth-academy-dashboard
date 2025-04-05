import {CardContent, CardFooter} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import React, {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Plus, Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import {useParams} from "react-router-dom";

function EditRecordDataField({initialValue, onFieldUpdate, fullFieldList}) {

    const [optionText, setOptionText] = useState("");
    const [optionTextList, setOptionTextList] = useState([]);
    const {WorkspaceId, LayoutId} = useParams();


    const fieldConfigSchema = z.object({
         fieldLabel: z.string().min(3, "Field Label is required"),
        fieldKey: z
            .string()
            .min(3, "Field Key must be at least 3 characters long")
            .regex(/^[a-zA-Z0-9_]+$/, "Field Key can only contain letters, numbers, and underscores")
            .transform((val) => val.toLowerCase()) ,
        fieldType: z.enum(["INTEGER", "SINGLE LINE", "MULTI LINE", "DATE", "DATE TIME", "EMAIL", "PHONE", "DROPDOWN", "MULTI SELECT"]),
        fieldOption: z.string().optional(),
         fieldIsMandatory: z.enum(['true', 'false'])
    });
    const form = useForm({
        resolver: zodResolver(fieldConfigSchema), defaultValues: {
             fieldLabel: "",
            fieldKey: "",
            fieldType: "INTEGER",
            fieldOption: "",
             fieldIsMandatory: 'false'
        },
    });


    useEffect(() => {
        if (initialValue) {
            form.reset({
                 fieldLabel: initialValue?.fieldLabel,
                fieldKey: initialValue?.fieldKey,
                fieldType: initialValue?.fieldType,
                fieldOption: initialValue?.fieldOption,
                 fieldIsMandatory: String(initialValue?.fieldIsMandatory)
            })
        }
    }, [initialValue]);


    async function onFieldSubmit  (data, event) {
        event?.preventDefault(); // Prevent form submission from bubbling
        event?.stopPropagation(); // Stop event propagations
        const errors = form.formState.errors;

        const isFieldKeyValid = await checkFieldKeyAvailability(data.fieldKey);

        if (!isFieldKeyValid) {
            form.setError("fieldKey", { type: "manual", message: "Field key already exists" });
            return; // Stop form submission
        }

        if(["DROPDOWN", "MULTI SELECT"].includes(data.fieldType)){
            if(optionTextList && optionTextList?.length == 0){
                form.setError("fieldOption", { type: "manual", message: "Field options cannot be emtpy" });
                return;
            }
        }

        // initialValue.fieldStatus = data.fieldStatus
        // initialValue.fieldEntityType = data.fieldEntityType
        // initialValue.fieldLabel = data.fieldLabel
        // initialValue.fieldKey = data.fieldKey
        // initialValue.fieldType = data.fieldType
        // initialValue.fieldOption = optionTextList.join(' | ')
        // initialValue.fieldToolTipText = data.fieldToolTipText
        // initialValue.fieldIsMandatory = String(data.fieldIsMandatory)

        const updatedField = {
            ...initialValue,
             fieldLabel: data.fieldLabel,
            fieldKey: data.fieldKey,
            fieldType: data.fieldType,
            fieldOption: optionTextList.join(' | '),
             fieldIsMandatory: String(data.fieldIsMandatory)
        };


        console.log(updatedField);
        onFieldUpdate?.(updatedField);
        // form.reset();
    }

    const fieldType = form.watch("fieldType");
    const fieldKey = form.watch("fieldKey");

    useEffect(() => {
        if(fieldKey?.length>=3){
            checkFieldKeyAvailability(fieldKey)
        }
    }, [fieldKey]);

    const checkFieldKeyAvailability = async (fieldKey) => {
        if (!fieldKey) return false; // Skip validation if empty
        console.log("Checking fieldKey:", fieldKey);
        let isDuplicateLocally;
        if(!initialValue?.recordDataFieldId){
            isDuplicateLocally = fullFieldList.some(a =>
                a.fieldKey === fieldKey
            );
        }else{
            isDuplicateLocally = fullFieldList.some(a =>
                a.fieldKey === fieldKey && a.recordDataFieldId !== initialValue?.recordDataFieldId
            );
        }
        // Check in the existing list first


        console.log("Local duplicate exists:", isDuplicateLocally);

        if (isDuplicateLocally) {
            form.setError("fieldKey", { type: "manual", message: "Field key already exists" });
            return false;
        }

        try {
            const response = await axiosConn.post(`http://localhost:3000/checkRecordDataFieldKeyAvailability`, {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem('currentOrg'),
                ...(LayoutId && { layoutId: LayoutId }),
                ...(initialValue?.recordDataFieldId && { fieldId: initialValue.recordDataFieldId }),
                fieldKey
            });

            console.log("API Response:", response?.data?.data);

            const isAvailable = response?.data?.data?.status === 'Y';

            if (isAvailable) {
                form.clearErrors("fieldKey");
            } else {
                form.setError("fieldKey", { type: "manual", message: "Field key already exists" });
            }

            return isAvailable;
        } catch (error) {
            console.error("API Error:", error);
            return false; // Treat API failure as an invalid field
        }
    };


    return (<>


        <div className="flex flex-col gap-4 h-[calc(100svh-4em)] overflow-y-auto" >

            <div>

                <Form {...form}>
                    <div

                        className="w-full space-y-6"
                    >
                        <CardContent>
                            <div className="py-4">
                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="fieldLabel"
                                        render={({field}) => (<FormItem>
                                                <FormLabel>Field Label</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Field Label" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>)}
                                    />
                                </div>

                                     <div className="grid w-full   items-center gap-3 my-4">
                                        <FormField
                                            control={form.control}
                                            name="fieldKey"
                                            render={({field}) => (<FormItem>
                                                <FormLabel>Field Key</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Field Key" {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())}/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>)}
                                        />
                                    </div>


                                <div className="grid w-full   items-center gap-3 my-4">
                                    <FormField
                                        control={form.control}
                                        name="fieldIsMandatory"
                                        render={({field}) => (<FormItem>
                                                <FormLabel>Is it a mandatory field ?</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Is it a mandatory field ?"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">TRUE</SelectItem>
                                                            <SelectItem value="false">FALSE</SelectItem>
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
                                        name="fieldType"
                                        render={({field}) => (<FormItem>
                                                <FormLabel>Field Type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Field Type"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="INTEGER">INTEGER</SelectItem>
                                                            <SelectItem value="SINGLE LINE">SINGLE LINE</SelectItem>
                                                            <SelectItem value="MULTI LINE">MULTI LINE</SelectItem>
                                                            <SelectItem value="DATE">DATE</SelectItem>
                                                            <SelectItem value="DATE TIME">DATE TIME</SelectItem>
                                                            <SelectItem value="EMAIL">EMAIL</SelectItem>
                                                            <SelectItem value="PHONE">PHONE</SelectItem>
                                                            <SelectItem value="DROPDOWN">DROPDOWN</SelectItem>
                                                            <SelectItem value="MULTI SELECT">MULTI SELECT</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>)}
                                    />
                                </div>

                                {(fieldType == 'DROPDOWN' || fieldType == 'MULTI SELECT' ) &&
                          <>      <div className="grid w-full items-center gap-3 my-4">
                                    <Separator/>
                              <FormField
                                  control={form.control}
                                  name="fieldOption"
                                  render={({field}) => (<FormItem><Label>Enter Option</Label>
                                    <Input
                                        placeholder="Type the option."
                                        value={optionText}
                                        onChange={(e)=> setOptionText(e.target.value)}
                                    />
                                       <FormMessage/>
                                  </FormItem> )}/>
                                    <Button
                                        variant="outline"
                                        onClick={(e)=> {
                                            if (optionText.trim() !== "") {
                                                if(optionText.trim()?.length <= 20) {
                                                    setOptionTextList(prev => [...prev, optionText.trim()]);
                                                    setOptionText(""); // Clear input after adding
                                                }else {
                                                    toast({
                                                        title: "Option cannot be more than 20 characters !"
                                                    })
                                                }

                                            }else {
                                                toast({
                                                    title: "Invalid Option Entered !"
                                                })
                                            }
                                        }}>
                                        <Plus/>
                                    </Button>
                                </div>
                                <div className="grid w-full items-center gap-3 my-4">
                                    {optionTextList.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                                            <span>{option}</span>
                                            <Button variant="destructive" size="sm" onClick={() => setOptionTextList(prev => prev.filter((_, i) => i !== index))}>
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div> </>

                                }
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-2">
                                <Button type="button" onClick={() => form.reset()}>
                                    Reset
                                </Button>
                                <Button type="button"
                                        onClick={form.handleSubmit((data, event) => onFieldSubmit(data, event))}>Add</Button>
                            </div>
                        </CardFooter>
                    </div>
                </Form>
            </div>
        </div>
    </>)

}


export default EditRecordDataField;