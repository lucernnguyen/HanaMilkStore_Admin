// src/components/api/productService.ts
import axios from 'axios';
import { Product, Brand, MilkType, MilkPicture } from '../../types/Product';

const API_URL = 'https://localhost:7188/api';

const getAllProducts = async (page: number, pageSize: number, milkTypeId: number): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/milks?pageIndex=${page}&pageSize=${pageSize}&milkType=${milkTypeId}`);
  return response.data;
};
const getAllProductsWithoutMilkType = async (page: number, pageSize: number): Promise<Product[]> => {
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

const updateProductImage = async (milkPictureId: number, newImageUrl: string): Promise<void> => {
  await axios.put(`${API_URL}/milk-pictures/${milkPictureId}`, { picture: newImageUrl });
};
const uploadProductImage = async (milkId: number, picture: string): Promise<void> => {
  try {
    const payload: MilkPicture = {
      milkPictureId: 0, // This would typically be set by the backend
      milkId,
      picture,
    };
    await axios.post(`${API_URL}/milk-pictures/${milkId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};
const addProduct = async (product: Partial<Product>): Promise<Product> => {
  const response = await axios.post(`${API_URL}/milks`, product);
  return response.data;
};
const   deleteProductImage = async (milkPictureId: number) => {
  await axios.delete(`${API_URL}/milk-pictures/${milkPictureId}`);
};

const deleteProduct = async (productId: number) => {
  await axios.delete(`${API_URL}/milks/${productId}`);
};

const productService =  {
  getAllProducts,
  getProductById,
  updateProduct,
  getAllBrands,
  getAllMilkTypes,
  updateProductImage,
  uploadProductImage,
  addProduct,
  getAllProductsWithouFilter,
  deleteProductImage,
  deleteProduct,
  getAllProductsWithoutMilkType
};
export default productService;