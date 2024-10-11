<template>
  <section>
    <h1 class="font-bold my-4 text-2xl">Task types</h1>

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

    <!-- create -->
    <button class="btn btn-success mb-4" @click="openModal">Create Task type</button>
    <dialog id="my_modal_1" class="modal" ref="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create a Task type</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Task Name</span>
            </div>
            <input
              placeholder="Task name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="name"
              v-model="form.name"
              required
            />
          </label>

          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Task Description</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Task description"
              id="description"
              v-model="form.description"
              required
            ></textarea>
          </label>

          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Save Task type</button>
            <button type="button" class="btn btn-warning" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </dialog>

    <h2 class="font-bold my-4 text-2xl" v-if="taskTypes.length === 0">No task types created yet</h2>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">Book</th>
              <th class="text-black">Chapter Name</th>
              <th class="text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in paginatedChapters" :key="task._id">
              <td class="text-black">{{ task.name }}</td>
              <td class="text-black">{{ task.description }}</td>
              <td>
                <button class="btn btn-info btn-sm mr-2" @click="openEditModal(task)">Edit</button>
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

    <!-- Edit Task Type Modal -->
    <dialog id="edit_modal" class="modal" ref="editModal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Edit Chapter</h3>
        <form @submit.prevent="updateTaskType">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Chapter Name</span>
            </div>
            <input
              placeholder="Chapter name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              v-model="editForm.name"
              required
            />
          </label>

          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Description"
              v-model="editForm.description"
            ></textarea>
          </label>

          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Update Chapter</button>
            <button type="button" class="btn btn-warning ml-2" @click="closeEditModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_confirm_modal" class="modal" ref="deleteConfirmModal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm Deletion</h3>
        <p class="py-4">Are you sure you want to delete this task type?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteTaskType">Delete</button>
          <button class="btn" @click="closeDeleteConfirmModal">Cancel</button>
        </div>
      </div>
    </dialog>
  </section>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const modal = ref(null);
const editModal = ref(null);
const deleteConfirmModal = ref(null);
const taskTypes = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const taskTypeToDelete = ref(null);
const form = ref({
  name: '',
  description: '',
});

const editForm = ref({
  _id: '',
  name: '',
  description: '',
});

//composables
const { fetchData } = useFetchData();
const { searchQuery, filteredPayloads } = useSearch(taskTypes, 'taskTypes');

const fetchTaskType = async () => {
  fetchData('/api/taskType/getTaskType', taskTypes);
};

const updateTaskType = async () => {
  if (!editForm.value.description || !editForm.value.name) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  try {
    const { message } = await $fetch(`/api/taskType/${editForm.value._id}`, {
      method: 'PUT',
      body: editForm.value,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    useToastify(message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    fetchTaskType();

    closeEditModal();
  } catch (error) {
    useToastify('An error occurred while updating the chapter', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const deleteTaskType = async () => {
  if (!taskTypeToDelete.value) return;

  try {
    const { message } = await $fetch(`/api/taskType/${taskTypeToDelete.value._id}`, {
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

    fetchTaskType();

    closeDeleteConfirmModal();
  } catch (error) {
    useToastify('An error occurred while deleting the chapter', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
};

const openEditModal = (taskType) => {
  console.log('Editing chapter:', taskType);

  editForm.value = {
    ...taskType,
  };
  editModal.value.showModal();
};

const closeEditModal = () => {
  editModal.value.close();
};

const confirmDelete = (taskType) => {
  taskTypeToDelete.value = taskType;
  deleteConfirmModal.value.showModal();
};

const closeDeleteConfirmModal = () => {
  deleteConfirmModal.value.close();
  taskTypeToDelete.value = null;
};

const submitForm = async () => {
  if (!form.value.name) {
    useToastify('Please fill Task type name.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  const formData = {
    name: form.value.name,
    description: form.value.description,
  };

  try {
    const result = await $fetch('/api/taskType/createTaskType', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    useToastify(result.statusMessage, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    form.value.name = '';
    form.value.description = '';

    console.log('Task type created => ', result);

    fetchTaskType();

    closeModal();
  } catch (error) {
    useToastify(error.statusMessage, {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  }
};

const paginatedChapters = computed(() => {
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

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchTaskType();
});
</script>
