import { apiSlice } from '../api/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/users',
        method: 'PATCH',
        body: { ...initialUserData },
      }),
    }),
    suspendUser: builder.mutation({
      query: (ids) => ({
        url: `/users/suspend`,
        method: 'PATCH',
        body: { ...ids },
      }),
    }),
    unsuspendUser: builder.mutation({
      query: (ids) => ({
        url: `/users/unsuspend`,
        method: 'PATCH',
        body: { ...ids },
      }),
    }),
    getUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),
  }),
});
export const {
  useUpdateUserMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useGetUserMutation,
} = usersApiSlice;
