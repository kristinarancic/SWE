import { createSlice } from '@reduxjs/toolkit';

type DialogState = {
  register: boolean;
  login: boolean;
  editUser: boolean;
  changeShopDescription: boolean;
  editShop: boolean;
  editProduct: boolean;
  addProducts: boolean;
  clearCart: boolean;
  entityType: 'User' | 'Shop' | undefined;
};
const initialState: DialogState = {
  register: false,
  login: false,
  editUser: false,
  changeShopDescription: false,
  editShop: false,
  editProduct: false,
  addProducts: false,
  clearCart: false,
  entityType: undefined,
};
export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    toggleLoginDialog: (state, action) => {
      state.register = false;
      state.editUser = false;
      state.login = !state.login;
      state.entityType = action.payload;
    },
    toggleRegisterDialog: (state, action) => {
      state.login = false;
      state.editUser = false;
      state.register = !state.register;
      state.entityType = action.payload;
    },
    toggleEditUserDialog: (state) => {
      state.login = false;
      state.register = false;
      state.editUser = !state.editUser;
    },
    toggleChangeShopDescriptionDialog: (state) => {
      state.changeShopDescription = !state.changeShopDescription;
    },
    toggleEditShopDialog: (state) => {
      state.editShop = !state.editShop;
    },
    toggleEditProductDialog: (state) => {
      state.editProduct = !state.editProduct;
    },
    toggleAddProductsDialog: (state) => {
      state.addProducts = !state.addProducts;
    },
    toggleClearCartDialog: (state) => {
      state.clearCart = !state.clearCart;
    },
  },
});
export const {
  toggleLoginDialog,
  toggleRegisterDialog,
  toggleEditUserDialog,
  toggleChangeShopDescriptionDialog,
  toggleEditShopDialog,
  toggleEditProductDialog,
  toggleAddProductsDialog,
  toggleClearCartDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;

export const selectCurrentLoginDialog = (state: { dialog: DialogState }) =>
  state.dialog.login;
export const selectCurrentRegisterDialog = (state: { dialog: DialogState }) =>
  state.dialog.register;
export const selectCurrentEditUserDialog = (state: { dialog: DialogState }) =>
  state.dialog.editUser;
export const selectCurrentChangeShopDescriptionDialog = (state: {
  dialog: DialogState;
}) => state.dialog.changeShopDescription;
export const selectCurrentEditShopDialog = (state: { dialog: DialogState }) =>
  state.dialog.editShop;
export const selectCurrentEditProductDialog = (state: {
  dialog: DialogState;
}) => state.dialog.editProduct;
export const selectCurrentAddProductsDialog = (state: {
  dialog: DialogState;
}) => state.dialog.addProducts;
export const selectCurrentClearCartDialog = (state: { dialog: DialogState }) =>
  state.dialog.clearCart;
export const selectCurrentEntityTypeDialog = (state: { dialog: DialogState }) =>
  state.dialog.entityType;
