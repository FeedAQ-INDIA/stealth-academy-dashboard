import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React from "react";
import {Link} from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import { Terminal } from "lucide-react"
import backgroundImage from '../assets/LOGIN_BACKGROUND.jpg'
import logo from '../assets/logo.png'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
function SignInPage() {



    return (
        <div className="flex h-screen w-full items-center px-5   grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div  className={` hidden md:block h-screen lg:col-span-3 p-10 h-screen w-full`}
            >
             </div>
            <div className="lg:col-span-2 p-5">
                <Card className="w-full h-[calc(100svh-5em)] p-5 rounded-none drop-shadow-lg" >
                    <CardHeader>
                        <CardTitle className="text-normal mb-4">
                            <img src={ logo }  className="size-6 w-fit" alt="logo" />
                        </CardTitle>

                    </CardHeader>
                    <CardContent className=" mt-6">
                        <CardTitle className="text-3xl">Log in</CardTitle>
                        <CardDescription className=" mt-6">
                            <Alert variant="accent" >
                                <AlertTitle>Please Login to Access Your Account</AlertTitle>

                            </Alert>
                        </CardDescription>
                        <div className="grid gap-4 mt-10">


                            <Link to={"http://localhost:3000/auth/google"}>
                                <Button
                                    className="flex items-center justify-between w-full"
                                    variant="outline"
                                    size="lg"
                                >
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        height="20px"
                                        width="20px "
                                        style={{
                                            display: "block",
                                            marginRight: "8px",
                                            marginLeft: "0", // Added to left-align the SVG
                                        }}
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                        ></path>
                                        <path
                                            fill="#4285F4"
                                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                        ></path>
                                        <path
                                            fill="#FBBC05"
                                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                        ></path>
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                        ></path>
                                        <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                    <span className="mx-auto 	"> LOG IN WITH GOOGLE</span>
                                </Button>
                            </Link>


                            <Link to={"http://localhost:3000/auth/microsoft"}>
                                <Button
                                    className="flex items-center  w-full justify-between "
                                    variant="outline"
                                    size="lg"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 21 21"
                                        style={{
                                            display: "block",
                                            height: "20px",
                                            width: "20px",
                                            marginRight: "8px",
                                            marginLeft: "0",
                                        }}
                                    >
                                        <title>MS-SymbolLockup</title>
                                        <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                                        <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                                        <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                                    </svg>
                                    <span className="mx-auto">LOG IN WITH MICROSOFT</span>
                                </Button>
                            </Link>
                        </div>

                    </CardContent>
                </Card>
            </div>

        </div>
    )

}

export default SignInPage;
