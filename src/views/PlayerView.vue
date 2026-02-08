<template>
  <div class="player-view bg-black min-h-screen text-white flex flex-col items-center justify-center relative overscroll-none">
    
    <!-- Back Button -->
    <router-link :to="`/detail/${bookId}`" class="absolute top-4 left-4 z-50 p-2 bg-black/50 hover:bg-dracey-coral rounded-full transition-colors backdrop-blur-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </router-link>

    <!-- Video Player Container -->
    <div class="w-full h-screen relative flex items-center justify-center bg-black">
      <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-dracey-coral mb-4"></div>
        <p class="text-dracey-peach animate-pulse">Loading Stream...</p>
      </div>

      <video 
        v-if="currentEpisodeUrl"
        ref="videoPlayer"
        :src="currentEpisodeUrl" 
        controls 
        autoplay 
        class="w-full h-full object-contain"
        @ended="playNext"
        @waiting="buffering = true"
        @playing="buffering = false"
      ></video>
      
      <!-- Buffering Indicator -->
      <div v-if="buffering && !loading" class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
         <div class="animate-spin rounded-full h-12 w-12 border-4 border-dracey-coral border-t-transparent"></div>
      </div>

       <!-- Controls Overlay (Optional custom controls can be added here) -->
    </div>

    <!-- Playlist Sidebar / Overlay (Toggleable) -->
    <div class="absolute bottom-10 right-10 z-50">
       <div class="bg-dracey-dark/90 backdrop-blur-md p-4 rounded-xl border border-white/10 max-h-96 overflow-y-auto w-64 shadow-2xl transition-all" :class="{'translate-y-full opacity-0 pointer-events-none': !showPlaylist}">
          <h3 class="font-bold text-dracey-peach mb-4 flex justify-between items-center">
             Episodes
             <button @click="showPlaylist = false" class="text-white hover:text-dracey-coral">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </h3>
          <ul class="space-y-2">
            <li v-for="(ep, idx) in episodes" :key="idx">
               <button 
                  @click="changeEpisode(idx)"
                  class="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                  :class="{'text-dracey-coral bg-white/5': currentEpisodeIndex === idx}"
               >
                 <span class="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 text-xs">{{ idx + 1 }}</span>
                 <span class="truncate">Episode {{ idx + 1 }}</span>
               </button>
            </li>
          </ul>
       </div>
       <button @click="showPlaylist = !showPlaylist" class="bg-dracey-coral hover:bg-dracey-rose text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
       </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const episodes = ref([])
const currentEpisodeIndex = ref(0)
const loading = ref(true)
const buffering = ref(false)
const showPlaylist = ref(false)
const videoPlayer = ref(null)

const currentEpisodeUrl = computed(() => {
  return episodes.value[currentEpisodeIndex.value]?.url || ''
})

const fetchEpisodes = async () => {
  try {
    loading.value = true
    const response = await api.getEpisodes(bookId)
    if (response) {
      episodes.value = response.data || []
      // Check query param for episode index
      const queryEp = parseInt(route.query.ep)
      if (!isNaN(queryEp) && queryEp >= 0 && queryEp < episodes.value.length) {
        currentEpisodeIndex.value = queryEp
      }
    }
  } catch (e) {
    console.error('Fetch episodes error', e)
  } finally {
    loading.value = false
  }
}

const changeEpisode = (index) => {
  currentEpisodeIndex.value = index
  router.replace({ query: { ...route.query, ep: index } })
}

const playNext = () => {
  if (currentEpisodeIndex.value < episodes.value.length - 1) {
    changeEpisode(currentEpisodeIndex.value + 1)
  }
}

onMounted(() => {
  fetchEpisodes()
})

watch(currentEpisodeUrl, () => {
   // Reset buffering state on change
   buffering.value = false
})
</script>

<style scoped>
/* Hide scrollbar for playlist */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
