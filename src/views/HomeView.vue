<template>
  <div class="home-view bg-dracey-dark min-h-screen pb-20">
    <!-- Hero Removed as per request -->
    <div class="pt-24 pb-8 container mx-auto px-4 md:px-6">
       <h1 class="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-dracey-peach to-dracey-coral mb-2">
         Welcome to Dracey
       </h1>
       <p class="text-white/60 text-lg">Your premium destination for Asian dramas.</p>
    </div>

    <div class="container mx-auto px-4 z-30 space-y-16">
      
      <!-- For You Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
           <h2 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <span class="w-1 h-8 bg-dracey-coral rounded-full block"></span>
             For You
           </h2>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mb-8">
          <DramaCard v-for="(drama, index) in forYouList" :key="index" :drama="drama" />
          <DramaCard v-if="loadingForYou" v-for="n in 5" :key="`loading-${n}`" :loading="true" />
        </div>
        
        <div v-if="!loadingForYou && forYouList.length === 0" class="text-center py-10 text-white/50">
           No dramas found.
        </div>

        <div class="flex justify-center" v-if="forYouList.length > 0">
           <button @click="loadMoreForYou" :disabled="loadingForYou" class="bg-dracey-card hover:bg-dracey-navy text-white font-medium py-3 px-8 rounded-full border border-white/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
             <span v-if="loadingForYou" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
             {{ loadingForYou ? 'Loading...' : 'Load More' }}
           </button>
        </div>
      </section>

      <!-- Trending Section -->
      <section>
         <div class="flex items-center justify-between mb-6">
           <h2 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <span class="w-1 h-8 bg-dracey-rose rounded-full block"></span>
             Trending Drama
           </h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          <DramaCard v-for="(drama, index) in trendingList" :key="drama.bookId" :drama="drama" :index="index" :isTrending="true" />
           <DramaCard v-if="loadingTrending" v-for="n in 5" :key="n" :loading="true" />
        </div>
        <div v-if="!loadingTrending && trendingList.length === 0" class="text-center py-10 text-white/50">
           No trending dramas found.
        </div>
      </section>

      <!-- Latest Release -->
      <section>
         <div class="flex items-center justify-between mb-6">
           <h2 class="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
             <span class="w-1 h-8 bg-dracey-peach rounded-full block"></span>
             Latest Release
           </h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
           <DramaCard v-for="drama in latestList" :key="drama.bookId" :drama="drama" />
           <DramaCard v-if="loadingLatest" v-for="n in 5" :key="n" :loading="true" />
        </div>
        <div v-if="!loadingLatest && latestList.length === 0" class="text-center py-10 text-white/50">
           No new releases found.
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import DramaCard from '../components/DramaCard.vue'

const heroDrama = ref(null)
const forYouList = ref([])
const trendingList = ref([])
const latestList = ref([])

const loadingForYou = ref(false)
const pageForYou = ref(1)
const loadingTrending = ref(true)
const loadingLatest = ref(true)

let isMounted = false

const fetchHero = async () => {
  try {
    const response = await api.getHero()
    if (isMounted && response) {
      if (Array.isArray(response.data) && response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length)
        heroDrama.value = response.data[randomIndex]
      } else if (typeof response.data === 'object') {
        heroDrama.value = response.data || response
      }
    }
  } catch (e) {
    console.error('Hero fetch error', e)
  }
}

const fetchForYou = async (reset = false) => {
  if (loadingForYou.value) return
  if (reset) {
     pageForYou.value = 1
     forYouList.value = []
  }
  
  try {
    loadingForYou.value = true
    const response = await api.getForYou(pageForYou.value, 10)
    if (isMounted && response && response.data) {
      const newDramas = response.data
      if (newDramas.length > 0) {
         // Filter out duplicates based on bookId
         const existingIds = new Set(forYouList.value.map(d => d.bookId))
         const uniqueNewDramas = newDramas.filter(d => !existingIds.has(d.bookId))
         
         forYouList.value = [...forYouList.value, ...uniqueNewDramas]
         pageForYou.value++
      }
    }
  } catch (e) {
     console.error('For You fetch error', e)
  } finally {
    if (isMounted) loadingForYou.value = false
  }
}

const loadMoreForYou = () => {
    fetchForYou()
}

const fetchTrending = async () => {
    try {
    loadingTrending.value = true
    const response = await api.getTrending()
    if (isMounted && response) {
      trendingList.value = response.data || []
    }
  } catch (e) {
     console.error('Trending fetch error', e)
  } finally {
    if (isMounted) loadingTrending.value = false
  }
}

const fetchLatest = async () => {
    try {
    loadingLatest.value = true
    const response = await api.getLatest()
    if (isMounted && response) {
      latestList.value = response.data || []
    }
  } catch (e) {
     console.error('Latest fetch error', e)
  } finally {
    if (isMounted) loadingLatest.value = false
  }
}

onMounted(() => {
  isMounted = true
  fetchHero()
  fetchForYou(true)
  fetchTrending()
  fetchLatest()
})

onUnmounted(() => {
  isMounted = false
})
</script>

<style scoped>
.animate-kenburns {
  animation: kenburns 20s infinite alternate;
}
@keyframes kenburns {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
