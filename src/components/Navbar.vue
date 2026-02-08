<template>
  <nav class="sticky top-0 z-[100] w-full bg-dracey-dark/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300 shadow-md">
    <div class="px-6 py-4 flex items-center justify-between container mx-auto">
      <div class="flex items-center gap-4">
        <router-link to="/" class="group flex items-center gap-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-dracey-peach to-dracey-coral text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(246,114,128,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(246,114,128,0.8)] transition-all">
            DRACEY
          </span>
        </router-link>
      </div>

      <div class="hidden md:flex items-center gap-8">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/vip" class="nav-link">VIP</router-link>
        <router-link to="/dub-indo" class="nav-link">Dub Indo</router-link>
      </div>

      <div class="flex items-center gap-4">
        <router-link to="/search" class="text-dracey-peach hover:text-dracey-coral p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </router-link>
        
        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-dracey-peach hover:text-dracey-coral p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" class="md:hidden bg-dracey-card/95 backdrop-blur-xl border-t border-white/5 absolute w-full left-0 top-full shadow-2xl transition-all">
       <div class="flex flex-col p-4 space-y-2">
         <router-link to="/" class="mobile-nav-link" @click="isMenuOpen = false">Home</router-link>
         <router-link to="/vip" class="mobile-nav-link" @click="isMenuOpen = false">VIP Collection</router-link>
         <router-link to="/dub-indo" class="mobile-nav-link" @click="isMenuOpen = false">Dub Indo</router-link>
       </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<style scoped>
.nav-link {
  @apply text-dracey-peach/80 font-medium hover:text-dracey-coral transition-colors relative;
}
.nav-link.router-link-active {
  @apply text-dracey-coral;
}
.nav-link.router-link-active::after {
  content: '';
  @apply absolute -bottom-1 left-0 w-full h-[2px] bg-dracey-coral rounded-full shadow-[0_0_8px_rgba(246,114,128,0.6)];
}

.mobile-nav-link {
  @apply block px-4 py-3 rounded-lg text-dracey-peach/80 font-medium hover:bg-white/5 hover:text-dracey-coral transition-colors;
}
.mobile-nav-link.router-link-active {
  @apply bg-dracey-coral/10 text-dracey-coral font-bold;
}
</style>
