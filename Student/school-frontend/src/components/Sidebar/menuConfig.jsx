import React from "react";
import { Home, Book, Users, ClipboardList } from "lucide-react";

export const studentMenu = [
  {
    id: 1,
    label: "Dashboard",
    path: "/student-dashboard",
    icon: <Home size={18} />,
  },
  {
    id: 2,
    label: "Subjects",
    path: "/student-subjects",
    icon: <Book size={18} />,
  },
  {
    id: 3,
    label: "Assignments",
    path: "/student-assignments",
    icon: <ClipboardList size={18} />,
  },
];

export const teacherMenu = [
  {
    id: 1,
    label: "Dashboard",
    path: "/teacher-dashboard",
    icon: <Home size={18} />,
  },
  {
    id: 2,
    label: "Manage Students",
    path: "/teacher-students",
    icon: <Users size={18} />,
  },
  {
    id: 3,
    label: "Assignments",
    path: "/teacher-assignments",
    icon: <ClipboardList size={18} />,
  },
];

export const principalMenu = [
  {
    id: 1,
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: <Home size={18} />,
  },
  {
    id: 2,
    label: "Teachers",
    path: "/admin-teachers",
    icon: <Users size={18} />,
  },
  {
    id: 3,
    label: "Subjects",
    path: "/admin-subjects",
    icon: <Book size={18} />,
  },
];

const menuConfig = {
  student: studentMenu,
  teacher: teacherMenu,
  principal: principalMenu,
};

export default menuConfig;
