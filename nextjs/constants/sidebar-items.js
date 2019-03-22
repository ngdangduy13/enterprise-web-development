const sidebarStudentItems = [
  {
    key: "article",
    title: "Article",
    permissions: [],
    icon: "user",
    isExpandable: true,
    items: [
      {
        key: "/student/view-article",
        path: "/student/view-article",
        title: "View/Upload",
        permissions: []
      }
    ]
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
    isExpandable: true,
    items: [
      {
        key: "/admin/view-user",
        path: "/admin/view-user",
        title: "View/Insert",
        permissions: []
      }
    ]
  },
  {
    key: "faculty",
    title: "Faculty",
    permissions: [],
    icon: "user",
    isExpandable: true,
    items: [
      {
        key: "/admin/view-faculty",
        path: "/admin/view-faculty",
        title: "View/Insert",
        permissions: []
      }
    ]
  },
  {
    key: "article",
    title: "Article",
    permissions: [],
    icon: "file",
    isExpandable: true,
    items: [
      {
        key: "/admin/view-article",
        path: "/admin/view-article",
        title: "View/Insert",
        permissions: []
      }
    ]
  }
];

const sidebarCoordItems = [
  {
    key: "student",
    title: "Student",
    permissions: [],
    icon: "user",
    isExpandable: true,
    items: [
      {
        key: "/coord/view-student",
        path: "/coord/view-student",
        title: "View/Insert",
        permissions: []
      }
    ]
  },
  {
    key: "event",
    title: "Event",
    permissions: [],
    icon: "read",
    isExpandable: true,
    items: [
      {
        key: "/coord/view-event",
        path: "/coord/view-event",
        title: "View/Insert",
        permissions: []
      },
      {
        key: "/coord/manage-uploaded-article",
        path: "/coord/manage-uploaded-article",
        title: "Manage uploaded articles",
        permissions: []
      }
    ]
  }
];

const sidebarItems = {
  STUDENT: sidebarStudentItems,
  COORD: sidebarCoordItems,
  ADMIN: sidebarAdminItems
};

export default sidebarItems;
