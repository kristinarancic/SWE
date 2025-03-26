import { Button } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditUserForm from '../EditUserForm';

import { toggleEditUserDialog } from '../../../services/Dialog/dialogSlice';
import { useDispatch } from 'react-redux';

const EditButton = () => {
  const nameColor = '#414141';
  const dispatch = useDispatch();

  return (
    <>
      <EditUserForm />
      <Button
        variant='text'
        sx={{ color: nameColor }}
        startIcon={<EditNoteIcon />}
        onClick={() => {
          dispatch(toggleEditUserDialog());
        }}
      >
        Uredi
      </Button>
    </>
  );
};
export default EditButton;
