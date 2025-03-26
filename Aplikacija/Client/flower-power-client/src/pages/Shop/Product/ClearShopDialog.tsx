import { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  toggleClearCartDialog,
  selectCurrentClearCartDialog,
} from '../../../services/Dialog/dialogSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useDeletePurchaseMutation } from '../../../services/Purchase/purchaseApiSlice';
import { setFeedback } from '../../../services/Feedback/feedbackSlice';
import './ClearShopDialog.css';

interface Props {
  purchaseId: string;
}
const ClearShopingCart: React.FC<Props> = ({ purchaseId }) => {
  const dispatch = useDispatch();
  const theme = createTheme();
  const open = useSelector(selectCurrentClearCartDialog);

  const [deleteShoppingCart, { isSuccess, isError, error }] =
    useDeletePurchaseMutation();

  const handleRemoveShopingCart = async () => {
    await deleteShoppingCart(purchaseId);
    dispatch(toggleClearCartDialog());
  };

  useEffect(() => {
    if (isSuccess)
      dispatch(
        setFeedback({
          open: true,
          message: `Uspešno brisanje trenutne kupovine! Probajte da dodate proizvod ponovo!`,
          time: 4000,
          severity: 'success',
        })
      );
    if (isError && error)
      dispatch(
        setFeedback({
          open: true,
          message: `Neuspešno brisanje trenutne kupovine! ${error}`,
          time: 4000,
          severity: 'error',
        })
      );
  }, [isSuccess, dispatch, isError, error]);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {
          dispatch(toggleClearCartDialog());
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title' color={'#9c27b0'}>
          Da li ste sigurni da želite da obrišete trenutnu korpu?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Da biste dodali proizvod u korpu, morate prvo završiti prethodnu
            kupovinu ili izbrisati trenutni sadržaj korpe, jer proizvodi nisu iz
            iste cvećare.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className='button-stop-purchare'
            onClick={() => {
              dispatch(toggleClearCartDialog());
            }}
            autoFocus
          >
            Zatvori
          </Button>
          <Button
            className='button-stop-purchare'
            onClick={handleRemoveShopingCart}
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
export default ClearShopingCart;
