const menus = [
  {
    id: 1,
    name: 'Home',
    links: '/',
  },
  {
    id: 2,
    name: 'MarketPlace',
    links: '/explore',
  },
  {
    id: 3,
    name: 'Sellers',
    links: '/activity',
  },
  {
    id: 4,
    name: 'Blog',
    links: '/blog',
  },
  {
    id: 5,
    name: 'Pages',
    links: '#',
    namesub: [
      {
        id: 2,
        sub: 'Create Item',
        links: '/create-item',
      },
      {
        id: 7,
        sub: 'FAQ',
        links: '/faq',
      },
    ],
  },
  {
    id: 7,
    name: 'Contact',
    links: '/contact',
  },
];

export default menus;
