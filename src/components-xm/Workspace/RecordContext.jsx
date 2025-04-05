import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import axiosConn from "@/axioscon.js";
import {useParams} from "react-router-dom";
import {z} from "zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import MultiSelectField from "@/components-xm/Workspace/Modules/MultiSelectField.jsx";

function RecordContext({contextConfigId }) {
    const {WorkspaceId, RecordId} = useParams();
    const [recordContextDetail, setRecordContextDetail] = useState([]);
    const [defaultRecordContextDetail, setDefaultRecordContextDetail] = useState([]);
    const [isRecordContextUpdated, setIsRecordContextUpdated] = useState(false);
    const [errors, setErrors] = useState({}); // Store validation errors

    // Mapping field types to Zod
    const getFieldValidationSchema = (fieldType, isMandatory) => {
        let schema;
        switch (fieldType) {
            case "SINGLE LINE":
            case "MULTI LINE":
                schema = z.string();
                break;
            case "INTEGER":
                schema = z.coerce.number().int().min(0, "Must be a valid number");
                break;
            case "DATE":
            case "DATE TIME":
                schema = z.string();
                break;
            case "EMAIL":
                schema = z.string().email("Invalid email format");
                break;
            case "PHONE":
                schema = z.string().min(10, "Invalid phone number");
                break;
            case "DROPDOWN":
                schema = z.string();
                break;
            case "MULTI SELECT":
                schema = z.string() ;
                break;
            default:
                schema = z.any(); // Fallback
        }
        return isMandatory ? schema.min(1, "This field is required") : schema.optional();
    };

    useEffect(() => {
        console.log('Triggered', contextConfigId)
        fetchRecord();
        fetchContextConfig();
    }, [RecordId, contextConfigId]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "RecordContext", attributes: [], where: {recordId: RecordId}, include: [{
                        datasource: "WorkspaceField",
                        as: "fielddetail",
                        required: true,
                        order: [],
                        attributes: [],
                        where: {
                            contextConfigurationId: contextConfigId
                        },
                    },],
                },
            })
            .then((res) => {
                const fetchedData = res.data?.data?.results || [];
                setRecordContextDetail(fetchedData);
                setDefaultRecordContextDetail(fetchedData);
                setIsRecordContextUpdated(false);
            })
            .catch((err) => console.log(err));
    };

    const [contextConfigurationSectionLabel, setContextConfigurationSectionLabel] = useState(null);


    const fetchContextConfig = () => {
        if(contextConfigId) {
            axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 10, offset: 0, getThisData: {
                    datasource: "ContextConfiguration", attributes: ["contextConfigurationSectionLabel"],
                    where: {contextConfigurationId: contextConfigId},
                },
            })
                .then((res) => {
                    console.log(res.data)
                    const fetchedData = res.data?.data?.results?.[0] || null;
                    setContextConfigurationSectionLabel(fetchedData?.contextConfigurationSectionLabel)
                    console.log(fetchedData?.contextConfigurationSectionLabel)

                })
                .catch((err) => console.log(err));
        }
    };


    const validateField = (index, value) => {
        const fieldData = recordContextDetail[index]?.fielddetail;
        if (!fieldData) return;

        const schema = getFieldValidationSchema(fieldData.fieldType, fieldData.fieldIsMandatory);
        const result = schema.safeParse(value);

        setErrors((prev) => ({
            ...prev, [index]: result.success ? undefined : result.error.errors[0]?.message,
        }));
    };

    const handleRecordContextInputChange = (index, newValue) => {
        setRecordContextDetail((prevDetails) => prevDetails.map((item, i) => i === index ? {
            ...item,
            fieldValue: newValue
        } : item));
        validateField(index, newValue);
    };

    useEffect(() => {
        setIsRecordContextUpdated(JSON.stringify(recordContextDetail) !== JSON.stringify(defaultRecordContextDetail));
    }, [recordContextDetail]);

    const handleContextSavingToServer = () => {
        let isValid = true;
        const updatedErrors = {};

        recordContextDetail.forEach((a, index) => {
            const fieldData = a?.fielddetail;
            if (fieldData) {
                const schema = getFieldValidationSchema(fieldData.fieldType, fieldData.fieldIsMandatory);
                const result = schema.safeParse(a?.fieldValue);

                if (!result.success) {
                    updatedErrors[index] = result.error.errors[0]?.message;
                    isValid = false;
                }
            }
        });

        setErrors(updatedErrors);

        if (!isValid) return; // Stop submission if validation fails

        const updatedRecordList = recordContextDetail
            .filter((item, index) => item?.fieldValue !== defaultRecordContextDetail?.[index]?.fieldValue)
            .map((a) => ({
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem("currentOrg"), ...(RecordId && {recordId: RecordId}),
                fieldId: a?.fieldId,
                fieldValue: a?.fieldValue,
                contextId: a?.recordContextId,
            }));

        updatedRecordList.forEach((item) => {
            axiosConn.post("http://localhost:3000/updateContextFieldValue", item)
                .then(() => fetchRecord())
                .catch((err) => console.log(err));
        });
    };

    const fieldTypeMap = {
        'SINGLE LINE': {type: 'text', tag: 'input'},
        'MULTI LINE': {type: 'text', tag: 'input'},
        'INTEGER': {type: 'number', tag: 'input'},
        'DATE': {type: 'date', tag: 'input'},
        'DATE TIME': {type: 'datetime-local', tag: 'input'},
        'EMAIL': {type: 'email', tag: 'input'},
        'PHONE': {type: 'tel', tag: 'input'},
        'DROPDOWN': {type: 'text', tag: 'select'},
        'MULTI SELECT': {type: 'text', tag: 'multiselect'},
    }


    const isObjectEmptyOrAllUndefined = (obj) => {
        return Object.keys(obj).length === 0 || Object.values(obj).every(value => value === undefined);
    };

    return (<div>

        {recordContextDetail && recordContextDetail.length > 0 &&
            <Card className="my-4 rounded-none shadow-md">
                {contextConfigurationSectionLabel && <> <CardHeader className="bg-muted/50  ">
                    <CardTitle className="text-md font-normal">{contextConfigurationSectionLabel}</CardTitle>
                </CardHeader>
               <Separator/></>}
                <CardContent>
                    {recordContextDetail?.map((a, index) => (<>
                            {(fieldTypeMap[a?.fielddetail?.fieldType]?.tag == 'input' ?
                                <div className="flex flex-col gap-2 my-4">
                                    <Label>{a?.fielddetail?.fieldLabel} {a?.fielddetail?.fieldIsMandatory && '*'}</Label>
                                    <Input type={fieldTypeMap[a?.fielddetail?.fieldType]} value={a?.fieldValue}
                                           onChange={(e) => handleRecordContextInputChange(index, e.target.value)}
                                    />
                                    {errors[index] && <p className="text-red-500 text-sm">{errors[index]}</p>}

                                </div> : <></>)}

                            {(fieldTypeMap[a?.fielddetail?.fieldType]?.tag == 'select' ?
                                <div className="flex flex-col gap-2 my-4">
                                    <Label>{a?.fielddetail?.fieldLabel} {a?.fielddetail?.fieldIsMandatory && '*'}</Label>

                                    <Select
                                        onValueChange={(val) => handleRecordContextInputChange(index, val)}
                                        value={a?.fieldValue}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder=" "/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {a?.fielddetail?.fieldOption?.split(' | ')?.map(k => (
                                                <SelectItem value={String(k?.trim())}>{k?.trim()}</SelectItem>))}

                                        </SelectContent>
                                    </Select>
                                    {errors[index] && <p className="text-red-500 text-sm">{errors[index]}</p>}

                                </div> : <></>)}

                            {(fieldTypeMap[a?.fielddetail?.fieldType]?.tag == 'multiselect' ?
                                <div className="flex flex-col gap-2 my-4">
                                    <Label>{a?.fielddetail?.fieldLabel} {a?.fielddetail?.fieldIsMandatory && '*'}</Label>
                                    <MultiSelectField
                                        fieldData={{
                                            fieldId: a?.fieldId,
                                            fieldLabel: a?.fielddetail?.fieldLabel,
                                            fieldType: a?.fielddetail?.fieldType,
                                            fieldOption: a?.fielddetail?.fieldOption?.split(' | ')
                                        }}
                                        initialValue={a?.fieldValue?.trim()?.length > 0 ? a?.fieldValue?.split(' | ') : []}
                                        handleUpdate={(val) => handleRecordContextInputChange(index, val)}
                                    />
                                    {errors[index] && <p className="text-red-500 text-sm">{errors[index]}</p>}

                                </div> : <></>)}
                        </>

                    ))}
                </CardContent>
            </Card>
        }
            {isRecordContextUpdated && (
                <div className="flex gap-4 fixed bottom-6 right-6 border bg-white px-4 py-2 rounded-1 shadow-lg">
                    <Button variant="outline" onClick={() => fetchRecord()}>Reset</Button>
                    <Button disabled={!isObjectEmptyOrAllUndefined(errors)}  onClick={handleContextSavingToServer}>Save</Button>
                </div>)}
        </div>);
}

export default RecordContext;
