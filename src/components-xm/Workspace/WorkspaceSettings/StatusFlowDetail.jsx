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


function StatusFlowDetail() {
    const {WorkspaceId, StatusConfigurationId} = useParams();

    const [statuses, setStatuses] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        console.log(StatusConfigurationId)
        if (StatusConfigurationId) {
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
        try {
            await axiosConn.post(`http://localhost:3000/createEditStatusFlow`, {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem("currentOrg"),
                statusConfigurationStatus: "ACTIVE",
                statusConfigurationName: "CONFIG_1",
                statusConfigurationDescription: "", ...(StatusConfigurationId && {statusConfigurationId: StatusConfigurationId}),
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



            <div className="flex flex-col gap-4  w-100  ">



                {statuses && statuses?.length > 0 ?

                    <div>
                             <CardTitle className="font-normal text-lg">All Statuses</CardTitle>
                         <div className="py-4">
                            <div className="flex gap-2">
                                {statuses?.map((status) => (<Button
                                    key={status.statusName}
                                     variant="outline"
                                 >
                                    {status.statusName}
                                </Button>))}
                            </div>
                        </div>
                    </div>

                    : <></>}
<Separator/>
                {edges && edges?.length > 0 ?

                    <div>
                        <div  >
                            <CardTitle className="font-normal text-lg">Status Transitions</CardTitle>
                         </div>
                        <div className="py-4">
                            <div className="flex gap-2">


                                {edges?.map((edge) => (<Button
                                    key={edge.id}
                                     variant="outline"
                                 >
                                    {edge.source} → {edge.target}
                                </Button>))}
                            </div>
                        </div>
                    </div> : <></>}


                <div className={"border-black border h-[50svh]"}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        nodesDraggable={true} // Allow dragging
                        nodesConnectable={false} // Disable new connections
                        elementsSelectable={false} // Prevent selection
                    >
                        <MiniMap/>
                        <Controls/>
                    </ReactFlow>
                </div>


            </div>
        </div>

    );
}

export default StatusFlowDetail;
