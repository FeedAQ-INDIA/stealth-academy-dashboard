// src/contexts/CourseContext.jsx
import { createContext, useContext } from "react";

export const WebinarContext = createContext();

export const useWebinar = () => useContext(WebinarContext);
