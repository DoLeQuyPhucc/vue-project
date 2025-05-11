import axiosInstance from './axiosInstance'

export interface CountryList {
  _id: string
  name: string
  slug: string
}

export interface CountryResponse {
  data: CountryList[]
}

export const getCountryList = async (): Promise<CountryResponse> => {
  const response = await axiosInstance.get('/quoc-gia')
  return response.data
}
