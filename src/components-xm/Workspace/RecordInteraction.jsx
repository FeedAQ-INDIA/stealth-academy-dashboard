import React, {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button.jsx";
import {ChevronsUpDown, Terminal, X} from "lucide-react";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {useAuthStore  } from "@/zustland/store.js";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import StatusModule from "@/components-xm/Workspace/Modules/StatusModule.jsx";
import JsonParserUI from "@/components-xm/Workspace/Modules/JsonParserUI.jsx";



function RecordInteraction() {
    const navigate = useNavigate();
    const {WorkspaceId, RecordId} = useParams();
    const [interactionList, setInteractionList] = useState([]);
    const [selectedInteraction, setSelectedInteraction] = useState(null);

     // Fetch linked records
    useEffect(() => {
        getRecords()
    }, [WorkspaceId, RecordId]);


    const getRecords = () => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "RecordInteraction", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem('currentOrg'),
                    recordId: RecordId
                }
            }
        })
            .then(response => {
                console.log(response.data?.data?.results)
                setInteractionList( response.data?.data?.results || [])
                setSelectedInteraction(response.data?.data?.results?.[0] || null)
                console.log("Detched Records :: ", response.data?.data?.results )
            })
            .catch(error => console.error("Error fetching labels:", error));

    }



    return (
        < >
            <Card className="rounded-none my-4  shadow-md">
                <div className="overflow-hidden">
                    <CardHeader className=" bg-muted/50">
                        <CardTitle className="text-lg font-normal">
                            INTERACTIONS
                        </CardTitle>
                    </CardHeader>
                    <Separator/>
                    <CardContent className="p-0">
                        {interactionList && interactionList.length > 0 &&
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="min-h-[400px]  rounded-lg border w-full rounded-none"
                        >
                            <ResizablePanel defaultSize={25}>
                                <div className="flex flex-col gap-3 h-full p-2">
                                    {
                                        interactionList.map(a => (
                                            <Card className={`hover:shadow-md ${selectedInteraction.recordInteractionId == a.recordInteractionId ? 'border-2 border-blue-800  shadow-md' : ''}`} >
                                                <CardHeader className="p-2"><h3 className="text-xs font-medium">SELF SERVICE FIELD CONFIG FOR RECORDS</h3>
                                                </CardHeader>
                                                <CardContent className=" flex flex-col gap-1 p-2">
                                                    <p className="text-xs text-muted-foreground">{a?.created_date} {a?.created_time}</p>
                                               </CardContent>
                                            </Card>
                                        ))
                                    }

                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={75}>
                                <div className="flex flex-col gap-3 text-sm h-full p-6">
                                    <JsonParserUI jsonData={selectedInteraction?.interactionJSON}/>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                        }

                        {interactionList && interactionList.length == 0 &&
                            <div className="p-6">


                            <Alert>
                                <Terminal className="h-4 w-4"/>
                                <AlertTitle>No Interactions Yet !</AlertTitle>
                                <AlertDescription>
                                    There are no interactions present for this record
                                </AlertDescription>
                            </Alert> </div>
                        }

                            </CardContent>
                </div>
            </Card>

    </ >);
}

export default RecordInteraction;
