<template>
  <section class="book-create">
    <h1>Create a New Book</h1>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div>
        <label for="name">Book Name:</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>

      <div>
        <label for="image">Book Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          @change="handleFileUpload"
          accept="image/*"
          required
        />
      </div>

      <button type="submit">Create Book</button>
    </form>

    <!-- Success and error messages -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
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
  successMessage.value = '';
  errorMessage.value = '';

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
    successMessage.value = result.message;
    // Optionally, redirect to another page or reset the form
    // router.push('/books'); // Redirect to books list
    form.value.name = '';
    form.value.description = '';
    selectedFile.value = null;
    // Reset the file input
    document.getElementById('image').value = '';
  } catch (error) {
    // Handle errors thrown by $fetch
    errorMessage.value = error?.data?.statusMessage || 'An error occurred.';
    console.error(error);
  }
};
</script>

<style scoped>
.book-create {
  max-width: 600px;
  margin: 0 auto;
}

.book-create form div {
  margin-bottom: 15px;
}

.book-create label {
  display: block;
  margin-bottom: 5px;
}

.book-create input[type='text'],
.book-create textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.success-message {
  color: green;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>
