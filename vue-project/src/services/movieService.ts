import axiosInstance from './axiosInstance'

export interface Movie {
  _id: string
  name: string
  origin_name: string
  slug: string
  type: string
  thumb_url: string
  poster_url: string
  time: string
  episode_current: string
  quality: string
  lang: string
  year: number
  category: { id: string; name: string; slug: string }[]
  country: { id: string; name: string; slug: string }[]
}

export interface MovieResponse {
  status: boolean
  items: Movie[]
  pagination: {
    totalItems: number
    totalItemsPerPage: number
    currentPage: number
    totalPages: number
    updateToday: number
  }
}

export const getLatestMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await axiosInstance.get(`/danh-sach/phim-moi-cap-nhat-v3?page=${page}`)
  return response.data
}
