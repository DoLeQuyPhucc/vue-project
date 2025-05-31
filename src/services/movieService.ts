import axiosInstance from './axiosInstance'
import { createCachedApiCall } from '../utils/apiUtils'

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

export interface TmdbInfo {
  type: string
  id: string
  season?: number
  vote_average: number
  vote_count: number
}

export interface ImdbInfo {
  id: string | null
}

export interface TimeInfo {
  time: string
}

export interface MovieEpisode {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface ServerData {
  server_name: string
  server_data: MovieEpisode[]
}

export interface MovieDetail {
  tmdb: TmdbInfo
  imdb: ImdbInfo
  created: TimeInfo
  modified: TimeInfo
  _id: string
  name: string
  slug: string
  origin_name: string
  content: string
  type: string
  status: string
  poster_url: string
  thumb_url: string
  is_copyright: boolean
  sub_docquyen: boolean
  chieurap: boolean
  trailer_url: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  notify: string
  showtimes: string
  year: number
  view: number
  actor: string[]
  director: string[]
  category: { id: string; name: string; slug: string }[]
  country: { id: string; name: string; slug: string }[]
}

export interface MovieDetailResponse {
  status: boolean
  msg: string
  movie: MovieDetail
  episodes: ServerData[]
}

export interface PaginatedMovieResponse {
  status: string
  msg: string
  data: {
    seoOnPage: {
      og_type: string
      titleHead: string
      descriptionHead: string
      og_image: string[]
      og_url: string
    }
    breadCrumb: Array<{
      name: string
      slug?: string
      isCurrent: boolean
      position: number
    }>
    titlePage: string
    items: Movie[]
    params: {
      type_slug: string
      filterCategory: string[]
      filterCountry: string[]
      filterYear: string[]
      filterType: string[]
      sortField: string
      sortType: string
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
    type_list: string
    APP_DOMAIN_FRONTEND: string
    APP_DOMAIN_CDN_IMAGE: string
  }
}

// Base API functions (without caching)
const fetchLatestMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await axiosInstance.get(`/danh-sach/phim-moi-cap-nhat-v3?page=${page}`)
  return response.data
}

const fetchMovieDetail = async (slug: string): Promise<MovieDetailResponse> => {
  const response = await axiosInstance.get(`/phim/${slug}`)
  return response.data
}

const fetchFilmBo = async () => {
  const response = await axiosInstance.get('v1/api/danh-sach/phim-bo')
  return response.data
}

const fetchFilmLe = async () => {
  const response = await axiosInstance.get('v1/api/danh-sach/phim-le')
  return response.data
}

// Base API functions for paginated lists
const fetchFilmBoList = async (page = 1): Promise<PaginatedMovieResponse> => {
  console.log('fetchFilmBoList API call with page:', page) // Debug log
  const response = await axiosInstance.get(`/v1/api/danh-sach/phim-bo?page=${page}`)
  console.log('fetchFilmBoList API response:', response.data) // Debug log
  return response.data
}

const fetchFilmLeList = async (page = 1): Promise<PaginatedMovieResponse> => {
  console.log('fetchFilmLeList API call with page:', page) // Debug log
  const response = await axiosInstance.get(`/v1/api/danh-sach/phim-le?page=${page}`)
  console.log('fetchFilmLeList API response:', response.data) // Debug log
  return response.data
}

// Cached API functions
export const getLatestMovies = createCachedApiCall(fetchLatestMovies, {
  key: 'latest_movies',
  expiry: 5 * 60 * 1000, // 5 minutes cache
})

// For movie detail, we need dynamic key based on the movie slug
export const getMovieDetail = (slug: string) => {
  return createCachedApiCall(() => fetchMovieDetail(slug), {
    key: `movie_detail_${slug}`,
    expiry: 30 * 60 * 1000, // 30 minutes cache for movie details
  })()
}

export const getFilmBo = createCachedApiCall(fetchFilmBo, {
  key: 'film_bo',
  expiry: 15 * 60 * 1000, // 15 minutes cache
})

export const getFilmLe = createCachedApiCall(fetchFilmLe, {
  key: 'film_le',
  expiry: 15 * 60 * 1000, // 15 minutes cache
})

// Cached API functions for paginated lists
export const getFilmBoList = createCachedApiCall(
  (page: number = 1) => {
    console.log('getFilmBoList called with page:', page) // Debug log
    return fetchFilmBoList(page)
  },
  { key: 'filmBoList', expiry: 10 * 60 * 1000 },
)

export const getFilmLeList = createCachedApiCall(
  (page: number = 1) => {
    console.log('getFilmLeList called with page:', page) // Debug log
    return fetchFilmLeList(page)
  },
  { key: 'filmLeList', expiry: 10 * 60 * 1000 },
)
