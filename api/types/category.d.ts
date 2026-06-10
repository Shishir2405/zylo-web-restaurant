export interface createCategoryPayload {
  categoryName: string;
  categoryDescription: string;
}
export interface createProductPayload {
  name: string;
  productDescription: string;
  productPrice: string;
  commission: string;
  foodType: string;
  photos: any;
}
export interface IDisplayImage {
  url: string;
  id: string;
}
export interface categoriesDataType {
  id: string;
  categoryName: string;
  categoryDescription: string;
  displayImage: IDisplayImage | null;
  // createdBy: string;
  // createdDate: string;
  // updatedBy: string | null;
  // updatedDate: string;
}
