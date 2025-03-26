interface IResidence {
  address?: string;
  city?: string;
  zip?: number;
}
export interface IWorkingHours {
  workingDays: { start: string; finish: string };
  saturday: { start: string; finish: string };
  sunday: { start: string; finish: string };
}
export interface IShop {
  id: string;
  role: string;
  name: string;
  email: string;
  phone?: string;
  residence?: IResidence;
  photo?: string;
  description?: string;
  workingHours?: IWorkingHours;
  gdp: number;
  registrationNumber: number;
  facebook?: string;
  instagram?: string;
  suspended: boolean;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Buyer' | 'Admin';
  phone?: string;
  residence?: IResidence;
  photo?: string;
  suspended: boolean;
}
export interface IEditUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photo?: string;
  residence?: IResidence;
}
export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  phone?: string;
  residence?: IResidence;
  password: string;
  confirmPassword: string;
}
export interface ICredentials {
  email: string;
  password: string;
}
export interface IContact {
  email: string;
  phone?: string;
  residence?: IResidence;
  workingHours?: IWorkingHours;
  facebook?: string;
  instagram?: string;
}
export interface IReview {
  id: string;
  grade: number;
  message: string;
  shop: IShop;
  buyer: IUser;
  reported: boolean;
  createdBy: string;
  createdAt: Date;
}
export interface IProduct {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: string;
  photo: string;
  price: number;
}

export interface IPurchase {
  id: string;
  shop: string;
  buyer: string;
  products: [{ product: IProduct; quantity: number }];
  price: number;
  paymentType?: string | null;
}

export interface CartItem {
  id: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
}
