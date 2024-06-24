import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { Brand, MilkType } from '../../types/Product';
import './AddProduct.css';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [milkName, setMilkName] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [capacity, setCapacity] = useState('');
  const [milkTypeId, setMilkTypeId] = useState<number | null>(null);
  const [appropriateAge, setAppropriateAge] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [milkTypes, setMilkTypes] = useState<MilkType[]>([]);

  useEffect(() => {
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

    fetchBrands();
    fetchMilkTypes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (brandId && milkTypeId && selectedFile) {
      try {
        const newProduct = {
          milkName,
          brandId,
          capacity,
          milkTypeId,
          appropriateAge,
          storageInstructions,
          price,
          discount,
        };

        // Add the new product and get its ID
        const addedProduct = await productService.addProduct(newProduct);
        // Upload the image for the added product
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        await productService.uploadProductImage(addedProduct.milkId, formData);

        navigate('/products');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      console.log('Please fill out all required fields and select an image.');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label>
              Milk Name:
              <input
                type="text"
                value={milkName}
                onChange={(e) => setMilkName(e.target.value)}
                required
              />
            </label>
            <label>
              Brand:
              <select
                value={brandId ?? ''}
                onChange={(e) => setBrandId(Number(e.target.value))}
                required
              >
                <option value="" disabled>Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Capacity:
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </label>
            <label>
              Milk Type:
              <select
                value={milkTypeId ?? ''}
                onChange={(e) => setMilkTypeId(Number(e.target.value))}
                required
              >
                <option value="" disabled>Select Milk Type</option>
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
              <input
                type="text"
                value={appropriateAge}
                onChange={(e) => setAppropriateAge(e.target.value)}
                required
              />
            </label>
            <label>
              Storage Instructions:
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                required
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </label>
            <label>
              Discount:
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </label>
            <label>
              Image:
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
