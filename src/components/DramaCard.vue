<template>
  <div class="drama-card relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-dracey-coral/20 cursor-pointer w-full bg-dracey-card/80 backdrop-blur-sm border border-white/5"
       :class="{'animate-pulse bg-dracey-card/50 h-72': loading}">
    <router-link :to="`/detail/${drama?.bookId}`" class="block h-full relative" v-if="!loading">
      
      <!-- Poster -->
      <div class="h-64 sm:h-72 lg:h-80 w-full overflow-hidden relative">
        <img :src="drama.cover || '/placeholder.jpg'" 
             :alt="drama.title" 
             loading="lazy"
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             @error="$event.target.src='/placeholder.jpg'" />
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-dracey-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        <!-- Badges -->
        <div class="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span v-if="drama.isVip" class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">VIP</span>
          <span v-if="drama.isDubIndo" class="bg-gradient-to-r from-green-400 to-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">DUB INDO</span>
          <span v-if="index < 3 && isTrending" class="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">TRENDING #{{ index + 1 }}</span>
        </div>

        <!-- Play Icon on Hover -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div class="w-12 h-12 rounded-full bg-dracey-coral/90 blur-md absolute"></div>
          <svg class="w-10 h-10 text-white relative z-10 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.35-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dracey-dark to-transparent">
        <h3 class="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-dracey-peach transition-colors">
          {{ drama.title }}
        </h3>
        <p class="text-dracey-peach/70 text-xs mt-1 line-clamp-1 group-hover:text-white/90 transition-colors">
          {{ drama.category || 'Drama' }} • {{ drama.totalEpisodes ? drama.totalEpisodes + ' Eps' : 'Ongoing' }}
        </p>
      </div>

    </router-link>
  </div>
</template>

<script setup>
defineProps({
  drama: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.drama-card:hover {
  transform: translateY(-5px);
}
</style>
