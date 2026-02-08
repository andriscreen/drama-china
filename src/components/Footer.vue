<template>
  <footer class="bg-dracey-dark/95 text-white w-full py-10 mt-auto border-t border-white/5 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-t from-dracey-dark to-transparent opacity-80 pointer-events-none"></div>
    <div class="container mx-auto px-6 text-center relative z-10">
      <div class="mb-6 flex flex-col items-center gap-4">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-dracey-peach to-dracey-coral text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(246,114,128,0.5)]">
          DRACEY
        </h2>
        <p class="text-dracey-peach/60 italic text-sm md:text-base">
          “Your Daily Dose of C-Drama” | “Stream Chinese Drama with Style”
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-6 mb-8 text-dracey-peach/70">
        <router-link to="/" class="hover:text-dracey-coral transition-colors">Home</router-link>
        <router-link to="/vip" class="hover:text-dracey-coral transition-colors">VIP</router-link>
        <router-link to="/dub-indo" class="hover:text-dracey-coral transition-colors">Dub Indo</router-link>
      </div>

      <div class="text-dracey-peach/40 text-xs mt-8 pb-4 flex flex-col items-center gap-2">
        <span>&copy; 2026 DRACEY. All rights reserved.</span>
        <a href="https://andriirawan.web.id" target="_blank" class="hover:text-dracey-coral transition-colors">
          Powered by Andri Digital
        </a>
      </div>
    </div>
  </footer>
</template>
