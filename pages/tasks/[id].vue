<template>
  <div class="breadcrumbs text-sm mb-6">
    <ul>
      <li><Nuxt-link activeClass="active-extra-link " to="/tasks">Tasks</Nuxt-link></li>
      <li>
        <Nuxt-link activeClass="active-extra-link " :to="`/tasks/${route.params.id}`"
          >Create task</Nuxt-link
        >
      </li>
    </ul>
  </div>

  <!-- Edit Task -->
  <h1 class="text-lg font-bold">Edit Task</h1>

  <form @submit.prevent="updateTask" enctype="multipart/form-data">
    <!-- name -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Task Name</span>
      </div>
      <input
        placeholder="Task name"
        class="input input-bordered w-full max-w-xs"
        type="text"
        v-model="editForm.name"
        required
      />
    </label>

    <!-- description -->
    <label class="form-control mb-4">
      <div class="label">
        <span class="label-text">Task Description</span>
      </div>
      <textarea
        class="textarea textarea-bordered h-24"
        placeholder="Book description"
        v-model="editForm.description"
      ></textarea>
    </label>

    <!-- level -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Task Level</span>
      </div>
      <input
        placeholder="Book level"
        class="input input-bordered w-full max-w-xs"
        type="text"
        v-model="editForm.level"
        required
      />
    </label>

    <!-- chapter -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Select chapter</span>
      </div>
      <select class="select select-bordered" v-model="editForm.chapter">
        <option v-for="chapter in chapters" :key="chapter._id" :value="chapter._id">
          {{ chapter.name }}
        </option>
      </select>
    </label>

    <!-- task type -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Select task type</span>
      </div>
      <select class="select select-bordered" v-model="editForm.taskType">
        <option v-for="task in taskTypes" :key="task._id" :value="task._id">
          {{ task.name }}
        </option>
      </select>
    </label>

    <!-- image -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Task Image</span>
      </div>
      <input
        type="file"
        name="image"
        @change="handleEditFileUpload"
        accept="image/*"
        class="file-input file-input-bordered w-full max-w-xs"
      />
    </label>

    <ul v-if="infopixels.length > 0">
      <VueDraggableNext v-model="infopixels">
        <li v-for="(pixel, index) in infopixels" :key="pixel._id" class="mt-6">
          <div class="bg-base-200 p-4 rounded-md cursor-pointer">
            <span class="card-title">Order: {{ index + 1 }}</span>
            <span class="card-title">Name: {{ pixel.name }}</span>
            <button class="btn btn-sm mt-2 btn-error" @click="removeInfoPixel(pixel._id)">
              Remove
            </button>
          </div>
        </li>
      </VueDraggableNext>
    </ul>

    <div class="flex justify-between mt-8">
      <button type="submit" class="btn btn-success">Update Task</button>
    </div>
  </form>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';
import { VueDraggableNext } from 'vue-draggable-next';

const AuthStore = useAuthStore();

const route = useRoute();

const task = ref(null);
const chapters = ref([]);
const taskTypes = ref([]);
const infopixelsToAdd = ref([]);
const infopixels = ref([]);

const editForm = ref({
  _id: '',
  name: '',
  description: '',
  level: '',
  chapter: '',
  taskType: '',
});

const editSelectedFile = ref(null);

//search composable
const { fetchData } = useFetchData();

const fetchTask = async () => {
  await fetchData(`/api/task/${route.params.id}`, task);
  if (task.value) {
    editForm.value = {
      ...task.value,
    };
  }
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

const updateTask = async () => {
  if (!editForm.value.name || !editForm.value.level) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', editForm.value.name);
  formData.append('description', editForm.value.description);
  formData.append('level', editForm.value.level);
  formData.append('chapter', editForm.value.chapter);
  formData.append('taskType', editForm.value.taskType);

  formData.append('infopixels', JSON.stringify(infopixels.value));

  if (editSelectedFile.value) {
    formData.append('image', editSelectedFile.value);
  }

  try {
    const { message } = await $fetch(`/api/task/${editForm.value._id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    useToastify(message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  } catch (error) {
    useToastify('An error occurred while updating the book', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const handleEditFileUpload = (event) => {
  editSelectedFile.value = event.target.files[0];
};

onMounted(() => {
  fetchTask();
  fetchChapters();
  fetchTaskType();
  fetchInfoPixels();
});
</script>
