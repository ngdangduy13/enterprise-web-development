const sidebarStudentItems = [
  {
    key: "/student/view-article",
    title: "Article",
    permissions: [],
    icon: "file",
    isExpandable: false,
    path: "/student/view-article"
  }
];

const sidebarAdminItems = [
  {
    key: "/admin/dashboard",
    title: "Dashboard",
    permissions: [],
    icon: "dashboard",
    path: "/admin/dashboard",
    isExpandable: false
  },
  {
    key: "/admin/view-user",
    title: "User",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/admin/view-user"
  },
  {
    key: "/admin/view-event",
    title: "Magazine",
    permissions: [],
    icon: "read",
    isExpandable: false,
    path: "/admin/view-event"
  },
  {
    key: "/admin/view-faculty",
    title: "Faculty",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/admin/view-faculty"
  },
  {
    key: "/admin/view-article",
    title: "Article",
    permissions: [],
    icon: "file",
    isExpandable: false,
    path: "/admin/view-article"
  }
];

const sidebarCoordItems = [
  {
    key: "/coordinator/view-student",
    title: "Student",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/coordinator/view-student"
  },
  {
    key: "/coordinator/manage-uploaded-article",
    title: "Uploaded Articles",
    permissions: [],
    icon: "file",
    path: "/coordinator/manage-uploaded-article",
    isExpandable: false
  }
];

const sidebarItems = {
  STUDENT: sidebarStudentItems,
  COORD: sidebarCoordItems,
  ADMIN: sidebarAdminItems
};

export default sidebarItems;
