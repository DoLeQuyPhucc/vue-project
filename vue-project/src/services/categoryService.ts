import axiosInstance from './axiosInstance'

export interface Category {
  _id: string
  name: string
  slug: string
}

export interface CategoryResponse {
  data: Category[]
}

export const getCategoryList = async (): Promise<CategoryResponse> => {
  const response = await axiosInstance.get('/the-loai')
  return response.data
}
