const widgetSidebarData = [
  {
    id: 0,
    title: 'Status',
    content: [
      {
        index: 0,
        field: 'All',
        value: 'all',
      },
      {
        index: 1,
        field: 'On Auctions',
        value: 'onAuction',
      },
      {
        index: 2,
        field: 'On Direct Sale',
        value: 'onDirectSale',
      },
    ],
    selected: null,
  },
  {
    id: 1,
    title: 'OrderBy',
    content: [
      {
        index: 0,
        field: 'Name',
        value: 'name',
      },
      {
        index: 1,
        field: 'Time created',
        value: 'createdAtTimestamp',
      },
      {
        index: 2,
        field: 'Price/MinimumBid',
        value: 'reservedPrice',
      },
    ],
    selected: null,
  },
  {
    id: 2,
    title: 'Sort direction',
    content: [
      {
        index: 0,
        field: 'Ascending',
        value: 'asc',
      },
      {
        index: 1,
        field: 'Descending',
        value: 'desc',
      },
    ],
    selected: null,
  },
];

export default widgetSidebarData;
