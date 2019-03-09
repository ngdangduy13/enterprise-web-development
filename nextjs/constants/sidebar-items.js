const sidebarItems = [
  {
    key: 'authentication',
    title: 'Authentication',
    permissions: [],
    icon: 'user',
    items: [
      {
        key: '/admin/users',
        path: '/admin/users',
        title: 'Users',
        permissions: [],
      },
      {
        key: '/admin/roles',
        path: '/admin/roles',
        title: 'Roles',
        permissions: [],
      },
    ],
  },
  {
    key: 'article',
    title: 'Article',
    permissions: [],
    icon: 'user',
    items: [
      {
        key: '/admin/view-article',
        path: '/admin/view-article',
        title: 'View/Upload',
        permissions: [],
      },
    ],
  },
];

export default sidebarItems;