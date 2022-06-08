const widgetSidebarData = [
  {
    id: 1,
    title: 'Status',
    content: [
      {
        field: 'All',
        checked: 'checked',
      },
      {
        field: 'On Auctions',
      },
      {
        field: 'On Direct Sale',
      },
    ],
    selected: null,
  },
  {
    id: 2,
    title: 'OrderBy',
    content: [
      {
        field: 'tokenID',
      },
      {
        field: 'Time created',
      },
      {
        field: 'Price',
      },
    ],
    selected: null,
  },
  {
    id: 3,
    title: 'Sort direction',
    content: [
      {
        field: 'Ascending',
      },
      {
        field: 'Descending',
      },
    ],
    selected: null,
  },
];

export default widgetSidebarData;
