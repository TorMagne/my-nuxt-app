<template>
  <nav>
    <div class="navbar bg-base-300">
      <div class="container mx-auto">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div class="flex-none">
          <!-- <button class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button> -->
          <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            <NuxtLink to="/games" class="btn btn-ghost">Games</NuxtLink>
            <NuxtLink to="/dashboard" class="btn btn-ghost">Dashboard</NuxtLink>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <main class="container mx-auto px-4 h-[calc(100vh-64px)]">
    <slot />
  </main>
</template>
