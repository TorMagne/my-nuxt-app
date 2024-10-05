<template>
  <section class="book-create">
    <h1 class="font-bold my-4 text-2xl">Books</h1>

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

    <!-- Open the modal using Vue's @click directive -->
    <button class="btn btn-success mb-4" @click="openModal">Create book</button>
    <dialog id="my_modal_1" class="modal" ref="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create a New Book</h3>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Book Name</span>
            </div>
            <input
              placeholder="Book name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="name"
              v-model="form.name"
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
              id="description"
              v-model="form.description"
              required
            ></textarea>
          </label>

          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Book Image</span>
            </div>
            <input
              type="file"
              id="image"
              name="image"
              @change="handleFileUpload"
              accept="image/*"
              required
              class="file-input file-input-bordered w-full max-w-xs"
            />
          </label>

          <button type="submit" class="btn btn-success">Save Book</button>
        </form>

        <div class="modal-action">
          <!-- Close the modal when clicking "Cancel" -->
          <button class="btn btn-warning" @click="closeModal">Cancel</button>
        </div>
      </div>
    </dialog>

    <h2 class="font-bold my-4 text-2xl" v-if="books.length === 0">No books created yet</h2>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">Book Name</th>
              <th class="text-black">Description</th>
              <th class="text-black">Image</th>
              <th class="text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in paginatedBooks" :key="book._id">
              <td class="text-black">{{ book.name }}</td>
              <td class="text-black">{{ book.description }}</td>
              <td>
                <img :src="`${book.image}`" width="50" />
              </td>
              <td>
                <button class="btn btn-info btn-sm">Edit book</button>
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

const form = ref({
  name: '',
  description: '',
});

const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref('');

const selectedFile = ref(null);
const modal = ref(null); // Ref to the modal dialog

const books = ref([]);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
};

const fetchBooks = async () => {
  try {
    const result = await $fetch('/api/book/getBooks', {
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    books.value = result;
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const submitForm = async () => {
  // Validate form inputs
  if (!form.value.name || !form.value.description || !selectedFile.value) {
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
  formData.append('image', selectedFile.value);

  try {
    const result = await $fetch('/api/book/createBook', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${AuthStore.user.token}`,
      },
    });

    // Display success toast
    useToastify(result.message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    // Reset the form
    form.value.name = '';
    form.value.description = '';
    selectedFile.value = null;
    document.getElementById('image').value = '';

    // Close the modal
    closeModal();

    // Fetch books again
    fetchBooks();
  } catch (error) {
    // Handle errors
    useToastify('An error occurred', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};

const filteredBooks = computed(() => {
  if (!searchQuery.value) {
    return books.value;
  }
  return books.value.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBooks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage);
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

// Fetch books initially
onMounted(() => {
  fetchBooks();
});
</script>
