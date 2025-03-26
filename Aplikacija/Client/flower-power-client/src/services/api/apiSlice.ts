import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import { logIn, logOut } from '../Auth/authSlice';
import { RootState } from '../store';
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    console.log('sending refresh token');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult?.data) {
      console.log(refreshResult.data);
      // store new token
      api.dispatch(logIn({ ...refreshResult.data }));
      // retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else api.dispatch(logOut());
  }
  return result;
};
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Shop', 'Purchase', 'Product', 'User'],
  endpoints: (builder) => ({}),
});
