<template>
  <div class="breadcrumbs text-sm mb-6">
    <ul>
      <li><Nuxt-link activeClass="active-extra-link " to="/tasks">Tasks</Nuxt-link></li>
      <li>
        <Nuxt-link activeClass="active-extra-link " to="/tasks/createTask">Create task</Nuxt-link>
      </li>
    </ul>
  </div>

  <h3 class="text-lg font-bold">Create a new task</h3>
  <form @submit.prevent="submitForm" enctype="multipart/form-data">
    <!-- name -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text after:content-['*'] after:ml-0.5 after:text-red-500"
          >Task Name</span
        >
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

    <!-- description -->
    <label class="form-control mb-4">
      <div class="label">
        <span class="label-text">Task Description</span>
      </div>
      <textarea
        class="textarea textarea-bordered h-24"
        placeholder="Task description"
        id="description"
        v-model="form.description"
      ></textarea>
    </label>

    <!-- level -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text after:content-['*'] after:ml-0.5 after:text-red-500">Level</span>
      </div>
      <input
        placeholder="Level"
        class="input input-bordered w-full max-w-xs"
        type="text"
        id="level"
        v-model="form.level"
        required
      />
    </label>

    <!-- chapter -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Select chapter</span>
      </div>
      <select class="select select-bordered" v-model="form.chapter">
        <option disabled value="">Select a chapter</option>
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
      <select class="select select-bordered" v-model="form.taskType">
        <option disabled value="">Select a task type</option>
        <option v-for="task in taskTypes" :key="task._id" :value="task._id">
          {{ task.name }}
        </option>
      </select>
    </label>

    <!-- task image -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Task Image</span>
      </div>
      <input
        type="file"
        id="image"
        name="image"
        @change="handleFileUpload"
        accept="image/*"
        class="file-input file-input-bordered w-full max-w-xs"
      />
    </label>

    <!-- infopixels -->
    <label class="form-control w-full max-w-xs mb-4">
      <div class="label">
        <span class="label-text">Select infopixel</span>
      </div>
      <select class="select select-bordered" v-model="selectedInfopixel">
        <option disabled value="">Select a infopixel</option>
        <option v-for="infopixel in infopixels" :key="infopixel._id" :value="infopixel">
          {{ infopixel.name }}
        </option>
      </select>
    </label>

    <button @click="addInfoPixel(selectedInfopixel)" class="btn btn-info" type="button">
      Add infopixel
    </button>

    <ul v-if="infopixelsToAdd.length > 0">
      <VueDraggableNext v-model="infopixelsToAdd" @end="onDragEnd">
        <li v-for="(pixel, index) in infopixelsToAdd" :key="pixel._id" class="mt-6">
          <div class="bg-base-200 p-4 rounded-md">
            <span class="card-title">Order: {{ index + 1 }}</span>
            <span class="card-title">Name: {{ pixel.name }}</span>
          </div>
        </li>
      </VueDraggableNext>
    </ul>

    <div class="flex justify-between mt-8">
      <button type="submit" class="btn btn-success">Save Task</button>
    </div>
  </form>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';
import { VueDraggableNext } from 'vue-draggable-next';

const AuthStore = useAuthStore();

const form = ref({
  name: '',
  description: '',
  level: '',
  chapter: '',
  taskType: '',
  infopixels: [],
});

const selectedFile = ref(null);
const tasks = ref([]);
const chapters = ref([]);
const taskTypes = ref([]);
const infopixelsToAdd = ref([]);
const infopixels = ref([]);
const selectedInfopixel = ref('');
const sortedInfoPixels = ref([]);

const { fetchData } = useFetchData();

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

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

const addInfoPixel = (infopixel) => {
  console.log('sssss', infopixel);

  if (!infopixelsToAdd.value.includes(infopixel)) {
    infopixelsToAdd.value.push(infopixel);
    useToastify('Added infopixel successfully', {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    console.log(infopixelsToAdd.value);
  } else {
    useToastify('Infopixel successfully', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
  }
};

const onDragEnd = () => {
  console.log('New order:', infopixelsToAdd.value);
  // Send the updated order to the backend
  // updateInfopixelsOrder(infopixelsToAdd.value);
};

const submitForm = async () => {
  if (!form.value.name || !form.value.level) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('description', form.value.description);
  formData.append('level', form.value.level);
  formData.append('chapter', form.value.chapter);
  formData.append('taskType', form.value.taskType);
  formData.append('image', selectedFile.value);

  infopixelsToAdd.value.forEach((infopixel) => {
    sortedInfoPixels.value.push(infopixel._id);
  });

  formData.append('infopixels', JSON.stringify(sortedInfoPixels.value));

  try {
    const result = await $fetch('/api/task/createTask', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    useToastify(result.message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    form.value.name = '';
    form.value.description = '';
    form.value.level = '';
    form.value.chapter = '';
    form.value.taskType = '';
    selectedFile.value = null;
    infopixelsToAdd.value = [];
    sortedInfoPixels.value = [];
    document.getElementById('image').value = '';

    fetchTasks();
  } catch (error) {
    useToastify('An error occurred', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

onMounted(() => {
  fetchTasks();
  fetchChapters();
  fetchTaskType();
  fetchInfoPixels();
});
</script>
