<template>
  <section>
    <h1 class="font-bold my-4 text-2xl">Users</h1>

    <label class="input input-bordered flex items-center gap-2 my-8">
      <input v-model="searchQuery" type="text" class="grow" placeholder="Search" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
      >
        <path
          fill-rule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </label>

    <div v-if="errorInfo" class="text-red-500">
      {{ errorInfo }}
    </div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">User Number</th>
              <th class="text-black">Role</th>
              <th class="text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td class="text-black">{{ user.userNumber }}</td>
              <td class="text-black">{{ user.role }}</td>
              <td>
                <button class="btn btn-info btn-sm">Edit user</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center mt-4">
        <button class="btn btn-secondary mr-4" @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="btn btn-secondary ml-4"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const errorInfo = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref('');

const { data: users, error } = await useAsyncData('users', () =>
  $fetch('/api/users', {
    headers: {
      Authorization: `Bearer ${AuthStore.user.token}`,
    },
  })
);

if (error.value) {
  console.error('Error fetching users:', error.value);
  errorInfo.value = error.value.message || 'Error fetching users';
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value.body;
  }
  return users.value.body.filter(
    (user) =>
      user.userNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Watch the searchQuery and reset currentPage to 1 when it changes
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>
