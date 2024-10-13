<template>
  <section>
    <h1 class="font-bold my-4 text-2xl">Users</h1>

    <SearchBar :searchQuery="searchQuery" @update:searchQuery="searchQuery = $event" />

    <!-- <label class="input input-bordered flex items-center gap-2 my-8">
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
    </label> -->

    <div v-if="errorInfo" class="text-red-500">
      {{ errorInfo }}
    </div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">User Number</th>
              <th class="text-black">Group</th>
              <th class="text-black">Role</th>
              <th class="text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td class="text-black">{{ user.userNumber }}</td>
              <td class="text-black">{{ user.group }}</td>
              <td class="text-black">{{ user.role }}</td>
              <td>
                <button class="btn btn-info btn-sm" @click="openModal(user._id)">Edit user</button>
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

    <!-- Open the modal using ID.showModal() method -->
    <dialog
      v-for="user in paginatedUsers"
      :id="`my_modal_${user._id}`"
      :key="user._id"
      class="modal"
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">Edit User: {{ user.userNumber }}</h3>
        <form @submit.prevent="updateUser(user._id)">
          <div class="form-control">
            <label class="label">
              <span class="label-text">User Number</span>
            </label>
            <input
              v-model="editingUser.userNumber"
              type="text"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Role</span>
            </label>
            <input v-model="editingUser.role" type="text" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Group</span>
            </label>
            <select v-model="editingUser.group" class="select select-bordered" required>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Save Changes</button>
            <button type="button" class="btn btn-warning" @click="closeModal(user._id)">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const errorInfo = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const users = ref([]);
const editingUser = ref({
  userNumber: '',
  role: '',
  group: '',
});

//composables
const { searchQuery, filteredPayloads } = useSearch(users, 'users');
const { fetchData } = useFetchData();

const getAllUsers = async () => {
  fetchData('/api/user/users', users);
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPayloads.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPayloads.value.length / itemsPerPage);
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

const openModal = (id) => {
  const user = users.value.find((u) => u._id === id);
  if (user) {
    editingUser.value = { ...user };
  }
  document.getElementById(`my_modal_${id}`).showModal();
};

const closeModal = (id) => {
  document.getElementById(`my_modal_${id}`).close();
};

const updateUser = async (id) => {
  try {
    const response = await $fetch(`/api/user/${id}`, {
      method: 'PUT',
      body: editingUser.value,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    getAllUsers();

    closeModal(id);
    // Vis en suksessmelding her hvis ønskelig
    useToastify(response.statusMessage, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    useToastify('An error occurred while updating user', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  }
};

// Watch the searchQuery and reset currentPage to 1 when it changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  getAllUsers();
});
</script>
