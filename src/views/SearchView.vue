<template>
  <div class="search-view bg-dracey-dark min-h-screen text-white pt-20 pb-20">
    <div class="container mx-auto px-4">
      
      <!-- Search Input -->
      <div class="max-w-3xl mx-auto mb-12">
        <h1 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-dracey-peach to-dracey-coral text-transparent bg-clip-text">Search Drama</h1>
        <div class="relative group">
           <input 
             v-model="searchQuery"
             @input="handleSearch"
             type="text" 
             placeholder="Search for drama titles, actors..." 
             class="w-full bg-white/5 border border-white/20 rounded-full py-4 pl-14 pr-6 text-white text-lg focus:outline-none focus:border-dracey-coral focus:ring-2 focus:ring-dracey-coral/50 transition-all placeholder:text-white/30 backdrop-blur-sm"
           />
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-dracey-coral transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           
           <div v-if="loading" class="absolute right-5 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin h-5 w-5 border-2 border-dracey-coral border-t-transparent rounded-full"></div>
           </div>
        </div>
      </div>

       <!-- Popular Search -->
       <div v-if="!searchQuery && !results.length" class="max-w-4xl mx-auto">
         <h2 class="text-xl font-bold mb-4 text-dracey-peach flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
           </svg>
           Popular Searches
         </h2>
         <div class="flex flex-wrap gap-3">
           <button 
             v-for="(term, idx) in popularSearches" 
             :key="idx"
             @click="searchQuery = term.title; performSearch(term.title)"
             class="bg-white/5 hover:bg-dracey-coral/20 border border-white/10 hover:border-dracey-coral px-4 py-2 rounded-full text-sm text-white/80 transition-all hover:scale-105"
           >
             {{ term.title }}
           </button>
           <div v-if="popularSearches.length === 0 && !loadingPopular" class="text-white/30 italic">No popular searches available.</div>
         </div>
       </div>

       <!-- Results -->
       <div v-if="searchQuery || results.length > 0">
          <h2 class="text-xl font-bold mb-6 text-dracey-peach pl-2 border-l-4 border-dracey-coral" v-if="searchQuery">
             Results for "{{ searchQuery }}"
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            <DramaCard v-for="drama in results" :key="drama.bookId" :drama="drama" :loading="loading" />
            <DramaCard v-if="loading && results.length === 0" v-for="n in 5" :key="n" :loading="true" />
          </div>
          
          <div v-if="!loading && results.length === 0 && searchQuery" class="text-center py-20">
             <div class="text-6xl mb-4">🔍</div>
             <p class="text-white/50 text-xl">No dramas found for "{{ searchQuery }}"</p>
          </div>
       </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import DramaCard from '../components/DramaCard.vue'

const searchQuery = ref('')
const results = ref([])
const popularSearches = ref([])
const loading = ref(false)
const loadingPopular = ref(false)
let debounceTimeout = null

const fetchPopularSearches = async () => {
   try {
     loadingPopular.value = true
     const response = await api.getPopularSearch()
     if (response) {
       // Assuming it returns array of strings or objects
       popularSearches.value = response.data || []
     }
   } catch (e) {
     console.error('Popular search fetch error', e)
   } finally {
     loadingPopular.value = false
   }
}

const performSearch = async (query) => {
   if (!query) {
     results.value = []
     return
   }
   
   try {
     loading.value = true
     const response = await api.getSearch(query)
     if (response) {
       results.value = response.data || []
     }
   } catch (e) {
      console.error('Search error', e)
      results.value = []
   } finally {
      loading.value = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
   }
}

const handleSearch = () => {
   if (debounceTimeout) clearTimeout(debounceTimeout)
   loading.value = true // Immediate feedback
   debounceTimeout = setTimeout(() => {
      performSearch(searchQuery.value)
   }, 500)
}

onMounted(() => {
  fetchPopularSearches()
})
</script>
