const sidebarStudentItems = [
  {
    key: "article",
    title: "Article",
    permissions: [],
    icon: "user",
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

const sidebarCoordItems = [
  {
    key: "student",
    title: "Student",
    permissions: [],
    icon: "user",
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
  COORD: sidebarCoordItems
};

export default sidebarItems;
