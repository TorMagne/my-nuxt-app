<template>
  <!-- need to set password -->
  <section
    class="flex justify-center content-center items-center h-[calc(100vh-64px)]"
    v-if="needsPassword"
  >
    <form @submit.prevent="handleSetPassword">
      <p>need password</p>
      <div class="card bg-base-200 w-full md:w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          <!-- login number -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Login number</span>
            </div>
            <input
              v-model="loginNumber"
              type="text"
              placeholder="Login number"
              class="input input-bordered w-full max-w-xs"
            />
          </label>

          <!-- create password -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Create password</span>
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="Create password"
              class="input input-bordered w-full max-w-xs"
            />
          </label>

          <div class="card-actions justify-start mt-4">
            <button class="btn btn-secondary" type="submit" :disabled="!password">
              Create password and login
            </button>
          </div>
        </div>
      </div>
    </form>
  </section>

  <!-- need to login with password -->
  <section
    class="flex justify-center content-center items-center h-[calc(100vh-64px)]"
    v-if="needsLogin"
  >
    <form @submit.prevent="handleLoginWithPassword">
      <p>need to login with password</p>
      <div class="card bg-base-200 w-full md:w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          <!-- login number -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Login number</span>
            </div>
            <input
              v-model="loginNumber"
              type="text"
              placeholder="Login number"
              class="input input-bordered w-full max-w-xs"
            />
          </label>

          <!-- login with password -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Password</span>
            </div>
            <input
              v-model="loginPassword"
              type="password"
              placeholder="Password"
              class="input input-bordered w-full max-w-xs"
            />
          </label>

          <div class="card-actions justify-start mt-4">
            <button class="btn btn-secondary" type="submit">Login</button>
          </div>
        </div>
      </div>
    </form>
  </section>

  <section
    class="flex justify-center content-center items-center h-[calc(100vh-64px)]"
    v-if="!needsLogin && !needsPassword"
  >
    <form @submit.prevent="handleLogin">
      <div class="card bg-base-200 w-full md:w-96 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          <!-- login number -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Login number</span>
            </div>
            <input
              v-model="loginNumber"
              type="text"
              placeholder="Login number"
              class="input input-bordered w-full max-w-xs"
            />
            <span class="text-red-400 mt-2">{{ errorInfo }}</span>
          </label>

          <div class="card-actions justify-start mt-4">
            <button class="btn btn-secondary" type="submit">Login</button>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth/AuthStore';

const AuthStore = useAuthStore();

const loginNumber = ref('');
const password = ref('');
const loginPassword = ref('');
const needsPassword = ref(false);
const needsLogin = ref(false);
const errorInfo = ref('');

const handleLogin = async () => {
  try {
    const data = await $fetch('/api/users', {
      method: 'POST',
      body: { userNumber: loginNumber.value },
      throw: false, // Disable automatic error throwing
    });

    console.log('Response success => ', data);

    if (data.body && data.body.needsPassword) {
      needsPassword.value = data.body.needsPassword;
      needsLogin.value = data.body.needsLogin;
    } else if (data.body && data.body.needsLogin) {
      needsPassword.value = data.body.needsPassword;
      needsLogin.value = data.body.needsLogin;
    } else if (data.status === 404) {
      errorInfo.value = data.body.message;
    } else {
      // Successful login, redirect to dashboard
      await navigateTo('/games');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

const handleSetPassword = async () => {
  try {
    const data = await $fetch('/api/setPassword', {
      method: 'POST',
      body: {
        userNumber: loginNumber.value,
        password: password.value,
      },
    });

    console.log('Password set successfully:', data);
    await navigateTo('/games');
  } catch (error) {
    console.error('Error setting password:', error);
    errorInfo.value = error.message;
  }
};

const handleLoginWithPassword = async () => {
  try {
    const data = await $fetch('/api/loginUser', {
      method: 'POST',
      body: {
        userNumber: loginNumber.value,
        password: loginPassword.value,
      },
    });

    console.log('Logged in successfully:', data.body.user);
    AuthStore.setLoggedInUser(data.body.user);
    await navigateTo('/games');
  } catch (error) {
    console.error('Error logging in:', error);
    errorInfo.value = error.message;
  }
};
</script>
