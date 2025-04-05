import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.jsx";
import axiosConn from "@/axioscon.js";
import { useParams } from "react-router-dom";

function MultiSelectField({ fieldData, initialValue = [] , handleUpdate}) {
    const { WorkspaceId, StakeholderId, RecordId } = useParams();
    const [selectedValues, setSelectedValues] = useState([]);
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [query, setQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (initialValue &&  initialValue.length > 0 ) {
            setSelectedValues(initialValue);
        }
    }, [initialValue]);

    useEffect(() => {
        if (!fieldData) return;
        // console.log(fieldData.fieldOption)
        if(fieldData.fieldOption) {

            setOptions(fieldData.fieldOption);
            setFilteredOptions(fieldData.fieldOption);
        }
     }, [fieldData]);

    useEffect(() => {
        if (query.trim().length > 0) {
            setFilteredOptions(options.filter(opt => opt.toLowerCase().includes(query.toLowerCase())));
        } else {
            setFilteredOptions(options);
        }
    }, [query, options]);

    const handleSelect = (item) => {
         if (!selectedValues.some(val => val.trim().toLowerCase() === item.trim().toLowerCase())) {
             const updatedValues = [...selectedValues, item];
                setSelectedValues(updatedValues);
                console.log(updatedValues)
             handleUpdate?.(updatedValues.join(' | '))
         }
    };

    const handleDelete = (item) => {
        const updatedValues = selectedValues.filter(val => val !== item);

            setSelectedValues(updatedValues);
        console.log(updatedValues)
        handleUpdate?.(updatedValues.join(' | '))
     };

    return (
        <div>
            <div className="flex flex-col items-start justify-between border px-4 py-3">
                <p className="text-sm font-medium leading-none flex flex-wrap gap-2 items-center">
                    {selectedValues.map(item => (
                        <Badge key={item} variant="secondary" className="flex items-center gap-2 rounded-md px-2 py-1 text-xs">
                            <span>{item}</span>
                            <Button size="icon" variant="ghost" className="h-4 w-4 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-100" onClick={() => handleDelete(item)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}

                    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <PopoverTrigger asChild>
                            <Button size="xs" className="text-xs p-1">
                                <Plus />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[200px] p-2 rounded-1">
                            <Command>
                                <CommandInput placeholder={`Filter ${fieldData.fieldLabel}...`} autoFocus value={query} onValueChange={setQuery} />
                                <CommandList>
                                    <CommandEmpty>No {fieldData.fieldLabel} found.</CommandEmpty>
                                    <CommandGroup>
                                        {filteredOptions.map(item => (
                                            <CommandItem key={item} value={item} onSelect={() => { handleSelect(item); setDropdownOpen(false); }}>
                                                {item}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </p>
            </div>
        </div>
    );
}

export default MultiSelectField;
