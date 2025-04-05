import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RBACContext = createContext();

export const RBACProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await axios.get("/api/permissions"); // Fetch from backend
                setPermissions(res.data.Permissions.map((p) => p.name));
            } catch (error) {
                console.error("Failed to fetch permissions", error);
            }
        };
        fetchPermissions();
    }, []);

    const hasPermission = (perm) => permissions.includes(perm);

    return (
        <RBACContext.Provider value={{ hasPermission }}>
            {children}
        </RBACContext.Provider>
    );
};

export const useRBAC = () => useContext(RBACContext);
