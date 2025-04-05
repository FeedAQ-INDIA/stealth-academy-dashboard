import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.jsx";
 import axiosConn from "../../../axioscon.js";
import {Separator} from "@/components/ui/separator.jsx";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Badge} from "@/components/ui/badge.jsx";
import {Copy} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {useToast} from "@/components/hooks/use-toast.js";

function API() {
    const { toast } = useToast(); // Get the toast function
    const navigate = useNavigate();
    const {WorkspaceId, APIChannelId} = useParams();

    const [apiDetail, setApiDetail] = useState([]);
    const [apiManual, setApiManual] = useState([]);


    useEffect(() => {
        fetchRecord();

    }, [APIChannelId, WorkspaceId]);

    const fetchRecord = () => {
        axiosConn
            .post("http://localhost:3000/searchRecord", {
                limit: 2, offset: 0, getThisData: {
                    datasource: "APIChannel", order: [], attributes: [], where: {
                        orgId: localStorage.getItem("currentOrg"),
                        workspaceId: WorkspaceId,
                        apiChannelId: APIChannelId,
                    },
                    include: [
                        {
                            datasource: "User",
                            as: "createdby"
                        },
                        {
                            datasource: "Layout",
                            as: "layoutdetail"
                        },

                    ]
                },
            })
            .then((res) => {
                console.log(res.data);
                setApiDetail(res.data.data?.results?.[0]);
                fetchApiManual(res.data.data?.results?.[0]?.apiChannelId)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const  fetchApiManual = (apiChannelId) => {
        axiosConn
            .post("http://localhost:3000/getAPIManual", {
                workspaceId: WorkspaceId,
                apiChannelId:  apiChannelId,
                orgId: localStorage.getItem("currentOrg"),
            })
            .then((res) => {
                console.log(res.data?.data);
                setApiManual(res.data?.data);

            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className=" ">


            <CardHeader className="flex md:flex-row sm:flex-col gap-4 items-start  bg-muted/50">
                <div>
                    <CardTitle className="text-lg">API Builder</CardTitle>
                    <CardDescription>Collect data from any platform through API's</CardDescription>
                </div>

                <div className="ml-auto sm:flex-initial">

                </div>
            </CardHeader>


            <div className="flex flex-col gap-4 p-4">
                <div className=" ">

                    <Card className="rounded-none my-4 shadow-md">
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg font-normal">General Information</CardTitle>
                        </CardHeader>
                        <Separator className="mb-3"/>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">API Channel Name</p>
                                    <h5>{apiDetail?.apiChannelName || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">Description</p>
                                    <h5>{apiDetail?.apiChannelDescription || "N/A"}</h5>
                                </div>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Status</p>
                                    <h5>{apiDetail?.apiChannelStatus || "N/A"}</h5>
                                </div>

                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">API Key</p>
                                    <h5>{apiDetail?.apiChannelKey || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created By</p>
                                    <h5>{apiDetail?.createdby?.firstName || "N/A"}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Created at</p>
                                    <h5>{apiDetail?.created_date} {apiDetail?.created_time}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2">
                                    <p className="text-muted-foreground">Last updated at</p>
                                    <h5>{apiDetail?.updated_date} {apiDetail?.updated_time}</h5>
                                </div>
                                <div className="border-none rounded-1 hover:bg-muted/50 p-2 col-span-3">
                                    <p className="text-muted-foreground">Layout</p>
                                    <div className="flex gap-2 mt-2">
                                        {apiDetail?.layoutdetail?.layoutName}
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    <Accordion type="single" collapsible className="w-full my-4">
                        <AccordionItem value="item-1" className="border shadow-md">
                            <AccordionTrigger className="text-lg font-normal bg-muted/50 p-6 ">API MANUAL</AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="py-4">
                                    <div className=" flex  my-2   gap-2">
                                        <Badge>POST</Badge>

                                        <div>
                                            https://api.feedaq.com/helpdesk/send-data
                                        </div>
                                    </div>
                                    <div className=" flex my-2  gap-2">
                                        <Badge>HEADER : Authorization</Badge>

                                        <div>
                                            {`{API_KEY}`}
                                        </div>
                                    </div>
                                    <div className=" grid grid-cols-1 md:grid-cols-2   gap-4">

                                        <div className="mt-4 bg-black text-white rounded-1 p-4">
                                            <div className="flex gap-4 items-center w-full bg-muted text-black p-3 text-center font-medium">
                                                <div className="flex-1 text-center">
                                                    REQUEST</div>
                                                <div className="ml-auto sm:flex-initial">
                                                    <Button size="sm"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(JSON.stringify(apiManual, null,2)).then(() => {
                                                                    toast({
                                                                        title: 'Request Copied Successfully !'
                                                                    })
                                                                 });
                                                            }}
                                                    ><Copy/></Button>
                                                </div>
                                            </div>
                                            <div className="mt-4  max-h-[80svh] overflow-y-auto">


                                    <pre>
 {JSON.stringify(apiManual, null,2)}
                                                                 </pre>
                                            </div>
                                        </div>

                                        <div className="mt-4 bg-black text-white rounded-1 p-4">
                                            <div className="flex gap-4 items-center w-full bg-muted text-black p-3 text-center font-medium">
                                                <div className="flex-1 text-center">
                                                    RESPONSE</div>
                                                <div className="ml-auto sm:flex-initial">
                                                    <Button size="sm"><Copy/></Button>
                                                </div>
                                            </div>
                                            <div className="mt-4  max-h-[80svh] overflow-y-auto">


                                    <pre>

                                    {`curl --location 'https://2factor.in/API/R1/Bulk/' \\
--header 'Content-Type: application/json' \\
--data '{
  "module": "TRANS_SMS",
  "apikey": "XXXX-XXXX-XXXX-XXXX-XXXX",
  "messages": [
    {
      "smsFrom": "TFACTR",
      "smsTo": "+91XXXXXXXXXXX",
      "smsText": "First message"
    },
    {
      "smsFrom": "TFACTR",
      "smsTo": "+91XXXXXXXXXXX",
      "smsText": "Second message"
    },
    {
      "smsFrom": "TFACTR",
      "smsTo": "+91XXXXXXXXXXX",
      "smsText": "Third message"
\t}]
}'`}
                                                                 </pre>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>


                </div>
            </div>


        </div>
    );
}

export default API;
