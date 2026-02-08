<template>
  <div class="vip-view bg-dracey-dark min-h-screen text-white pt-20 pb-20">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8 flex items-center gap-3">
        <span class="p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
        </span>
        VIP Collection
      </h1>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <DramaCard v-for="drama in list" :key="drama.bookId" :drama="drama" :loading="loading" />
        <DramaCard v-if="loading" v-for="n in 10" :key="`skeleton-${n}`" :loading="true" />
      </div>
      
      <div v-if="!loading && list.length === 0" class="text-center py-20 text-white/50">
        No VIP dramas found at the moment.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import DramaCard from '../components/DramaCard.vue'

const list = ref([])
const loading = ref(true)

const fetchVIP = async () => {
  try {
    loading.value = true
    const response = await api.getVIP()
    if (response) {
      list.value = response.data || []
    }
  } catch (e) {
    console.error('VIP fetch error', e)
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVIP()
})
</script>
