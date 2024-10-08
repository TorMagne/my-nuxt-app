export const useSearch = (payloads, searchInfo) => {
  const searchQuery = ref('');

  const filteredPayloads = computed(() => {
    if (!searchQuery.value) {
      return payloads.value;
    }
    if (searchInfo === 'users') {
      return payloads.value.filter(
        (payload) =>
          payload.userNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.role.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.group.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    if (searchInfo === 'books') {
      return payloads.value.filter(
        (payload) =>
          payload.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    if (searchInfo === 'chapters') {
      return payloads.value.filter(
        (payload) =>
          payload.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.book.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
  });

  return { searchQuery, filteredPayloads };
};
