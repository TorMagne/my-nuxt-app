import { useAuthStore } from '~/stores/auth/AuthStore';

export const useFetchData = () => {
  const AuthStore = useAuthStore();

  const fetchData = async (endpoint, targetRef) => {
    try {
      const result = await $fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${AuthStore.user.token}`,
        },
      });

      console.log('Data fetched:', result.body);

      targetRef.value = result.body;
    } catch (error) {
      console.error('Error fetching data:', error);
      useToastify(error.statusMessage, {
        type: 'error',
        autoClose: 3000,
        position: ToastifyOption.POSITION.TOP_RIGHT,
      });
    }
  };

  return {
    fetchData,
  };
};
