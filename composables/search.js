export const useSearch = (payloads, searchInfo) => {
  const searchQuery = ref('');

  const filteredPayloads = computed(() => {
    if (!searchQuery.value) {
      return payloads.value;
    }
    if (searchInfo === 'users') {
      console.log('searching users', payloads);

      return payloads.value.filter(
        (payload) =>
          payload.userNumber?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.role?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.group?.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    // this one prob need to change later
    if (searchInfo === 'books' || searchInfo === 'taskTypes') {
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
    if (searchInfo === 'tasks') {
      return payloads.value.filter(
        (payload) =>
          payload.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.chapter.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.taskType.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    if (searchInfo === 'infopixels') {
      return payloads.value.filter(
        (payload) =>
          payload.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.medicalname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          payload.hint.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
  });

  return { searchQuery, filteredPayloads };
};
