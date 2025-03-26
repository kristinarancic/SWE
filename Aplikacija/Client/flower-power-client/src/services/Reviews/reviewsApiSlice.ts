import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import { RootState } from '../store';
import { IReview } from '../../components/helpers/Interfaces';

const reviewsAdapter = createEntityAdapter<IReview>({});

const initialState = reviewsAdapter.getInitialState();

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<IReview[], { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: '/reviews',
        params: { id, role },
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
        transformErrorResponse: (response: { status: string | number }) =>
          response.status,
        providesTags: (result: { ids?: string[] }) => {
          if (result?.ids) {
            return [
              { type: 'Review', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Review', id })),
            ];
          } else return [{ type: 'Review', id: 'LIST' }];
        },
      }),
      transformResponse: (responseData: IReview[]) => {
        const loadedReviews = responseData.map((review) => {
          const { _id, ...updatedReview } = review as any;
          updatedReview.id = _id;
          return updatedReview;
        });
        const updatedState = reviewsAdapter.setAll(initialState, loadedReviews);
        return Promise.resolve(
          Object.values(updatedState.entities) as IReview[]
        );
      },
    }),
    // Should return notifications
    reportReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/report/${id}`,
        method: 'PATCH',
        validateStatus: (response: Response, result: { isError: boolean }) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
  }),
});
export const { useReportReviewMutation } = reviewsApiSlice;

// Returns query resuld object
export const selectReviewsResult = (id: string, role: string) =>
  reviewsApiSlice.endpoints.getReviews.select({ id, role });

// Creates memoized selector
const selectReviewsData = createSelector(
  (state: RootState, id: string, role: string) =>
    selectReviewsResult(id, role)(state),
  (reviewsResult) => {
    if (reviewsResult.data) {
      return {
        ids: reviewsResult.data.map((review) => review.id),
        entities: reviewsResult.data.reduce((entities, review) => {
          return { ...entities, [review.id]: review };
        }, {}),
      };
    }
    return { ids: [], entities: {} };
  }
);

// Define the type of state explicitly
const selectReviews = (state: RootState, id: string, role: string) =>
  selectReviewsData(state, id, role) ?? initialState;

// Select all reviews using createSelector and accessing the 'entities' property
export const selectAllReviews = createSelector(
  (state: RootState, id: string, role: string) =>
    selectReviews(state, id, role),
  (reviewsState) => Object.values(reviewsState.entities) as IReview[]
);
// Override the selectById selector to accept dynamic arguments
export const selectReviewById = (id: string, role: string, reviewId: string) =>
  createSelector(
    (state: RootState) => selectReviews(state, id, role),
    (reviewsState) => {
      const reviewEntities = reviewsState.entities as Record<string, IReview>;
      return reviewEntities[reviewId];
    }
  );
