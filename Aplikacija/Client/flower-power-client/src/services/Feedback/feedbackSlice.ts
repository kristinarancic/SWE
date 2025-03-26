import { createSlice } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';
type FeedbackState = {
  open: boolean;
  time: number;
  message: string;
  severity: AlertColor;
};
const initialState: FeedbackState = {
  open: false,
  time: 0,
  message: '',
  severity: 'info',
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback: (state, action) => {
      const { open, time, message, severity } = action.payload;
      state.open = open;
      state.time = time;
      state.message = message;
      state.severity = severity;
    },
    closeFeedback: (state) => {
      state.open = false;
      state.time = 0;
      state.message = '';
      state.severity = 'info';
    },
  },
});
export const { setFeedback, closeFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
export const selectCurrentFeedback = (state: { feedback: FeedbackState }) =>
  state.feedback;
