import React, { useEffect, useState } from "react";
import {ChevronsUpDown, Plus, X} from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import { useParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import {useToast} from "@/components/hooks/use-toast.js";
import {Skeleton} from "@/components/ui/skeleton.jsx";

function StatusView({initialStatus}) {
    const {toast} = useToast();


    const [status, setStatus] = useState("");

    useEffect(() => {
        console.log(initialStatus);
        if(initialStatus){
            setStatus(initialStatus);
        }
    }, [initialStatus]);


    return (
        <div>
            {status && status!=""?

                <Button
                    variant="outline"
                    size="sm"
                    aria-expanded={open}
                    className="w-fit justify-between"
                >{status}
                </Button>

                : (<Skeleton className="h-8 w-full" />)}
        </div>
    );
}

export default StatusView;
