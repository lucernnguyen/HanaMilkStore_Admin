export interface MilkPicture {
  milkPictureId: number;
  milkId: number;
  picture: string;
}

export interface Product {
  milkId: number;
  milkName: string;
  brandId: number;
  capacity: string;
  milkTypeId: number;
  appropriateAge: string;
  storageInstructions: string;
  price: number;
  discount: number;
  milkPictures: MilkPicture[]; // Cập nhật tên thuộc tính
}
  
  export interface Brand {
    brandId: number;
    brandName: string;
  }
  
  export interface MilkType {
    milkTypeId: number;
    typeName: string;
  }
  