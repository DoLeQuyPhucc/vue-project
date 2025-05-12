import axiosInstance from './axiosInstance'

export interface CountryList {
  _id: string
  name: string
  slug: string
}

export interface CountryResponse {
  data: CountryList[]
}

export interface Movie {
  _id: string
  name: string
  slug: string
  origin_name: string
  poster_url: string
  thumb_url: string
  quality: string
  lang: string
  episode_current: string
  year: number
}

export interface MoviesByCountryResponse {
  status: string
  msg: string
  data: {
    items: Movie[]
    params: {
      pagination: {
        totalItems: number
        totalItemsPerPage: number
        currentPage: number
        totalPages: number
      }
    }
    APP_DOMAIN_CDN_IMAGE: string
  }
}

export const getCountryList = async (): Promise<CountryResponse> => {
  const response = await axiosInstance.get('/quoc-gia')
  return response.data
}

export const getMoviesByCountry = async (countrySlug: string, limit: number = 12): Promise<Movie[]> => {
  try {
    const response = await axiosInstance.get<MoviesByCountryResponse>(`/v1/api/quoc-gia/${countrySlug}?page=1`)
    
    if (response.data && response.data.data && response.data.data.items) {
      return response.data.data.items.slice(0, limit)
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error(`Error fetching movies for country ${countrySlug}:`, error)
    throw error
  }
}
