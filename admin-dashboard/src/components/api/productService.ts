// src/components/api/productService.ts
import axios from 'axios';
import { Product, Brand, MilkType } from '../../types/Product';

const API_URL = 'https://localhost:7188/api';

const getAllProducts = async (page: number, pageSize: number): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/milks?pageIndex=${page}&pageSize=${pageSize}`);
  return response.data;
};
const getAllProductsWithouFilter = async () => {
  const response = await axios.get(`${API_URL}/milks`);
  return response.data;
}
const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get(`${API_URL}/milks/${id}`);
  return response.data;
};

const updateProduct = async (id: number, product: Product): Promise<void> => {
  await axios.put(`${API_URL}/milks/${id}`, product);
};

const getAllBrands = async (): Promise<Brand[]> => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

const getAllMilkTypes = async (): Promise<MilkType[]> => {
  const response = await axios.get(`${API_URL}/milk-types`);
  return response.data;
};

const updateProductImage = async (id: number, formData: FormData): Promise<void> => {
  await axios.put(`${API_URL}/milk-pictures/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
const uploadProductImage = async (milkId: number, formData: FormData): Promise<void> => {
  await axios.post(`${API_URL}/milk-pictures/${milkId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
const addProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axios.post(`${API_URL}/milks`, product);
  return response.data;
}

const productService =  {
  getAllProducts,
  getProductById,
  updateProduct,
  getAllBrands,
  getAllMilkTypes,
  updateProductImage,
  uploadProductImage,
  addProduct,
  getAllProductsWithouFilter
};
export default productService;