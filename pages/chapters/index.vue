<template>
  <section class="chapter-create">
    <h1 class="font-bold my-4 text-2xl">Chapters</h1>

    <!-- Open the modal using Vue's @click directive -->
    <button class="btn btn-success mb-4" @click="openModal">Create Chapter</button>
    <dialog id="chapter_modal" class="modal" ref="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Create a New Chapter</h3>
        <form @submit.prevent="submitForm">
          <label class="form-control w-full max-w-xs mb-4">
            <div class="label">
              <span class="label-text">Select book</span>
            </div>
            <select class="select select-bordered" v-model="form.book" required>
              <option disabled selected value="">Select one</option>
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

          <button type="submit" class="btn btn-success">Save Chapter</button>
        </form>

        <div class="modal-action">
          <!-- Close the modal when clicking "Cancel" -->
          <button class="btn btn-warning" @click="closeModal">Cancel</button>
        </div>
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
              <th class="text-black">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="chapter in paginatedChapters" :key="chapter._id">
              <td class="text-black">{{ chapter.book.name }}</td>
              <td class="text-black">{{ chapter.name }}</td>
              <td class="text-black">{{ chapter.level }}</td>
              <td class="text-black">{{ chapter.description }}</td>
              <td>
                <button class="btn btn-success btn-sm">Edit Chapter</button>
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
import { ref, computed, watch, onMounted } from 'vue';

const form = ref({
  book: '',
  name: '',
  level: '',
  description: '',
});

const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref('');

const modal = ref(null); // Ref to the modal dialog

const chapters = ref([]);
const books = ref([]);

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
};

const fetchChapters = async () => {
  try {
    const result = await $fetch('/api/chapter/getChapters');
    chapters.value = result;
    console.log('Chapters:', result.body);
  } catch (error) {
    console.error('Error fetching chapters:', error);
  }
};

const fetchBooks = async () => {
  try {
    const result = await $fetch('/api/book/getBooks');
    books.value = result;
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const submitForm = async () => {
  // Validate form inputs
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
    });

    console.log('Chapter created successfully:', result);

    // Display success toast
    useToastify(result.statusMessage, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });

    // Reset the form
    form.value.book = '';
    form.value.name = '';
    form.value.level = '';
    form.value.description = '';

    // Close the modal
    closeModal();

    // Fetch chapters again
    fetchChapters();
  } catch (error) {
    // Handle errors
    useToastify('An error occurred', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error('Error creating chapter:', error); // Detailed error logging
  }
};

const filteredChapters = computed(() => {
  if (!searchQuery.value) {
    return chapters.value.body;
  }
  return chapters.value.bodyfilter(
    (chapter) =>
      chapter.book.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      chapter.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      chapter.level.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedChapters = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredChapters.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredChapters.value.length / itemsPerPage);
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

// Fetch books and chapters initially
onMounted(() => {
  fetchBooks();
  fetchChapters();
});
</script>
