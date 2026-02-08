<template>
  <div class="player-view bg-black min-h-screen text-white flex flex-col md:flex-row relative overscroll-none">
    
    <!-- Video Section -->
    <div class="w-full md:flex-1 h-[40vh] md:h-screen relative bg-black flex flex-col justify-center">
        <!-- Back Button -->
        <router-link :to="`/detail/${bookId}`" class="absolute top-4 left-4 z-50 p-2 bg-black/50 hover:bg-dracey-coral rounded-full transition-colors backdrop-blur-md border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>

        <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-dracey-coral mb-4"></div>
            <p class="text-dracey-peach animate-pulse text-sm">Loading Stream...</p>
        </div>
        
        <div v-if="!loading && !currentEpisodeUrl" class="absolute inset-0 flex flex-col items-center justify-center z-0 text-white/50">
             <div class="text-6xl mb-4">🎬</div>
             <p>No video source available</p>
        </div>

        <video 
            v-if="currentEpisodeUrl"
            ref="videoPlayer"
            :src="currentEpisodeUrl" 
            controls 
            autoplay 
            playsinline
            class="w-full h-full object-contain"
            @ended="playNext"
            @waiting="buffering = true"
            @playing="buffering = false"
        ></video>
        
        <div v-if="buffering && !loading" class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
             <div class="animate-spin rounded-full h-12 w-12 border-4 border-dracey-coral border-t-transparent shadow-lg text-dracey-coral"></div>
        </div>
    </div>

    <!-- Playlist Section -->
    <div class="w-full md:w-80 lg:w-96 bg-dracey-dark border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-[60vh] md:h-screen">
        <div class="p-4 border-b border-white/10 flex justify-between items-center bg-dracey-card/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 class="font-bold text-lg text-white">Episodes</h2>
            <span class="text-xs text-dracey-peach bg-dracey-peach/10 px-2 py-1 rounded-full">{{ currentEpisodeIndex + 1 }} / {{ episodes.length }}</span>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <button 
                v-for="(ep, idx) in episodes" 
                :key="idx"
                @click="changeEpisode(idx)"
                class="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 group relative overflow-hidden"
                :class="currentEpisodeIndex === idx ? 'bg-dracey-coral text-white shadow-lg shadow-dracey-coral/20' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'"
            >
                <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold" 
                      :class="currentEpisodeIndex === idx ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white'">
                    {{ idx + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                    <p class="truncate font-medium text-sm">Episode {{ idx + 1 }}</p>
                </div>
                 <div v-if="currentEpisodeIndex === idx" class="absolute right-4 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                 </div>
            </button>
            <div v-if="loading" class="space-y-3">
               <div v-for="n in 5" :key="n" class="h-12 bg-white/5 rounded-xl animate-pulse"></div>
            </div>
             <div v-if="episodes.length === 0 && !loading" class="text-center text-white/30 py-10">
                No episodes available.
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const episodes = ref([])
const currentEpisodeIndex = ref(0)
const loading = ref(true)
const buffering = ref(false)
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
  // Auto scroll to top to ensure video is visible
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

// Correct scrolling when episode changes or list loads
watch([episodes, currentEpisodeIndex], async () => {
    await nextTick()
    const activeBtn = document.querySelector('.bg-dracey-coral') // The active button class
    if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
})

</script>

<style scoped>
/* Custom scrollbar for playlist */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>
