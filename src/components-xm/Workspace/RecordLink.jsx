import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosConn from "@/axioscon.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button.jsx";
import {ChevronsUpDown, Terminal, Trash2} from "lucide-react";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command.jsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.jsx";
import {toast} from "@/components/hooks/use-toast.js";
import {useAuthStore} from "@/zustland/store.js";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import AssigneeModule from "@/components-xm/Workspace/Modules/AssigneeModule.jsx";
import StatusView from "@/components-xm/Workspace/Modules/StatusView.jsx";

function RecordLink() {
    const navigate = useNavigate();
    const {WorkspaceId, RecordId} = useParams();

    const [recordLinks, setRecordLinks] = useState([]);
    const [addCommentView, setAddCommentView] = useState(false);
    const [label, setLabel] = useState(null);
    const [labelDropOpen, setLabelDropOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [filteredLabels, setFilteredLabels] = useState([]);
    const [linkType, setLinkType] = useState("is_blocked_by");
    const {orgData} = useAuthStore()

    const linkTypeLabels = {
        "blocks": "Blocks",
        "is_blocked_by": "Is Blocked By",
        "depends_on": "Depends On",
        "is_depended_on_by": "Is Depended On By",
        "clones": "Clones",
        "is_cloned_by": "Is Cloned By",
        "duplicates": "Duplicates",
        "is_duplicated_by": "Is Duplicated By",
        "causes": "Causes",
        "is_caused_by": "Is Caused By"
    };

    // Fetch linked records
    useEffect(() => {
        getLinkedRecords()
    }, [WorkspaceId, RecordId]);

    // Fetch and filter records based on search query
    useEffect(() => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "Record", attributes: [], where: {
                    workspaceId: WorkspaceId,
                    orgId: localStorage.getItem('currentOrg'),
                    "$or": [{recordId: {$like: `%${query}%`}}, {recordTitle: {$like: `%${query}%`}}]
                }
            }
        })
            .then(response => {
                console.log(response.data?.data?.results)
                setFilteredLabels(response.data?.data?.results || [])
            })
            .catch(error => console.error("Error fetching labels:", error));
    }, [query]);


    // Fetch and filter records based on search query
    useEffect(() => {
        axiosConn.post("http://localhost:3000/searchRecord", {
            limit: 10, offset: 0, getThisData: {
                datasource: "Record", attributes: [], where: {
                    workspaceId: WorkspaceId, orgId: localStorage.getItem('currentOrg'),
                }
            }
        })
            .then(response => {
                console.log(response.data?.data?.results)
                setFilteredLabels(response.data?.data?.results || [])
                console.log("Detched Records :: ", response.data?.data?.results)
            })
            .catch(error => console.error("Error fetching labels:", error));
    }, []);

    const getLinkedRecords = () => {
        axiosConn.post("http://localhost:3000/getLinkedRecords", {
            workspaceId: WorkspaceId, orgId: localStorage.getItem('currentOrg'), recordId: RecordId
        })
            .then(res => setRecordLinks(res?.data?.data || []))
            .catch(err => {
                console.error("Error fetching linked records:", err);
            });

    }

    // Delete record link
    const handleDelete = (item) => {
        axiosConn.post("http://localhost:3000/deleteRecordLink", {
            recordLinkId: item?.recordLinkId
        })
            .then(() => {
                setRecordLinks(prev => prev.filter(link => link.recordLinkId !== item.recordLinkId));
            })
            .catch(err => console.error("Error deleting link:", err));
    };

    const handleUpdate = () => {
        if (!label?.recordId) {
            toast({
                title: "The target record cannot be empty", variant: "destructive"
            })
            return;
        }
        axiosConn.post("http://localhost:3000/createRecordLink", {
            workspaceId: WorkspaceId,
            orgId: localStorage.getItem('currentOrg'),
            recordIdA: RecordId,
            recordIdB: label?.recordId,
            linkType: linkType
        })
            .then(() => {
                setLabel(null);
                getLinkedRecords()
                toast({
                    title: "Link updated successfully",
                })
            })
            .catch(err => console.error("Error deleting link:", err));
    };

    useEffect(() => {
        console.log("Filtered Labels", filteredLabels)
    }, [filteredLabels]);

    return (<Card className="rounded-none my-4 shadow-md">
        <CardHeader className="flex flex-row items-center bg-muted/50">
            <CardTitle className="text-lg font-normal">LINKS</CardTitle>
            <div className="ml-auto">
                <Button
                    className="h-8"
                    disabled={addCommentView}
                    onClick={() => setAddCommentView(true)}
                >
                    Add Link
                </Button>
            </div>
        </CardHeader>
        <Separator/>
        <CardContent className="py-4">
            <div
                className={`transition-all duration-500 ease-in-out  overflow-hidden rounded ${addCommentView ? "max-h-fit opacity-100 p-4" : "max-h-0 opacity-0 p-0"}`}>
                <div className="flex gap-2  items-center ">
                    <p>This record</p>
                    <Select onValueChange={setLinkType} value={linkType}>
                        <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="Select Link Type"/>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(linkTypeLabels).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>))}
                        </SelectContent>
                    </Select>

                    <Popover open={labelDropOpen} onOpenChange={setLabelDropOpen}>
                        <PopoverTrigger asChild className=" w-1/3">
                            <Button
                                variant="outline"
                                role="combobox"
                                className="  justify-between font-normal truncate"
                            >
                                    <span
                                        className="truncate">{label ? `${label.recordId} - ${label?.recordTitle}` : "Select Record..."}</span>
                                <ChevronsUpDown className="opacity-50 shrink-0"/>
                            </Button>

                        </PopoverTrigger>
                        <PopoverContent align="end">
                            <Command>
                                <CommandInput
                                    placeholder="Filter records..."
                                    autoFocus
                                    value={query || ''}
                                    onValueChange={setQuery}
                                />
                                <CommandList>
                                    {Array.isArray(filteredLabels) && filteredLabels?.length === 0 ? (
                                        <CommandEmpty>No record found.</CommandEmpty>) : <></>}
                                    {Array.isArray(filteredLabels) && filteredLabels.map((labelItem) => (<CommandItem
                                        key={labelItem.recordId}
                                        value={labelItem.recordId}
                                        onSelect={() => {
                                            setLabel(labelItem);
                                            console.log(labelItem);
                                            setLabelDropOpen(false);
                                        }}
                                    >
                                        {labelItem.recordId} - {labelItem.recordTitle}
                                    </CommandItem>))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button type="button" size="sm" onClick={() => {
                        setAddCommentView(false);
                        setLabel(null)
                    }}>Close</Button>
                    <Button size="sm" type="button" onClick={() => setLabel(null)}>Reset</Button>
                    <Button size="sm" onClick={() => handleUpdate()}>Publish</Button>
                </div>
            </div>

            {/*{recordLinks.map(item => (<Badge*/}
            {/*    key={item?.recordLinkId}*/}
            {/*    variant="secondary"*/}
            {/*    className="flex items-center gap-2 rounded-md p-3 text-base font-normal my-2"*/}
            {/*>*/}
            {/*    {RecordId == item.recordIdA ? (<p>This record <u>{linkTypeLabels[item?.linkType]}</u> Record #*/}
            {/*        <Link target="_blank" className="text-blue-800"*/}
            {/*              to={`/workspace/${WorkspaceId}/record/${item?.recordIdB}?tab=record`}>*/}
            {/*            {item?.recordIdB}*/}
            {/*        </Link>*/}
            {/*    </p>) : (<p>This record <u>{linkTypeLabels[item?.reverseLinkType]}</u> Record #*/}
            {/*        <Link target="_blank" className="text-blue-800"*/}
            {/*              to={`/workspace/${WorkspaceId}/record/${item?.recordIdA}?tab=record`}>*/}
            {/*            {item?.recordIdA}*/}
            {/*        </Link>*/}
            {/*    </p>)}*/}
            {/*    <Button*/}
            {/*        size="icon"*/}
            {/*        variant="ghost"*/}
            {/*        className="h-4 w-4 p-0 ml-auto text-muted-foreground hover:text-red-500 hover:bg-red-100"*/}
            {/*        onClick={() => handleDelete(item)}*/}
            {/*    >*/}
            {/*        <X className="h-3 w-3"/>*/}
            {/*    </Button>*/}
            {/*</Badge>))}*/}

            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">LINK TYPE</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>TITLE</TableHead>
                        <TableHead>ASSIGNEE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recordLinks.map(item => (<TableRow
                        key={item?.recordLinkId}
                    >
                        {RecordId == item.recordIdA ? <>
                            <TableCell className="font-medium">
                                {linkTypeLabels[item?.linkType]}</TableCell>
                            <TableCell>
                                <Link target="_blank"
                                      to={`/workspace/${WorkspaceId}/record/${item?.recordIdB}?tab=record`}>
                                    {item?.recordIdB}
                                </Link></TableCell>
                            <TableCell className="">
                                <Link target="_blank"
                                      to={`/workspace/${WorkspaceId}/record/${item?.recordIdB}?tab=record`}>
                                    {item?.recordBDetail?.recordTitle}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <AssigneeModule isEditable={false} intialValue={item?.recordBDetail?.assignedto}
                                                uiType={'Avatar'} recordId={item?.recordBDetail?.recordId}/>
                            </TableCell>
                            <TableCell>
                                <StatusView initialStatus={item?.recordBDetail?.currentstatusdetail?.statusName}/>
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(item)}
                                >
                                    <Trash2 className="h-3 w-3"/>
                                </Button> </TableCell></> :
                            <>
                                <TableCell className="font-medium">
                                    {linkTypeLabels[item?.reverseLinkType]}</TableCell>
                                <TableCell>
                                    <Link target="_blank"
                                          to={`/workspace/${WorkspaceId}/record/${item?.recordIdA}?tab=record`}>
                                        {item?.recordIdA}
                                    </Link></TableCell>
                                <TableCell className="">
                                    <Link target="_blank"
                                          to={`/workspace/${WorkspaceId}/record/${item?.recordIdA}?tab=record`}>
                                        {item?.recordADetail?.recordTitle}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <AssigneeModule isEditable={false} intialValue={item?.recordADetail?.assignedto}
                                                    uiType={'Avatar'} recordId={item?.recordADetail?.recordId}/>
                                </TableCell>
                                <TableCell>
                                    <StatusView initialStatus={item?.recordADetail?.currentstatusdetail?.statusName}/>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <Trash2 className="h-3 w-3"/>
                                    </Button> </TableCell></>}
                    </TableRow>))} </TableBody>
            </Table>
            {recordLinks && recordLinks.length == 0 && <>
                <Alert>
                    <Terminal className="h-4 w-4"/>
                    <AlertTitle>No Links Exist !</AlertTitle>
                    <AlertDescription>
                        There are no links present for thhis record
                    </AlertDescription>
                </Alert></>}
        </CardContent>
    </Card>);
}

export default RecordLink;
