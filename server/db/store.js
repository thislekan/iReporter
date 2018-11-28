const store = {
  users: [],
  records: {
    redFlags: [],
    interventions: [],
  },
};

const populateStoreWithDummyData = () => {
  const dummyUsers = [
    {
      firstname: 'mikail',
      lastname: 'igzkov',
      id: 56789,
      reports: {
        redFlags: [
          {
            type: 'red-flag',
            status: 'draft',
            createdBy: 56789,
            id: 91020,
            location: '11.5 22.4',
            comment: 'Nigerian police shot a kid',
          },
        ],
      },
    },
    { firstname: 'anon', lastname: 'mazkovv' },
  ];
  const dummyRedFlags = [
    {
      type: 'red-flag',
      status: 'rejected',
      id: 9999,
      createdBy: 9999,
    },
    {
      type: 'red-flag',
      status: 'draft',
      createdBy: 56789,
      id: 91020,
      location: '11.5 22.4',
      comment: 'Nigerian police shot a kid',
    },
  ];
  store.users = [...dummyUsers];
  store.records.redFlags = [...dummyRedFlags];
};
populateStoreWithDummyData();

export default store;
