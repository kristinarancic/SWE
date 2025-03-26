import { apiSlice } from '../api/apiSlice';
import { logOut, logIn, setPhoto } from './authSlice';
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ credentials, entityType }) => ({
        url: `/auth/login/${entityType.toLowerCase()}`,
        method: 'POST',
        body: { ...credentials },
      }),
      // Vidi da li treba ovde dodati nesto
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(logIn({ accessToken }));
        } catch (error: any) {
          console.log(error.error.status);
        }
      },
    }),
    register: builder.mutation({
      query: ({ entity, entityType }) => ({
        url: `/auth/register/${entityType.toLowerCase()}`,
        method: 'POST',
        body: { ...entity },
      }),
    }),
    getProfileImage: builder.mutation({
      query: ({ id, role }) => ({
        url: `/auth/photo`,
        method: 'POST',
        body: { id, role },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPhoto(data));
        } catch (error: any) {
          console.log(error.error.status);
        }
      },
    }),
  }),
});
export const {
  useLoginMutation,
  useRefreshMutation,
  useSendLogoutMutation,
  useRegisterMutation,
  useGetProfileImageMutation,
} = authApiSlice;
