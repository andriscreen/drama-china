import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.sansekai.my.id/api/dramabox',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout 
})

// Request interceptor to prevent caching
apiClient.interceptors.request.use((config) => {
  config.params = { ...config.params, _t: new Date().getTime() }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Helper to normalize API response fields to app standard
const normalizeDrama = (item) => {
  if (!item) return item

  // Extract video URL if available (for episodes)
  let videoUrl = item.videoUrl || ''
  if (!videoUrl && item.cdnList && item.cdnList.length > 0) {
    // Find default CDN or first one
    const defaultCdn = item.cdnList.find(cdn => cdn.isDefault === 1) || item.cdnList[0]
    if (defaultCdn && defaultCdn.videoPathList && defaultCdn.videoPathList.length > 0) {
      // Find best quality or default
      const bestQuality = defaultCdn.videoPathList.find(v => v.quality === 720) || 
                          defaultCdn.videoPathList.find(v => v.isDefault === 1) || 
                          defaultCdn.videoPathList[0]
      videoUrl = bestQuality.videoPath
    }
  }

  return {
    ...item,
    // Standard fields
    id: item.bookId || item.chapterId, // Use chapterId for episodes if bookId missing
    bookId: item.bookId,
    title: item.bookName || item.title || item.chapterName, // chapterName for episodes
    cover: item.coverWap || item.cover || item.chapterImg, // chapterImg for episodes
    intro: item.introduction || item.intro,
    totalEpisodes: item.chapterCount || item.totalEpisodes,
    category: Array.isArray(item.tags) ? item.tags[0] : (item.category || 'Drama'),
    isVip: item.isVip || item.isCharge === 1,
    isDubIndo: item.isDubIndo || (item.bookName && item.bookName.toLowerCase().includes('sulih suara')) || false,
    
    // Episode specific
    url: videoUrl,
    chapterIndex: item.chapterIndex,
    chapterName: item.chapterName
  }
}

// Add response interceptor to handle different response structures
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // Pattern 1: Direct Array (e.g., foryou, trending)
    if (Array.isArray(data)) {
      return { status: true, data: data.map(normalizeDrama) }
    }

    // Pattern 2: Wrapped in data property (e.g., maybe detail or others)
    if (data && data.data) {
      const content = data.data
      const normalized = Array.isArray(content) ? content.map(normalizeDrama) : normalizeDrama(content)
      return { status: true, data: normalized, message: data.message }
    }

    // Pattern 3: VIP Column List (flatten structure)
    if (data && data.columnVoList) {
      const allDramas = data.columnVoList.reduce((acc, column) => {
        return acc.concat(column.bookList || [])
      }, [])
      return { status: true, data: allDramas.map(normalizeDrama) }
    }

    // Pattern 4: Direct Object (e.g., detail might be just the object)
    if (data && typeof data === 'object') {
      return { status: true, data: normalizeDrama(data) }
    }

    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default {
  getHero: () => apiClient.get('/randomdrama'),
  getForYou: (page = 1) => apiClient.get(`/foryou?page=${page}`),
  getTrending: () => apiClient.get('/trending'),
  getLatest: () => apiClient.get('/latest'),
  getVIP: () => apiClient.get('/vip'),
  getDubIndo: (classify = 'terbaru', page = 1) => apiClient.get(`/dubindo?classify=${classify}&page=${page}`),
  getSearch: (query) => apiClient.get(`/search?query=${encodeURIComponent(query)}`),
  getPopularSearch: () => apiClient.get('/populersearch'),
  getDetail: (bookId) => apiClient.get(`/detail?bookId=${bookId}`),
  getEpisodes: (bookId) => apiClient.get(`/allepisode?bookId=${bookId}`),
}
