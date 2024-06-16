export interface Product {
    milkId: number;
    milkName: string;
    brandId: number;
    capacity: number;
    milkTypeId: number;
    appropriateAge: string;
    storageInstructions: string;
    price: number;
    discount: number;
    pictures: string[];
    typeName: string;
  }
  
  export interface Brand {
    brandId: number;
    brandName: string;
  }
  
  export interface MilkType {
    milkTypeId: number;
    typeName: string;
  }
  