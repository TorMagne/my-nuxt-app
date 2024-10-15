<template>
  <section class="book-create">
    <h1 class="font-bold my-4 text-2xl">Info pixels</h1>

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

    <button class="btn btn-success mb-4" @click="openModal">Create infopixel</button>
    <dialog id="my_modal_1" class="modal" ref="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create a New infopixel</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <!-- name -->
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text after:content-['*'] after:ml-0.5 after:text-red-500"
                >Infopixel Name</span
              >
            </div>
            <input
              placeholder="Infopixel name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="name"
              v-model="form.name"
              required
            />
          </label>

          <!-- medicalname -->
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Infopixel medicalname</span>
            </div>
            <input
              placeholder="Infopixel medicalname"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="name"
              v-model="form.medicalname"
            />
          </label>

          <!-- description -->
          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Infopixel Description</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Infopixel description"
              id="description"
              v-model="form.description"
            ></textarea>
          </label>

          <!-- hint -->
          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Infopixel hint</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Infopixel hint"
              id="description"
              v-model="form.hint"
            ></textarea>
          </label>

          <!-- level -->
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Infopixel Level</span>
            </div>
            <input
              placeholder="Level"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="level"
              v-model="form.level"
            />
          </label>

          <!-- image -->
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Infopixel Image</span>
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

          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Save Infopixel</button>
            <button type="button" class="btn btn-warning" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </dialog>

    <h2 class="font-bold my-4 text-2xl" v-if="infopixels.length === 0">
      No infopixels created yet
    </h2>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">Infopixel Name</th>
              <th class="text-black">Medicalname</th>
              <th class="text-black">Description</th>
              <th class="text-black">Hint</th>
              <th class="text-black">Image</th>
              <th class="text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="infopixel in paginatedInfopixel" :key="infopixel._id">
              <td class="text-black">{{ infopixel.name }}</td>
              <td class="text-black">{{ infopixel.medicalname }}</td>
              <td class="text-black">{{ infopixel.hint }}</td>
              <td class="text-black">{{ infopixel.description }}</td>
              <td>
                <img :src="`${infopixel.image}`" width="50" alt="Book cover" />
              </td>
              <td>
                <button class="btn btn-info btn-sm mr-2" @click="openEditModal(infopixel)">
                  Edit
                </button>
                <button class="btn btn-error btn-sm" @click="confirmDelete(infopixel)">
                  Delete
                </button>
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

    <!-- Edit Book Modal -->
    <dialog id="edit_modal" class="modal" ref="editModal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Edit Book</h3>
        <form @submit.prevent="updateInfoPixel" enctype="multipart/form-data">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Book Name</span>
            </div>
            <input
              placeholder="Book name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              v-model="editForm.name"
              required
            />
          </label>

          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Book Description</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Book description"
              v-model="editForm.description"
              required
            ></textarea>
          </label>

          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Book Image</span>
            </div>
            <input
              type="file"
              name="image"
              @change="handleEditFileUpload"
              accept="image/*"
              class="file-input file-input-bordered w-full max-w-xs"
            />
          </label>

          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Update Book</button>
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
        <p class="py-4">Are you sure you want to delete this infopixel?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteInfoPixel">Delete</button>
          <button class="btn" @click="closeDeleteConfirmModal">Cancel</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const form = ref({
  name: '',
  medicalname: '',
  description: '',
  hint: '',
  level: '',
});

const currentPage = ref(1);
const itemsPerPage = 10;

const selectedFile = ref(null);
const modal = ref(null);
const infopixels = ref([]);

const editForm = ref({
  _id: '',
  name: '',
  medicalname: '',
  description: '',
  hint: '',
  level: '',
});
const editModal = ref(null);
const editSelectedFile = ref(null);

const deleteConfirmModal = ref(null);
const infoPixelToDelete = ref(null);

//search composable
const { searchQuery, filteredPayloads } = useSearch(infopixels, 'infopixels');
const { fetchData } = useFetchData();

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
};

const fetchInfoPixels = async () => {
  fetchData('/api/infopixel/getInfoPixels', infopixels);
};

const submitForm = async () => {
  if (!form.value.name) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('medicalname', form.value.medicalname);
  formData.append('description', form.value.description);
  formData.append('hint', form.value.hint);
  formData.append('level', form.value.level);
  formData.append('image', selectedFile.value);

  try {
    const result = await $fetch('/api/infopixel/createInfoPixel', {
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
    form.value.medicalname = '';
    form.value.description = '';
    form.value.hint = '';
    form.value.level = '';
    selectedFile.value = null;
    document.getElementById('image').value = '';

    closeModal();
    fetchInfoPixels();
  } catch (error) {
    useToastify('An error occurred', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const paginatedInfopixel = computed(() => {
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

const openEditModal = (book) => {
  editForm.value = { ...book };
  editModal.value.showModal();
};

const closeEditModal = () => {
  editModal.value.close();
};

const handleEditFileUpload = (event) => {
  editSelectedFile.value = event.target.files[0];
};

const updateInfoPixel = async () => {
  if (!editForm.value.name) {
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
  if (editSelectedFile.value) {
    formData.append('image', editSelectedFile.value);
  }

  try {
    const { message } = await $fetch(`/api/book/${editForm.value._id}`, {
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

    fetchInfoPixels();

    closeEditModal();
  } catch (error) {
    useToastify('An error occurred while updating the book', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const confirmDelete = (infopixel) => {
  infoPixelToDelete.value = infopixel;
  deleteConfirmModal.value.showModal();
};

const closeDeleteConfirmModal = () => {
  deleteConfirmModal.value.close();
  infoPixelToDelete.value = null;
};

const deleteInfoPixel = async () => {
  if (!infoPixelToDelete.value) return;

  try {
    const { message } = await $fetch(`/api/infopixel/${infoPixelToDelete.value._id}`, {
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

    fetchInfoPixels();

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

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchInfoPixels();
});
</script>
