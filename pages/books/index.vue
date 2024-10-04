<template>
  <section class="book-create">
    <h1 class="font-bold my-4 text-2xl">Books</h1>

    <!-- Open the modal using Vue's @click directive -->
    <button class="btn btn-success" @click="openModal">Create book</button>
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
          <button class="btn" @click="closeModal">Cancel</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  description: '',
});

const selectedFile = ref(null);
const modal = ref(null); // Ref to the modal dialog

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const openModal = () => {
  modal.value.showModal();
};

const closeModal = () => {
  modal.value.close();
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
</script>
