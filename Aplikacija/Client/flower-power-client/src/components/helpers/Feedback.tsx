import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';

import { useSelector } from 'react-redux';
import {
  selectCurrentFeedback,
  closeFeedback,
} from '../../services/Feedback/feedbackSlice';
import { useDispatch } from 'react-redux';

const Feedback = () => {
  function TransitionDown(props: SlideProps) {
    return <Slide {...props} direction='down' />;
  }
  const { open, time, severity, message } = useSelector(selectCurrentFeedback);
  const dispatch = useDispatch();
  const vertical = 'top';
  const horizontal = 'center';

  return (
    <Snackbar
      open={open}
      autoHideDuration={time}
      onClose={() => dispatch(closeFeedback())}
      TransitionComponent={TransitionDown}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert severity={severity} variant='filled'>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Feedback;
