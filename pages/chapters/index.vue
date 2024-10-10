<template>
  <section>
    <h1 class="font-bold my-4 text-2xl">Chapters</h1>

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

    <button class="btn btn-success mb-4" @click="openModal">Create Chapter</button>
    <dialog id="my_modal_1" class="modal" ref="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create a New Chapter</h3>
        <form @submit.prevent="submitForm">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Select book</span>
            </div>
            <select class="select select-bordered" v-model="form.book" required>
              <option disabled value="">Select a book</option>
              <option v-for="book in books" :key="book._id" :value="book._id">
                {{ book.name }}
              </option>
            </select>
          </label>

          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Chapter Name</span>
            </div>
            <input
              placeholder="Chapter name"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="name"
              v-model="form.name"
              required
            />
          </label>

          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Level</span>
            </div>
            <input
              placeholder="Level"
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="level"
              v-model="form.level"
            />
          </label>

          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Description</span>
            </div>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Description"
              id="description"
              v-model="form.description"
            ></textarea>
          </label>

          <div class="flex justify-between mt-8">
            <button type="submit" class="btn btn-success">Save Chapter</button>
            <button type="button" class="btn btn-warning" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </dialog>

    <h2 class="font-bold my-4 text-2xl" v-if="chapters.length === 0">No chapters created yet</h2>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th class="text-black">Book</th>
              <th class="text-black">Chapter Name</th>
              <th class="text-black">Level</th>
              <th class="text-black">Description</th>
              <th class="text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="chapter in paginatedChapters" :key="chapter._id">
              <td class="text-black">{{ getBookName(chapter.book) }}</td>
              <!-- <pre>{{ chapter.book }}</pre> -->
              <td class="text-black">{{ chapter.name }}</td>
              <td class="text-black">{{ chapter.level }}</td>
              <td class="text-black">{{ chapter.description }}</td>
              <td>
                <button class="btn btn-info btn-sm mr-2" @click="openEditModal(chapter)">
                  Edit
                </button>
                <button class="btn btn-error btn-sm" @click="confirmDelete(chapter)">Delete</button>
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

    <!-- Edit Chapter Modal -->
    <dialog id="edit_modal" class="modal" ref="editModal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Edit Chapter</h3>
        <form @submit.prevent="updateChapter">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Select book</span>
            </div>
            <select class="select select-bordered" v-model="editForm.book" required>
              <option disabled value="">Select a book</option>
              <option v-for="book in books" :key="book._id" :value="book._id">
                {{ book.name }}
              </option>
            </select>
          </label>

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

          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Level</span>
            </div>
            <input
              placeholder="Level"
              class="input input-bordered w-full max-w-xs"
              type="text"
              v-model="editForm.level"
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
        <p class="py-4">Are you sure you want to delete this chapter?</p>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteChapter">Delete</button>
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
  book: '',
  name: '',
  level: '',
  description: '',
});

const currentPage = ref(1);
const itemsPerPage = 10;

const modal = ref(null);
const editModal = ref(null);
const deleteConfirmModal = ref(null);

const chapters = ref([]);
const books = ref([]);

const editForm = ref({
  _id: '',
  book: '',
  name: '',
  level: '',
  description: '',
});

const chapterToDelete = ref(null);

//composables
const { fetchData } = useFetchData();

//search composable
const { searchQuery, filteredPayloads } = useSearch(chapters, 'chapters');

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
};

const fetchChapters = async () => {
  fetchData('/api/chapter/getChapters', chapters);
};

const fetchBooks = async () => {
  fetchData('/api/book/getBooks', books);
};

const submitForm = async () => {
  console.log('Form:', form.value);

  if (!form.value.book || !form.value.name) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  const formData = {
    book: form.value.book,
    name: form.value.name,
    level: form.value.level,
    description: form.value.description,
  };

  try {
    const result = await $fetch('/api/chapter/createChapter', {
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

    form.value = { book: '', name: '', level: '', description: '' };
    closeModal();
    fetchChapters();
  } catch (error) {
    useToastify('An error occurred while creating the chapter', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
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

const getBookName = (book) => {
  if (!book) return 'Unknown Book';
  if (typeof book === 'string') {
    // If book is just an ID
    const foundBook = books.value.find((b) => b._id === book._id);
    return foundBook ? foundBook.name : 'Unknown Book';
  }
  // If book is an object
  return book.name || 'Unknown Book';
};

const openEditModal = (chapter) => {
  console.log('Editing chapter:', chapter);

  editForm.value = {
    ...chapter,
    book: chapter.book._id, // Set the book ID instead of the whole book object
  };
  editModal.value.showModal();
};

const closeEditModal = () => {
  editModal.value.close();
};

const updateChapter = async () => {
  if (!editForm.value.book || !editForm.value.name) {
    useToastify('Please fill in all required fields.', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    return;
  }

  try {
    const { message } = await $fetch(`/api/chapter/${editForm.value._id}`, {
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

    fetchChapters();

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

const confirmDelete = (chapter) => {
  chapterToDelete.value = chapter;
  deleteConfirmModal.value.showModal();
};

const closeDeleteConfirmModal = () => {
  deleteConfirmModal.value.close();
  chapterToDelete.value = null;
};

const deleteChapter = async () => {
  if (!chapterToDelete.value) return;

  try {
    const { message } = await $fetch(`/api/chapter/${chapterToDelete.value._id}`, {
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

    chapters.value = chapters.value.filter((c) => c._id !== chapterToDelete.value._id);

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

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchChapters();
  fetchBooks();
});
</script>
