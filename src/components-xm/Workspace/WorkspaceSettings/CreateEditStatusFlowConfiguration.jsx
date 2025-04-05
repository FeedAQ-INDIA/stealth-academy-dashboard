import React, {useCallback, useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import "@reactflow/core/dist/style.css";
import {MiniMap} from "@reactflow/minimap";
import {Controls} from "@reactflow/controls";
import {ReactFlow, useEdgesState, useNodesState} from "@reactflow/core";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Link, useParams} from "react-router-dom";
import {Label} from "@/components/ui/label.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Info, Terminal} from "lucide-react";

const API_URL = "your_api_base_url"; // Replace with actual API URL


function CreateEditStatusFlowConfiguration() {
    const {WorkspaceId, StatusConfigurationId} = useParams();

    const [statuses, setStatuses] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);

    const [defaultStatus, setDefaultStatus] = useState(null);
    const [entryStatus, setEntryStatus] = useState(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const {toast} = useToast();

    useEffect(() => {

        if (StatusConfigurationId) {
            fetchStatusConfigDetail();
            loadStatusFlowsFromServer();
        }

    }, []);


    const loadStatusFlowsFromServer = async () => {
        const formattedStatus = await fetchStatuses();  // Wait for statuses to load
        fetchTransitions(formattedStatus);     // Then fetch transitions
    }


    useEffect(() => {
        createGraphElements();
    }, [statuses, transitions]);

    const [statusConfigDetail, setStatusConfigDetail] = useState({});
    const [statusConfigurationName, setStatusConfigurationName] = useState("");
    const [statusConfigurationDescription, setStatusConfigurationDescription] = useState("");
    const [statusConfigurationStatus, setStatusConfigurationStatus] = useState("ACTIVE");
    const fetchStatusConfigDetail = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 1, offset: 0, getThisData: {
                    datasource: "StatusConfiguration", order: [], attributes: [], where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"), ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId})
                    },
                    include:[
                        {
                            datasource: "Statuses", as: "defaultStatusDetail", order: [], attributes: ["statusId", "statusName" ],
                        },
                        {
                            datasource: "Statuses", as: "entryStatusDetail", order: [], attributes: ["statusId", "statusName"],
                        }
                    ]
                },
            })
            .then((res) => {
                console.log(res.data);
                setStatusConfigDetail(res.data?.data?.results?.[0]);
                setStatusConfigurationName(res.data?.data?.results?.[0]?.statusConfigurationName);
                setStatusConfigurationDescription(res.data?.data?.results?.[0]?.statusConfigurationDescription);
                setStatusConfigurationStatus(res.data?.data?.results?.[0]?.statusConfigurationStatus);
                setDefaultStatus(res.data?.data?.results?.[0]?.defaultStatusDetail?.statusId);
                setEntryStatus(res.data?.data?.results?.[0]?.entryStatusDetail?.statusId)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchStatuses = async () => {
        try {
            const res = await axiosConn.post(`http://localhost:3000/searchRecord`, {
                limit: 15, offset: 0, getThisData: {
                    datasource: "Statuses", attributes: [], where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"), ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId})
                    }
                }
            });
            const formattedStatuses = res.data?.data?.results?.map(status => ({
                ...status, statusColor: getRandomColor()
            }));
            setStatuses(formattedStatuses);
            return formattedStatuses;
        } catch (error) {
            console.error("Error fetching statuses:", error);
            return null;
        }
    };

    const fetchTransitions = async (formattedStatus) => {
        try {
            const res = await axiosConn.post(`http://localhost:3000/searchRecord`, {
                limit: 15, offset: 0, getThisData: {
                    datasource: "StatusesTransition", attributes: [], where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"), ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId})
                    }
                }
            });
            const modelledTransitions = res.data?.data?.results?.map(a => {
                console.log(formattedStatus)
                const fromStatusName = formattedStatus.filter(b => (b.statusId) == (a.fromStatus))?.[0]?.statusName
                const toStatusName = formattedStatus.filter(b => (b.statusId) == (a.toStatus))?.[0]?.statusName

                a.fromStatus = fromStatusName;
                a.toStatus = toStatusName;
                return a;
            })
            console.log("Transitions:", modelledTransitions);
            setTransitions(modelledTransitions);
        } catch (error) {
            console.error("Error fetching transitions:", error);
        }
    };

    const createGraphElements = () => {
        const newNodes = statuses.map((status, index) => ({
            id: status.statusName, // Use statusName as ID
            data: {label: status.statusName}, position: {x: index * 150, y: 100}, draggable: true, style: {
                backgroundColor: status.statusColor,
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "bold"
            }
        }));

        const newEdges = transitions?.map((transition) => ({
            id: `e${transition.fromStatus}-${transition.toStatus}`,
            source: transition.fromStatus,
            target: transition.toStatus,
            animated: true,
            type: "smoothstep",
            markerEnd: {type: "arrowclosed"},
            style: {stroke: getRandomColor(), strokeWidth: 2}
        }));

        setNodes(newNodes);
        setEdges(newEdges);
    };

    const addStatus = () => {
        if (!newStatus) return;

        const newStatusObj = {
            statusName: newStatus, statusColor: getRandomColor()
        };

        setStatuses([...statuses, newStatusObj]);

        setNodes([...nodes, {
            id: newStatusObj.statusName,
            data: {label: newStatusObj.statusName},
            position: {x: Math.random() * 400, y: Math.random() * 400},
            draggable: true,
            style: {
                backgroundColor: newStatusObj?.statusColor,
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "bold",
            }
        }]);

        setNewStatus("");
        setIsUpdated(true);
    };

    const onConnect = useCallback((params) => {
        const newTransition = {
            fromStatus: params.source, // Store statusName instead of ID
            toStatus: params.target
        };

        setTransitions([...transitions, newTransition]);
        setEdges([...edges, {
            ...params,
            animated: true,
            type: "smoothstep",
            markerEnd: {type: "arrowclosed"},
            style: {stroke: getRandomColor(), strokeWidth: 2}
        }]);
        setIsUpdated(true);
    }, [transitions, edges]);

    const getRandomColor = () => {
        const colors = ["#E91E63", "#FF5722", "#9C27B0", "#3F51B5", "#009688"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const removeStatus = (statusName) => {
        const updatedStatuses = statuses.filter(status => status.statusName !== statusName);
        const updatedTransitions = transitions.filter(transition => transition.fromStatus !== statusName && transition.toStatus !== statusName);

        setStatuses(updatedStatuses);
        setTransitions(updatedTransitions);

        setNodes(nodes.filter(node => node.id !== statusName));
        setEdges(edges.filter(edge => edge.source !== statusName && edge.target !== statusName));

        setIsUpdated(true);
    };

    const removeEdge = (edgeId) => {
        const updatedEdges = edges.filter(edge => edge.id !== edgeId);
        const updatedTransitions = transitions.filter(transition => `e${transition.fromStatus}-${transition.toStatus}` !== edgeId);

        setEdges(updatedEdges);
        setTransitions(updatedTransitions);
        setIsUpdated(true);
    };


    const saveChanges = async () => {
        console.log(statuses);
        console.log(transitions)
        await axiosConn.post(`http://localhost:3000/createEditStatusFlow`, {
            workspaceId: WorkspaceId,
            orgId: localStorage.getItem("currentOrg"),
            statusConfigurationStatus: statusConfigurationStatus,
            statusConfigurationName: statusConfigurationName,
            statusConfigurationDescription: statusConfigurationDescription, ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId}),
            possibleStatus: statuses,
            possibleStatusTransition: transitions,
            defaultStatus: defaultStatus ,
            entryStatus: entryStatus
        }).then(res => {
            setIsUpdated(false);
            fetchStatusConfigDetail();
            loadStatusFlowsFromServer();
            toast({
                title: res?.data?.data?.message
            })
        }).catch(err => {
            console.error("Error saving workflow:", err);
            fetchStatusConfigDetail();
            loadStatusFlowsFromServer();
            toast({
                title: "Error Occured while saving status flow",
            })
        });


    };

    useEffect(() => {
        console.log("Default Status Detail :: " ,entryStatus, statusConfigDetail?.entryStatusDetail?.statusId)
        if (statusConfigurationName === statusConfigDetail?.statusConfigurationName
            && statusConfigurationDescription === statusConfigDetail?.statusConfigurationDescription
            && statusConfigurationStatus === statusConfigDetail?.statusConfigurationStatus
            && defaultStatus === statusConfigDetail?.defaultStatusDetail?.statusId
            && entryStatus === statusConfigDetail?.entryStatusDetail?.statusId  ) {
            setIsUpdated(false);
        } else {
            setIsUpdated(true)
        }
    }, [statusConfigurationName, statusConfigurationStatus, statusConfigurationDescription, defaultStatus, entryStatus]);


    return (<div>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                <Link to={`/workspace/${WorkspaceId}/settings/status-flow?tab=status-flow`}>Status
                                    Config</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block"/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Status Flow Builder</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto sm:flex-initial">

                </div>
            </header>

            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-center bg-muted/50">
                <CardTitle className="text-lg">Status Flow Builder</CardTitle>
            </CardHeader>

            <div className="flex flex-col gap-4 p-4 w-100  ">
                <div className="relative flex items-center mb-4">
                    <hr className="flex-grow border-t border-gray-300"/>
                    <span className="px-4 text-gray-500 text-sm font-medium">Status Configuration</span>
                    <hr className="flex-grow border-t border-gray-300"/>
                </div>
                <div>
                    <div className="py-4">
                        <div className="grid w-full   items-center gap-3 my-4">

                            <Label>Status Configuration Name</Label>
                            <Input placeholder="Status Configuration Name"
                                   onChange={(e) => setStatusConfigurationName(e.target.value)}
                                   value={statusConfigurationName}/>
                        </div>
                        <div className="grid w-full   items-center gap-3 my-4">

                            <Label>Status Configuration Description</Label>
                            <Textarea placeholder="Status Configuration Description"
                                      onChange={(e) => setStatusConfigurationDescription(e.target.value)}
                                      value={statusConfigurationDescription}/>
                        </div>
                        <div className="grid w-full   items-center gap-3 my-4">

                            <Label>Status Configuration Status</Label>
                            <Select
                                onValueChange={(val) => setStatusConfigurationStatus(val)}
                                value={statusConfigurationStatus}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status Configuration Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select></div>

                    </div>
                </div>


                {statusConfigurationName?.trim()?.length > 3 ? <>
                    <div className="relative flex items-center mb-4">
                        <hr className="flex-grow border-t border-gray-300"/>
                        <span className="px-4 text-gray-500 text-sm font-medium">Status Flow Builder</span>
                        <hr className="flex-grow border-t border-gray-300"/>
                    </div>
                    <Card>
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="font-normal text-lg">Create a new status</CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="flex w-full items-center space-x-2 mt-2">
                                <Input type="text" value={newStatus}
                                       onChange={(e) => setNewStatus((e.target.value)?.toUpperCase())}
                                       placeholder={"Enter Status Name"}/>
                                <Button disabled={newStatus?.trim() === ''} onClick={addStatus}>Add Status</Button>
                            </div>
                            <Separator className="my-4"/>
                            {!StatusConfigurationId &&  <Alert>
                                <Info className="h-4 w-4"/>
                                <AlertTitle>You can set the default status and entry status once the configuration is created</AlertTitle>
                                <AlertDescription> </AlertDescription>
                            </Alert>}
                            {statuses && statuses?.length > 0 && StatusConfigurationId ?
                                <div className="flex w-full items-center space-x-2 mt-2">
                                    <div className=" w-full   mt-2">
                                        <Label>Select a Default Status</Label>

                                        <Select
                                            onValueChange={(val) => {setDefaultStatus(val)}}
                                            defaultValue={defaultStatus}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="NONE"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses?.map((status) => (
                                                    <SelectItem key={status.statusId} value={status.statusId}>
                                                        {status.statusName}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value={null}>NONE</SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>
                                    <div className=" w-full  mt-2">
                                        <Label>Select a Entry Status</Label>
                                        <Select
                                            onValueChange={(val) => {setEntryStatus(val)}}
                                            defaultValue={entryStatus}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="NONE"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses?.map((status) => (
                                                    <SelectItem key={status.statusId} value={status.statusId}>
                                                        {status.statusName}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value={null}>NONE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div> : <></>}
                        </CardContent>
                    </Card>


                    {statuses && statuses?.length > 0 ?

                        <Card>
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="font-normal text-lg">Manage Statuses</CardTitle>
                                <CardDescription>Click to remove the status</CardDescription>
                            </CardHeader>
                            <CardContent className="py-4">
                                <div>
                                    {statuses?.map((status) => (<Button
                                        key={status.statusName}
                                        onClick={() => removeStatus(status.statusName)}
                                        variant="outline"
                                        className={`m-2  `}
                                    >
                                        {status.statusName}
                                    </Button>))}
                                </div>
                            </CardContent>
                        </Card>

                        : <></>}

                    {edges && edges?.length > 0 ?

                        <Card>
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="font-normal text-lg">Manage Transitions</CardTitle>
                                <CardDescription>Click to remove the transitions</CardDescription>
                            </CardHeader>
                            <CardContent className="py-4">
                                <div>


                                    {edges?.map((edge) => (<Button
                                        key={edge.id}
                                        onClick={() => removeEdge(edge.id)}
                                        variant="outline"
                                        className={`m-2`}
                                    >
                                        {edge.source} → {edge.target}
                                    </Button>))}
                                </div>
                            </CardContent>
                        </Card> : <></>}

                    {statuses && statuses?.length > 0 ? <div className={"border-black border h-[50svh]"}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            fitView

                        >
                            <MiniMap/>
                            <Controls/>
                        </ReactFlow>
                    </div> : <></>}

                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                if (StatusConfigurationId) {
                                    loadStatusFlowsFromServer()
                                    fetchStatusConfigDetail()
                                }else {
                                    setStatusConfigDetail({});
                                    setStatusConfigurationName("");
                                    setStatusConfigurationDescription("");
                                    setStatusConfigurationStatus("ACTIVE");
                                    setDefaultStatus(null);
                                    setEntryStatus(null)
                                }
                            }}
                            disabled={!isUpdated}

                        >
                            Reset
                        </Button>
                        <Button
                            onClick={saveChanges}
                            disabled={!isUpdated || (statuses && statuses?.length == 0) || statusConfigurationName?.trim() == ""}

                        >
                            Save Changes
                        </Button>
                    </div>

                </> : <></>}

            </div>
        </div>

    );
}

export default CreateEditStatusFlowConfiguration;
