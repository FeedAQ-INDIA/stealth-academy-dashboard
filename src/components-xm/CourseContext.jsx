// src/contexts/CourseContext.jsx
import { createContext, useContext } from "react";

export const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);
