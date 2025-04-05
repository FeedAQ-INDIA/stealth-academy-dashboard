import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axiosConn from "@/axioscon";
import {Card, CardHeader, CardTitle,} from "@/components/ui/card";
import {useToast} from "@/components/hooks/use-toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useAuthStore  } from "@/zustland/store.js";
import {Separator} from "@/components/ui/separator.jsx";
import {Button} from "@/components/ui/button.jsx";
import backgroundImage from "@/assets/LOGIN_BACKGROUND.jpg";
import {Alert, AlertTitle} from "@/components/ui/alert.jsx";

function ManageOrg() {
    const navigate = useNavigate();
    const {toast} = useToast();
     const location = useLocation();

    const [orgList, setOrgList] = useState([]);
    const [openCreateOrgDialog, setOpenCreateOrgDialog] = useState(false)

    //stores
    const {  setUserDetail, userDetail, accessToken, setAccessToken  } = useAuthStore();
    const {orgData, setOrgData} = useAuthStore();


    const orgSchema = z.object({
        name: z.string().min(3, "Repository name is required"),
        email: z.string().email({message: "Invalid email address"}),
        contact: z
            .string()
            .length(10, {message: "Must be exactly 5 characters long"}),
        headCount: z.enum(["1-10", "11-50", "51-100", "101-500", "500+"]),
        domain: z.enum([
            "technology",
            "healthcare",
            "finance",
            "education",
            "retail",
        ]),
    });
    const form = useForm({
        resolver: zodResolver(orgSchema),
        defaultValues: {
            name: "",
            email: "",
            contact: "",
            headCount: "1-10",
            domain: "technology",
        },
    });



    useEffect(() => {

        if(userDetail){
            fetchOrg();
        }
      }, []);


    const fetchOrg = async ( ) => {
        try {
            const res = await axiosConn.post("http://localhost:3000/searchRecord", {
                limit: 20,
                offset: 0,
                getThisData: {
                    datasource: "Org",
                    order: [],
                    attributes: [],
                    where: {},
                    include: [
                        {
                            datasource: "User",
                            as: "users",
                            order: [],
                            attributes: [],
                            required: true,
                            where: { userId: userDetail?.userId }, // Pass userId directly
                        },
                    ],
                },
            });
            console.log(res.data);
            setOrgList(res.data?.data?.results);
            if(res.data?.data?.results && res.data?.data?.results?.length == 0){
                navigate(`/signin`)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadOrg = (a) => {
        console.log(accessToken)
        axiosConn.post("http://localhost:3000/switchOrg",{
            switchToOrgId : a?.orgId ,
        }).then(res => {
            setAccessToken(res?.data?.accessToken);
            localStorage.setItem("currentOrg", a?.orgId );
            setOrgData(res?.data?.data?.orgId);
            navigate("/workspace");
        }).catch(err => {
            console.log(err);
        })

    };

    return (
        <section className="  text-white min-h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div></div>
                <div className=" bg-white h-[calc(100svh-1em)] my-2 col-span-2 shadow-xl shadow-inner text-black p-6 md:px-10">
                    <h1 className="text-2xl font-semibold text-center">Linked Organization's</h1>
                    {/*<p className="    text-muted-foreground  text-center">Please Select an organization to proceed</p>*/}

                   <div className="px-5">
                       <Alert variant="accent"  className="text-muted-foreground text-center mt-3">
                           <AlertTitle>Please select an organization to proceed</AlertTitle>
                       </Alert>
                   </div>
                    <div
                        className={`  my-4 px-4 overflow-y-auto h-[calc(100svh-8em-10em)]`}>
                        {orgList?.map((a) => (
                            <>
                             <Card key={a.orgId} onClick={() => loadOrg(a)}
                                   className="border rounded-sm cursor-pointer transition-all hover:bg-accent h-fit mt-5 hover:shadow">
                                    <CardHeader>
                                        <div className="flex gap-2 items-center">
                                            <CardTitle className="text-base  flex flex-col gap-2 ">
                                                <h3 className=" font-semibold ">{a.orgName}</h3>

                                            </CardTitle>
                                            <div className="ml-auto">
                                                <p className="text-muted-foreground  ">
                                                    {
                                                        a?.users?.find(
                                                            (a) => a?.org_user?.userOrgRole == "OWNER"
                                                        )?.org_user?.userOrgRole
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                    </CardHeader>

                                </Card>

                            </>
                        ))}
                    </div>

                    <div className="">
                        <Separator className="my-2"/>
                        <Link to={`http://localhost:3000/auth/logout`}><Button className="text-center w-full mt-2">Sign Out</Button></Link>
                    </div>

                </div>
                <div></div>
            </div>
        </section>
    );
}

export default ManageOrg;
