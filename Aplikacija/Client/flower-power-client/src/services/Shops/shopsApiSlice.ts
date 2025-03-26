import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { RootState } from '../store';
import { IShop } from '../../components/helpers/Interfaces';

const shopsAdapter = createEntityAdapter<IShop>({});

const initialState = shopsAdapter.getInitialState({
  currentPage: 0,
  numberOfPages: 0,
  data: <IShop[]>{},
});

export const shopsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<
      { data: IShop[]; currentPage: number; numberOfPages: number },
      number
    >({
      query: (page) => ({
        url: '/shops/paginated',
        params: { page },
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
        transformResponse: (responseData: {
          data: IShop[];
          currentPage: number;
          numberOfPages: number;
        }) => {
          const loadedShops = responseData.data.map((shop) => {
            const { _id, ...updatedShop } = shop as any;
            updatedShop.id = _id;
            return updatedShop;
          });

          const updatedState = shopsAdapter.setAll(initialState, loadedShops);

          return {
            ...updatedState,
            currentPage: responseData.currentPage,
            numberOfPages: responseData.numberOfPages,
          };
        },
        providesTags: (result: { data?: IShop[] }) => {
          console.log('bla');
          const shopIds = result?.data?.map((shop) => shop.id);

          if (shopIds) {
            return [
              { type: 'Shop', id: 'LIST' },
              ...shopIds.map((id) => ({ type: 'Shop', id })),
            ];
          } else {
            return [{ type: 'Shop', id: 'LIST' }];
          }
        },
      }),
    }),

    updateShop: builder.mutation<{ shop: IShop }, { shop: IShop }>({
      query: ({ shop }) => ({
        url: `/shops`,
        method: 'PATCH',
        body: { ...shop },
      }),
      invalidatesTags: (arg): any => {
        const id = arg?.shop.id;
        return [{ type: 'Shop', id }];
      },
    }),
    updateShopDescription: builder.mutation<
      { id: string; description: string | undefined },
      { id: string; description: string | undefined }
    >({
      query: ({ id, description }) => ({
        url: `/shops/description`,
        method: 'PATCH',
        body: { id, description },
      }),
      invalidatesTags: (arg: { id: string } | undefined): any => [
        'Shop',
        arg?.id || 'LIST',
      ],
    }),

    suspendShop: builder.mutation({
      query: (ids) => ({
        url: `/shops/suspend`,
        method: 'PATCH',
        body: { ...ids },
      }),
    }),
    unsuspendShop: builder.mutation({
      query: (ids) => ({
        url: `/shops/unsuspend`,
        method: 'PATCH',
        body: { ...ids },
      }),
    }),
  }),
});
export const {
  useGetShopsQuery,
  useUpdateShopMutation,
  useUpdateShopDescriptionMutation,
  useSuspendShopMutation,
  useUnsuspendShopMutation,
} = shopsApiSlice;

// Returns query resuld object
export const selectShopsResult = (page: number) =>
  shopsApiSlice.endpoints.getShops.select(page);

// Creates memoized selector
const selectShopsData = createSelector(
  (state: RootState, page: number) => selectShopsResult(page)(state),
  (shopsResult) => {
    if (
      shopsResult.status === 'fulfilled' &&
      Array.isArray(shopsResult.data?.data)
    ) {
      const transformedData = shopsResult.data.data.map((shop) => {
        const { _id, ...updatedShop } = shop as any;
        updatedShop.id = _id;
        return updatedShop;
      });
      return {
        ids: transformedData.map((shop) => shop.id),
        entities: transformedData.reduce((acc, shop) => {
          acc[shop.id] = shop;
          return acc;
        }, {}),
        currentPage: shopsResult.data.currentPage,
        numberOfPages: shopsResult.data.numberOfPages,
      };
    }

    return initialState;
  }
);

const selectShops = (state: RootState, page: number) => {
  const shopsData = selectShopsData(state, page);
  return shopsData.entities;
};

export const selectAllShops = createSelector(selectShops, (shopsState) => {
  if (Array.isArray(shopsState)) {
    return shopsState as IShop[];
  } else if (typeof shopsState === 'object' && shopsState !== null) {
    return Object.values(shopsState || {}) as IShop[];
  } else {
    return [];
  }
});

export const selectShopById = (state: RootState, page: number, id: string) => {
  const shopsState = selectShops(state, page);
  if (typeof shopsState === 'object' && shopsState !== null) {
    const shopArray = Object.values(shopsState) as IShop[];
    const shop = shopArray.filter((shop: IShop) => shop.id === id);
    return shop[0];
  } else return null;
};

export const selectNumberOfPages = (state: RootState, page: number) => {
  const shopsData = selectShopsData(state, page);
  return shopsData.numberOfPages;
};
