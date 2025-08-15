import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function Billing() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If user visits /account-settings/billing, redirect to overview
        if (location.pathname === '/account-settings/billing') {
            navigate('/account-settings/billing/overview', { replace: true });
        }
    }, [location.pathname, navigate]);

    return <Outlet />;
}

export default Billing;
