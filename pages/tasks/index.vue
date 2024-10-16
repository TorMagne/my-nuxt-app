<template>
  <section class="book-create">
    <h1 class="font-bold my-4 text-2xl">Tasks</h1>

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

    <!-- create task -->
    <Nuxt-link to="/tasks/createTask" class="btn btn-success mb-4">Create task</Nuxt-link>

    <h2 class="font-bold my-4 text-2xl" v-if="tasks.length === 0">No tasks created yet</h2>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">Task Name</th>
              <th class="text-black">Description</th>
              <th class="text-black">level</th>
              <th class="text-black">Chapter</th>
              <th class="text-black">Task type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in paginatedTaskTypes" :key="task._id">
              <td class="text-black">{{ task.name }}</td>
              <td class="text-black">{{ task.description }}</td>
              <td class="text-black">{{ task.level }}</td>
              <td class="text-black">{{ task.chapter.name }}</td>
              <td class="text-black">{{ task.taskType.name }}</td>
              <td>
                <img :src="`${task.image}`" width="50" alt="Book cover" />
              </td>
              <td>
                <!-- openEditModal(task) -->
                <Nuxt-link class="btn btn-info btn-sm mr-2 mb-4 md:mb-0" :to="`/tasks/${task._id}`"
                  >Edit</Nuxt-link
                >
                <button class="btn btn-error btn-sm" @click="confirmDelete(task)">Delete</button>
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

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_confirm_modal" class="modal" ref="deleteConfirmModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Deletion</h3>
        <p class="py-4">Are you sure you want to delete this task?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteTask">Delete</button>
          <button class="btn" @click="closeDeleteConfirmModal">Cancel</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import DOMPurify from 'dompurify';
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const currentPage = ref(1);
const itemsPerPage = 10;

const tasks = ref([]);
const chapters = ref([]);
const taskTypes = ref([]);
const infopixels = ref([]);

const deleteConfirmModal = ref(null);
const taskToDelete = ref(null);

//search composable
const { searchQuery, filteredPayloads } = useSearch(tasks, 'tasks');
const { fetchData } = useFetchData();

const fetchTasks = async () => {
  fetchData('/api/task/getTasks', tasks);
};

const fetchChapters = async () => {
  fetchData('/api/chapter/getChapters', chapters);
};

const fetchTaskType = async () => {
  fetchData('/api/taskType/getTaskType', taskTypes);
};

const fetchInfoPixels = async () => {
  fetchData('/api/infopixel/getInfoPixels', infopixels);
};

const paginatedTaskTypes = computed(() => {
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

const confirmDelete = (task) => {
  taskToDelete.value = task;
  deleteConfirmModal.value.showModal();
};

const closeDeleteConfirmModal = () => {
  deleteConfirmModal.value.close();
  taskToDelete.value = null;
};

const deleteTask = async () => {
  if (!taskToDelete.value) return;

  try {
    const { message } = await $fetch(`/api/task/${taskToDelete.value._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    useToastify(message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    tasks.value = tasks.value.filter((b) => b._id !== taskToDelete.value._id);

    closeDeleteConfirmModal();
  } catch (error) {
    useToastify('An error occurred while deleting the book', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

watch(searchQuery, (newValue) => {
  // Sanitize the search query
  searchQuery.value = DOMPurify.sanitize(newValue);
  // Reset the current page to 1
  currentPage.value = 1;
});

onMounted(() => {
  fetchTasks();
  fetchChapters();
  fetchTaskType();
  fetchInfoPixels();
});
</script>
