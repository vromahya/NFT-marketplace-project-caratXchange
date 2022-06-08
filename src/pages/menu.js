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
    name: 'Community',
    links: '#',
    namesub: [
      {
        id: 1,
        sub: 'Blog',
        links: '/blog',
      },
      {
        id: 2,
        sub: 'Blog Details',
        links: '/blog-details',
      },
      {
        id: 3,
        sub: 'Help Center',
        links: '/help-center',
      },
    ],
  },
  {
    id: 5,
    name: 'Pages',
    links: '#',
    namesub: [
      {
        id: 1,
        sub: 'Wallet Connect',
        links: '/wallet-connect',
      },
      {
        id: 2,
        sub: 'Create Item',
        links: '/create-item',
      },
      {
        id: 3,
        sub: 'Edit Profile',
        links: '/edit-profile',
      },
      {
        id: 4,
        sub: 'Ranking',
        links: '/ranking',
      },
      {
        id: 5,
        sub: 'Login',
        links: '/login',
      },
      {
        id: 6,
        sub: 'Sign Up',
        links: '/sign-up',
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
