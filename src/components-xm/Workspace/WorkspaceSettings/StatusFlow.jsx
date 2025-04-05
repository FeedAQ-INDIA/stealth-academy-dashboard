import React, {useCallback, useEffect, useState} from "react";
import axiosConn from "@/axioscon.js";
import "@reactflow/core/dist/style.css";
import {MiniMap} from "@reactflow/minimap";
import {Controls} from "@reactflow/controls";
import {ReactFlow, useEdgesState, useNodesState} from "@reactflow/core";
import {SidebarTrigger} from "@/components/ui/sidebar.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage} from "@/components/ui/breadcrumb.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useParams} from "react-router-dom";

const API_URL = "your_api_base_url"; // Replace with actual API URL


function StatusFlow() {
    const {WorkspaceId, StakeholderId} = useParams();

    const [statuses, setStatuses] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {


        loadStatusFlowsFromServer();
    }, []);


    const loadStatusFlowsFromServer = async () => {
        const formattedStatus  = await fetchStatuses();  // Wait for statuses to load
        fetchTransitions(formattedStatus);     // Then fetch transitions
    }



    useEffect(() => {
        createGraphElements();
    }, [statuses, transitions]);

    const fetchStatuses = async () => {
        try {
            const res = await axiosConn.post(`http://localhost:3000/searchRecord`,
                {
                    limit: 15, offset: 0, getThisData: {
                        datasource: "Statuses",  attributes: [], where: {
                            workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                            statusConfigurationId:3
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
            const res = await axiosConn.post(`http://localhost:3000/searchRecord`,
                {
                    limit: 15, offset: 0, getThisData: {
                        datasource: "StatusesTransition",  attributes: [], where: {
                            workspaceId: WorkspaceId, orgId: localStorage.getItem("currentOrg"),
                            statusConfigurationId:3
                        }
                    }
                });
           const modelledTransitions = res.data?.data?.results?.map(a => {
               console.log(formattedStatus)
                   const fromStatusName = formattedStatus.filter(b =>  (b.statusId) ==  (a.fromStatus))?.[0]?.statusName
                   const toStatusName = formattedStatus.filter(b =>  (b.statusId) ==  (a.toStatus))?.[0]?.statusName

                   a.fromStatus = fromStatusName;
                   a.toStatus = toStatusName;
                   return a ;
               }
            )
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
        try {
            await axiosConn.post(`http://localhost:3000/createEditStatusFlow`, {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem("currentOrg"),
                statusConfigurationStatus: "ACTIVE",
                statusConfigurationName: "CONFIG_1",
                statusConfigurationDescription: "",
                statusConfigurationId: 3,
                possibleStatus: statuses,
                possibleStatusTransition: transitions
            });
            setIsUpdated(false);
            alert("Workflow saved successfully!");
        } catch (error) {
            console.error("Error saving workflow:", error);
        }

    };

    return (<div>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

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


                <div className={"border-black border h-[50svh]"}>
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
                </div>


                <div className="flex gap-2">
                    <Button
                        onClick={loadStatusFlowsFromServer}
                        disabled={!isUpdated}

                    >
                       Reset
                    </Button>
                    <Button
                        onClick={saveChanges}
                        disabled={!isUpdated || ( statuses && statuses?.length==0 )}

                    >
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>

    );
}

export default StatusFlow;
