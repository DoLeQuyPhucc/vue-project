import axiosInstance from './axiosInstance'

export interface Movie {
  _id: string
  name: string
  origin_name: string
  slug: string
  type: string
  poster_url: string
  thumb_url: string
  episode_current: string
  quality: string
  lang: string
  year: number
  time: string
  category: Array<{ id: string; name: string; slug: string }>
  country: Array<{ id: string; name: string; slug: string }>
}

export interface PaginationData {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  totalPages: number
  updateToday: number
}

export interface MovieResponse {
  status: boolean
  items: Movie[]
  pagination: PaginationData
}

const movieService = {
  getLatestMovies: async (page: number = 1): Promise<MovieResponse> => {
    try {
      const response = await axiosInstance.get<MovieResponse>(
        `/danh-sach/phim-moi-cap-nhat-v3?page=${page}`,
      )
      return response.data
    } catch (error) {
      console.error('Error fetching latest movies:', error)
      throw error
    }
  },
}

export default movieService
