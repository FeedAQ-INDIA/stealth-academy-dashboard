import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import { useParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";

function StatusModule({initialStatus, possibleTransitions,  recordId, isEditable=false}) {
    const {toast} = useToast();

    const { WorkspaceId, StakeholderId, RecordId } = useParams();

    const [status, setStatus] = useState(initialStatus);
    const [possibleStatusTransitions, setPossibleStatusTransitions] = useState([]);

    useEffect(() => {
        console.log(initialStatus);
        if(initialStatus){
            setStatus(initialStatus);
         }
    }, [initialStatus]);

    useEffect(() => {

            fetchPossibleStatusTransitions();

    }, [status]);


    const handleStatusChange = (newStatus) => {

        axiosConn.post("http://localhost:3000/updateStatus", {
            workspaceId: WorkspaceId,
            ...(StakeholderId && {stakeholderId: StakeholderId}),
            ...(recordId ? { recordId: recordId } : RecordId ? { recordId: RecordId } : {}),
            newStatus: newStatus?.statusId,
            orgId: localStorage.getItem("currentOrg"),
        })
            .then(response => {
                setStatus(newStatus);
                console.log("Status updated successfully:", response.data)
                toast({
                    title: "Status updated successfully!",
                })
            })
            .catch(error => {
                toast({
                    title: "Status update failed!",
                });
                console.error("Error updating status:", error)
            });
    };

    const fetchPossibleStatusTransitions = () => {
        axiosConn.post("http://localhost:3000/getPossibleStatusTransitions", {
                workspaceId: WorkspaceId,
                orgId: localStorage.getItem('currentOrg'),
                fromStatusId: status?.statusId
            }
        ).then(res => {
            console.log(res.data);
            setPossibleStatusTransitions(res?.data?.data)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Select value={status} onValueChange={handleStatusChange} className="mx-auto">
                <SelectTrigger className="font-medium">
                    <SelectValue>{status?.statusName || "Select Status"}</SelectValue>
                </SelectTrigger>
                {possibleStatusTransitions?.length > 0?<SelectContent>
                    <SelectGroup>
                        {possibleStatusTransitions?.map((a, index) => (
                            <SelectItem key={index} value={a?.to}>
                                {a?.to?.statusName}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent> : <></> }
            </Select>
        </div>
    );
}

export default StatusModule;
