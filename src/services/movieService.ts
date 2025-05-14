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

export const getLatestMovies = async (page = 1): Promise<MovieResponse> => {
  const response = await axiosInstance.get(`/danh-sach/phim-moi-cap-nhat-v3?page=${page}`)
  return response.data
}

export const getMovieDetail = async (slug: string): Promise<MovieDetailResponse> => {
  const response = await axiosInstance.get(`/phim/${slug}`)
  return response.data
}

export const getFilmBo = async () => {
  const response = await axiosInstance.get('v1/api/danh-sach/phim-bo')
  return response.data
}

export const getFilmLe = async () => {
  const response = await axiosInstance.get('v1/api/danh-sach/phim-le')
  return response.data
}
