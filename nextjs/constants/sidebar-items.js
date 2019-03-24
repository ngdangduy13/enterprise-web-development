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
    key: "student-coord",
    title: "Student",
    permissions: [],
    icon: "user",
    isExpandable: false,
    path: "/coordinator/view-student"
  },
  {
    key: "article-coord",
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
