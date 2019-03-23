const sidebarStudentItems = [
  {
    key: "article",
    title: "Article",
    permissions: [],
    icon: "file",
    isExpandable: false,
    path: "/student/view-article"
  }
];

const sidebarAdminItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    permissions: [],
    icon: "dashboard",
    path: "/admin/dashboard",
    isExpandable: false
  },
  {
    key: "user",
    title: "User",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/admin/view-user"
  },
  {
    key: "magazine",
    title: "Magazine",
    permissions: [],
    icon: "read",
    isExpandable: false,
    path: "/admin/view-event"
  },
  {
    key: "faculty",
    title: "Faculty",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/admin/view-faculty"
  },
  {
    key: "article",
    title: "Article",
    permissions: [],
    icon: "file",
    isExpandable: false,
    path: "/admin/view-article"
  }
];

const sidebarCoordItems = [
  {
    key: "student",
    title: "Student",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/coord/view-student"
  },
  {
    key: "article",
    title: "Uploaded Articles",
    permissions: [],
    icon: "file",
    path: "/coord/manage-uploaded-article",
    isExpandable: false
  }
];

const sidebarItems = {
  STUDENT: sidebarStudentItems,
  COORD: sidebarCoordItems,
  ADMIN: sidebarAdminItems
};

export default sidebarItems;
