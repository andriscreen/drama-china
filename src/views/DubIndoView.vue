<template>
  <div class="dubindo-view bg-dracey-dark min-h-screen text-white pt-20 pb-20">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <span class="p-2 bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
             </svg>
          </span>
          Dub Indo
        </h1>

        <!-- Filter Tabs -->
        <div class="flex bg-white/10 rounded-full p-1 backdrop-blur-sm">
          <button 
            @click="activeTab = 'terbaru'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300"
            :class="activeTab === 'terbaru' ? 'bg-dracey-coral text-white shadow-lg' : 'text-dracey-peach hover:text-white'"
          >
            Terbaru
          </button>
          <button 
            @click="activeTab = 'terpopuler'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300"
            :class="activeTab === 'terpopuler' ? 'bg-dracey-rose text-white shadow-lg' : 'text-dracey-peach hover:text-white'"
          >
            Terpopuler
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        <DramaCard v-for="drama in list" :key="drama.bookId" :drama="drama" :loading="loading && page === 1" />
        <DramaCard v-if="loading" v-for="n in 10" :key="`skeleton-${n}`" :loading="true" />
      </div>
      
       <div v-if="!loading && list.length === 0" class="text-center py-20 text-white/50">
        No Dub Indo dramas found.
      </div>

      <div class="flex justify-center mt-12" v-if="list.length > 0">
           <button @click="loadMore" :disabled="loading" class="bg-dracey-card hover:bg-dracey-navy text-white font-medium py-3 px-8 rounded-full border border-white/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
             <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
             {{ loading ? 'Loading...' : 'Load More' }}
           </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import DramaCard from '../components/DramaCard.vue'

const list = ref([])
const loading = ref(false)
const activeTab = ref('terbaru')
const page = ref(1)
let isMounted = false

const fetchDubIndo = async (reset = false) => {
  if (loading.value) return
  
  if (reset) {
    page.value = 1
    list.value = []
  }

  try {
    loading.value = true
    // Logic for tab switch: 'terbaru' or 'terpopuler'
    // api.getDubIndo('terbaru', page)
    const response = await api.getDubIndo(activeTab.value === 'terbaru' ? 'terbaru' : 'terpopuler', page.value)
    
    if (isMounted && response && response.data) {
      const newDramas = response.data
      if (newDramas.length > 0) {
         // Filter duplicates
         const existingIds = new Set(list.value.map(d => d.bookId))
         const uniqueNewDramas = newDramas.filter(d => !existingIds.has(d.bookId))
         
         list.value = [...list.value, ...uniqueNewDramas]
         page.value++
      }
    }
  } catch (e) {
    console.error('Dub Indo fetch error', e)
  } finally {
    if (isMounted) loading.value = false
  }
}

const loadMore = () => {
  fetchDubIndo()
}

watch(activeTab, (newVal) => {
   // Reset when tab changes
   fetchDubIndo(true)
   window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  isMounted = true
  fetchDubIndo(true)
})

onUnmounted(() => {
  isMounted = false
})
</script>
