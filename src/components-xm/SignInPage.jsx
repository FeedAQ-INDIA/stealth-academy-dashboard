import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React, {useEffect} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
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
import "./SignInPage.css"
import {useAuthStore} from "@/zustland/store.js";

function SignInPage() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUri = searchParams.get("redirectUri") || null; // e.g., ?userId=123

    const {fetchUserDetail, loading: loadingStore, userDetail, fetchUserEnrolledCourseIdList} = useAuthStore();

    useEffect(()=>{
        console.log("userDetail :: ", userDetail)
        if(userDetail){
            if(redirectUri){
                // navigate(redirectUri);
                window.location.href = redirectUri;
            }else{
                // navigate('/dashboard');
                window.location.href = '/';
            }

        }
    }, [userDetail])
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4  bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 "
        >

            <div className="  w-full max-w-md sm:max-w-lg md:max-w-xl p-4">

                <Card className="w-full p-4 sm:p-8 rounded-md shadow-3xl  border-none md:border ">
                    <CardHeader>
                        <CardTitle className="mb-4 text-center">
                           <a
          className="text-2xl sm:text-3xl font-medium text-black"
          href="/"
          style={{ fontFamily: "Anta" }}
        >
          STEALTH
        </a>                     </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <h2 className="text-2xl sm:text-xl font-semibold text-center">Log in / Sign up</h2>
                        <CardDescription className="mt-4 text-center">
                            {/*<Alert variant="accent" className="rounded-md">*/}
                                <AlertTitle className="tracking-wide leading-snug	">Please Log in or Sign up to Access Your Account</AlertTitle>
                            {/*</Alert>*/}
                        </CardDescription>

                        <div className="mt-8 space-y-4  ">
                            {/* Google Login */}
                            <Link   to={`${import.meta.env.VITE_API_URL}/auth/google${redirectUri? '?redirectUri='+redirectUri : ''}`}>
                                <Button
                                    className="flex items-center w-full gap-3  my-2 "
                                    variant="outline"
                                    size="lg"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        height="20px"
                                        width="20px"
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                        />
                                    </svg>
                                    <span className="flex-1 text-center">Log in with Google</span>
                                </Button>
                            </Link>

                            {/* Microsoft Login */}
                            <Link   to={`${import.meta.env.VITE_API_URL}/auth/microsoft${redirectUri? '?redirectUri='+redirectUri : ''}`}>
                                <Button
                                    className="flex items-center w-full gap-3  my-2"
                                    variant="outline"
                                    size="lg"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 21 21"
                                        height="20px"
                                        width="20px"
                                    >
                                        <title>MS-SymbolLockup</title>
                                        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                                    </svg>
                                    <span className="flex-1 text-center">Log in with Microsoft</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

}

export default SignInPage;
