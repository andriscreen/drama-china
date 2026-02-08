<template>
  <div class="detail-view bg-dracey-dark min-h-screen text-white pb-20 pt-20">
    <div v-if="loading" class="flex items-center justify-center h-[50vh]">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-dracey-coral"></div>
    </div>

    <div v-else-if="drama" class="container mx-auto px-4 md:px-8">
      <!-- Top Section -->
      <div class="flex flex-col md:flex-row gap-8 md:gap-14 relative z-10">
        
        <!-- Background Blur -->
        <div class="absolute inset-0 -z-20 overflow-hidden rounded-3xl opacity-30">
             <img :src="drama.cover" class="w-full h-full object-cover blur-[80px] scale-125 saturate-200" />
        </div>
        <div class="absolute inset-0 -z-10 bg-dracey-dark/80 bg-opacity-90"></div>

        <!-- Poster -->
        <div class="w-64 mx-auto md:w-80 md:mx-0 lg:w-96 flex-shrink-0 animate-fade-in-left">
          <div class="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] group border border-white/10">
             <img :src="drama.cover" :alt="drama.title" class="w-full object-cover aspect-[2/3] transform group-hover:scale-105 transition-transform duration-700" />
             <div class="absolute inset-0 bg-gradient-to-t from-dracey-dark/90 via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 space-y-8 py-6 animate-fade-in-right flex flex-col justify-center">
          <div>
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-2 tracking-tight drop-shadow-lg">
              {{ drama.title }}
            </h1>
            <p class="text-dracey-coral font-medium text-lg italic tracking-wide">
               {{ drama.subtitle || 'Streaming Now' }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3 items-center text-sm font-medium text-white/90">
            <span class="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
               {{ drama.category || 'Drama' }}
            </span>
             <span class="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md" v-if="drama.totalEpisodes">
               {{ drama.totalEpisodes }} Episodes
            </span>
            <span class="flex items-center gap-1 px-4 py-1.5 bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-full" v-if="drama.rating">
               ★ {{ drama.rating }}
            </span>
             <span v-if="drama.isVip" class="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)] tracking-wide">
               VIP
            </span>
          </div>

          <p class="text-white/70 leading-relaxed text-lg max-w-4xl line-clamp-4 hover:line-clamp-none transition-all duration-300 bg-black/20 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
            {{ drama.intro || 'No synopsis available.' }}
          </p>
          
          <div class="flex items-center gap-5 pt-2">
            <router-link :to="`/player/${bookId}`" class="px-10 py-4 bg-dracey-coral hover:bg-dracey-coral/90 text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,107,107,0.4)] hover:shadow-[0_0_30px_rgba(255,107,107,0.6)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-3 text-lg">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current" viewBox="0 0 24 24">
                 <path d="M8 5v14l11-7z" />
               </svg>
               Watch Now
            </router-link>
            
            <button class="p-4 bg-white/5 rounded-full hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
               </svg>
            </button>
            <button class="p-4 bg-white/5 rounded-full hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
               </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Episodes Section -->
      <div class="mt-20">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
           <span class="w-1 h-8 bg-dracey-navy rounded-full block"></span>
           Episodes
        </h2>
        
        <div v-if="loadingEpisodes" class="ml-4 text-white/50 animate-pulse">Loading episodes...</div>
        
        <div v-else-if="episodes.length > 0" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
           <router-link 
              v-for="(ep, idx) in episodes" 
              :key="ep.id || idx"
              :to="`/player/${bookId}?ep=${idx}`"
              class="bg-white/5 hover:bg-dracey-coral/20 border border-white/10 hover:border-dracey-coral p-4 rounded-lg text-center transition-all group relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-dracey-coral/10 scale-0 group-hover:scale-100 transition-transform rounded-lg"></div>
              <span class="relative z-10 font-medium group-hover:text-dracey-peach">Ep {{ idx + 1 }}</span>
           </router-link>
        </div>
        
        <div v-else class="text-white/50 italic ml-4">No episodes found.</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const bookId = route.params.id

const drama = ref(null)
const episodes = ref([])
const loading = ref(true)
const loadingEpisodes = ref(true)

const fetchDetail = async () => {
   try {
     loading.value = true
     const response = await api.getDetail(bookId)
     if (response && response.data) {
       drama.value = response.data
     }
   } catch (e) {
     console.error('Fetch detail error', e)
   } finally {
     loading.value = false
   }
}

const fetchEpisodes = async () => {
   try {
     loadingEpisodes.value = true
     const response = await api.getEpisodes(bookId)
     if (response) {
       episodes.value = response.data || []
     }
   } catch (e) {
      console.error('Fetch episodes error', e)
   } finally {
      loadingEpisodes.value = false
   }
}

onMounted(() => {
  fetchDetail()
  fetchEpisodes()
})
</script>

<style scoped>
.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}
.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
  opacity: 0;
  transform: translateX(20px);
}
@keyframes fadeInLeft { to { opacity: 1; transform: translateX(0); } }
@keyframes fadeInRight { to { opacity: 1; transform: translateX(0); } }
</style>
