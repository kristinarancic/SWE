import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { IPurchase } from '../../components/helpers/Interfaces';

const purchasesAdapter = createEntityAdapter<IPurchase>({});

const initialState = purchasesAdapter.getInitialState();

export const purchaseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPurchase: builder.query<IPurchase, string>({
      query: (id) => ({
        url: '/purchases/cart',
        params: { id },
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
      providesTags: ['Purchase'],
      transformResponse: (response: any) => {
        // Transform the response data to replace _id with id
        const transformedResponse = response;
        if (transformedResponse) {
          transformedResponse.id = transformedResponse._id;
          delete transformedResponse._id;
          transformedResponse.products?.map((product: any) => {
            product.product.id = product.product._id;
          });
          return transformedResponse;
        }
      },
    }),
    createPurchase: builder.mutation<IPurchase, Partial<IPurchase>>({
      query: ({ id, products }) => ({
        url: '/purchases',
        method: 'POST',
        body: { id, products },
      }),
      invalidatesTags: ['Purchase'],
    }),
    deletePurchase: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Purchase'],
    }),
    confirmPurchase: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/purchases/confirm/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Purchase'],
    }),
    addProductsToPurchase: builder.mutation<
      IPurchase,
      { id: string; productId: string }
    >({
      query: ({ id, productId }) => ({
        url: `/purchases/add`,
        method: 'PATCH',
        body: { id, productId },
      }),
      invalidatesTags: ['Purchase'],
    }),
    decreaseProductsFromPurchase: builder.mutation<
      IPurchase,
      { id: string; productId: string }
    >({
      query: ({ id, productId }) => ({
        url: `/purchases/decrease`,
        method: 'PATCH',
        body: { id, productId },
      }),
      invalidatesTags: ['Purchase'],
    }),
    removeProductFromPurchase: builder.mutation<
      IPurchase,
      { id: string; productId: string }
    >({
      query: ({ id, productId }) => ({
        url: `/purchases/remove`,
        method: 'PATCH',
        body: { id, productId },
      }),
      invalidatesTags: ['Purchase'],
    }),
  }),
});

export const {
  useGetPurchaseQuery,
  useCreatePurchaseMutation,
  useAddProductsToPurchaseMutation,
  useDecreaseProductsFromPurchaseMutation,
  useRemoveProductFromPurchaseMutation,
  useDeletePurchaseMutation,
  useConfirmPurchaseMutation,
} = purchaseApiSlice;
