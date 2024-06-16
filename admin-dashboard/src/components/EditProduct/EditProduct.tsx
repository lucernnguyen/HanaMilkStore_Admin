import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { Product, Brand, MilkType } from '../../types/Product';
import './EditProduct.css';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [milkTypes, setMilkTypes] = useState<MilkType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const data = await productService.getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchMilkTypes = async () => {
      try {
        const data = await productService.getAllMilkTypes();
        setMilkTypes(data);
      } catch (error) {
        console.error('Error fetching milk types:', error);
      }
    };

    fetchProduct();
    fetchBrands();
    fetchMilkTypes();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prevProduct => prevProduct ? { ...prevProduct, [name]: value } : null);
  };

  const handleSave = async () => {
    try {
      if (product) {
        await productService.updateProduct(product.milkId, product);
        navigate('/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile && product) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await productService.uploadProductImage(product.milkId, formData);
        // Refresh the product data to show the new image
        const updatedProduct = await productService.getProductById(Number(id));
        setProduct(updatedProduct);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form>
        <div className="form-row">
          <div className="form-column">
            <label>
              Milk Name:
              <input type="text" name="milkName" value={product.milkName} onChange={handleChange} />
            </label>
            <label>
              Brand:
              <select name="brandId" value={product.brandId} onChange={handleChange}>
                {brands.map(brand => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Capacity:
              <input type="number" name="capacity" value={product.capacity} onChange={handleChange} />
            </label>
            <label>
              Milk Type:
              <select name="milkTypeId" value={product.milkTypeId} onChange={handleChange}>
                {milkTypes.map(type => (
                  <option key={type.milkTypeId} value={type.milkTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-column">
            <label>
              Appropriate Age:
              <input type="text" name="appropriateAge" value={product.appropriateAge} onChange={handleChange} />
            </label>
            <label>
              Storage Instructions:
              <input type="text" name="storageInstructions" value={product.storageInstructions} onChange={handleChange} />
            </label>
            <label>
              Price:
              <input type="number" name="price" value={product.price} onChange={handleChange} />
            </label>
            <label>
              Discount:
              <input type="number" name="discount" value={product.discount} onChange={handleChange} />
            </label>
          </div>
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>

      <div className="image-upload-section">
        <h3>Upload Image</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload} disabled={!selectedFile}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
