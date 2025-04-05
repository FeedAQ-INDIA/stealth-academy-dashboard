import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {Button} from "@/components/ui/button.jsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useToast} from "@/components/hooks/use-toast.js";
import axiosConn from "@/axioscon.js";
import {ChevronsUpDown} from "lucide-react";

function ContextConfigModule({ value, onChange, isEditable = true }) {
    const { WorkspaceId, LayoutId } = useParams();
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);
    const { toast } = useToast();

    const [defaultConfig, setDefaultConfig] = useState(null);
    useEffect(() => {
        if (isEditable) {
            fetchConfig();
        }
    }, [isEditable, LayoutId]);

    useEffect(() => {
        console.log(value)
        if (value) {
            fetchSelectedConfig();
        }else{
            setDefaultConfig(null)
        }
    }, [value]);

    const fetchSelectedConfig = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 5,
                offset: 0,
                getThisData: {
                    datasource: "ContextConfiguration",
                    attributes: [],
                    where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"),
                        contextConfigurationId: value,
                    },
                },
            })
            .then((res) => {
                setDefaultConfig(res?.data?.data?.results?.[0]);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchConfig = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 5,
                offset: 0,
                getThisData: {
                    datasource: "ContextConfiguration",
                    attributes: [],
                    where: {
                        workspaceId: WorkspaceId,
                        orgId: localStorage.getItem("currentOrg"),
                        ...(query && query.length > 0 && {
                            contextConfigurationName: { "$like": `%${query}%` },
                        }),
                    },
                },
            })
            .then((res) => {
                setFilteredLabels(res?.data?.data?.results || []);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleSelection = (newValue) => {
        console.log(newValue);
        onChange(newValue? newValue?.contextConfigurationId : null); // Update React Hook Form state
        setLabelDropOpen(false);

        toast({ title: "Layout status updated!" });
    };

    useEffect(() => {
       console.log(defaultConfig)
    }, [defaultConfig]);


    return (
        <Popover open={labelDropOpen} onOpenChange={setLabelDropOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={labelDropOpen}
                    className="w-full justify-between font-normal cursor-pointer"
                >
                    {defaultConfig!= null ? defaultConfig?.contextConfigurationName : 'NONE'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-full p-2 rounded-1">
                <Command>
                    <CommandInput
                        placeholder="Filter label..."
                        autoFocus
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No label found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="NONE"
                                onSelect={() => handleSelection(null)}
                            >
                                NONE
                            </CommandItem>
                            {filteredLabels?.map((labelItem) => (
                                <CommandItem
                                    key={labelItem.contextConfigurationId}
                                    value={labelItem.contextConfigurationName}
                                    onSelect={() => handleSelection(labelItem)}
                                >
                                    {labelItem.contextConfigurationName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export  default ContextConfigModule;