import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { RootState } from '../store';
import { IProduct } from '../../components/helpers/Interfaces';

const productsAdapter = createEntityAdapter<IProduct>({});

const initialState = productsAdapter.getInitialState({
  currentPage: 0,
  numberOfPages: 0,
});

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      { data: IProduct[]; currentPage: number; numberOfPages: number },
      { id: string; page: number } // Add page parameter
    >({
      query: ({ id, page }) => ({
        url: '/products/paginated',
        params: { id, page }, // Include page parameter in the params
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
        transformResponse: (responseData: {
          data: IProduct[];
          currentPage: number;
          numberOfPages: number;
        }) => {
          const loadedProducts = responseData.data.map((product) => {
            const { _id, ...updatedProduct } = product as any;
            updatedProduct.id = _id;
            return updatedProduct;
          });

          const updatedState = productsAdapter.setAll(
            initialState,
            loadedProducts
          );

          return {
            ...updatedState,
            currentPage: responseData.currentPage,
            numberOfPages: responseData.numberOfPages,
          };
        },
        providesTags: (result: { ids?: string[] }) => {
          if (result?.ids) {
            return [
              { type: 'Product', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Product', id })),
            ];
          } else return [{ type: 'Product', id: 'LIST' }];
        },
      }),
    }),
    updateProduct: builder.mutation<
      { product: IProduct },
      { product: IProduct }
    >({
      query: ({ product }) => ({
        url: `/products`,
        method: 'PATCH',
        body: { ...product },
      }),
      invalidatesTags: (arg): any => {
        const id = arg?.product.id;
        return [{ type: 'Product', id }];
      },
    }),
    uploadCSV: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/products/csv',
        method: 'PATCH',
        body: formData,
      }),
    }),
    getRandomImages: builder.query<string[], string>({
      query: (shopId) => ({
        url: `/products/fourRandom/${shopId}`,
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetRandomImagesQuery,
  useUpdateProductMutation,
  useUploadCSVMutation,
} = productsApiSlice;

// Returns query result object
export const selectProductsResult = (
  id: string,
  page: number // Add page parameter
) => productsApiSlice.endpoints.getProducts.select({ id, page }); // Include page parameter in the select

// Creates memoized selector
const selectProductsData = createSelector(
  (state: RootState, id: string, page: number) =>
    selectProductsResult(id, page)(state), // Add page parameter
  (productsResult) => {
    if (
      productsResult.status === 'fulfilled' &&
      Array.isArray(productsResult.data?.data)
    ) {
      const transformedData = productsResult.data.data.map((product) => {
        const { _id, ...updatedProduct } = product as any;
        updatedProduct.id = _id;
        return updatedProduct;
      });
      return {
        ids: transformedData.map((product) => product.id),
        entities: transformedData.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {}),
        currentPage: productsResult.data.currentPage,
        numberOfPages: productsResult.data.numberOfPages,
      };
    }

    return initialState;
  }
);

const selectProducts = (state: RootState, id: string, page: number) => {
  // Add page parameter
  const productsData = selectProductsData(state, id, page); // Include page parameter in the select
  return productsData.entities;
};

export const selectAllProducts = createSelector(
  selectProducts,
  (productsState) => {
    return Object.values(productsState) as IProduct[];
  }
);

export const selectProductById = (
  state: RootState,
  id: string,
  productId: string,
  page: number
) => {
  const productsState = selectProducts(state, id, page); // Add page parameter
  return productsState[productId];
};

export const selectNumberOfPages = (
  state: RootState,
  id: string,
  page: number
) => {
  const productsData = selectProductsData(state, id, page); // Add page parameter
  return productsData.numberOfPages;
};
