<template>
  <section class="book-create">
    <h1 class="font-bold my-4 text-2xl">Books</h1>

    <!-- Open the modal using ID.showModal() method -->
    <button class="btn btn-success" onclick="my_modal_1.showModal()">Create book</button>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Hello!</h3>
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
              <span class="label-text">Book description</span>
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
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup>
const form = ref({
  name: '',
  description: '',
});

const selectedFile = ref(null);
const successMessage = ref('');
const errorMessage = ref('');

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const submitForm = async () => {
  // Reset messages
  // successMessage.value = '';
  // errorMessage.value = '';

  // Validate form inputs
  if (!form.value.name || !form.value.description || !selectedFile.value) {
    errorMessage.value = 'Please fill in all required fields.';
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

    // Since $fetch does not throw an error, the request was successful
    // successMessage.value = result.message;

    useToastify(result.message, {
      type: 'success',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    // Optionally, redirect to another page or reset the form
    // router.push('/books'); // Redirect to books list
    form.value.name = '';
    form.value.description = '';
    selectedFile.value = null;
    // Reset the file input
    document.getElementById('image').value = '';
  } catch (error) {
    // Handle errors thrown by $fetch
    useToastify('An error occurred', {
      type: 'error',
      autoClose: 3000,
      position: ToastifyOption.POSITION.TOP_RIGHT,
    });
    console.error(error);
  }
};
</script>
