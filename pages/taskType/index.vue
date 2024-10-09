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
  </section>
</template>
<script setup>
const modal = ref(null);
const form = ref({
  name: '',
  description: '',
});

const openModal = () => {
  modal.value.showModal();
};
</script>
