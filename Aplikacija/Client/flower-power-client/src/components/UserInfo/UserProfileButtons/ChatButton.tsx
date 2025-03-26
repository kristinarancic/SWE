import { Button } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useNavigate } from 'react-router-dom';

const ChatButton = () => {
  const nameColor = '#414141';
  const navigate = useNavigate();
  return (
    <Button
      variant='text'
      sx={{ color: nameColor }}
      startIcon={<ChatBubbleIcon />}
      onClick={() => {
        // Change to navigate to messanger
        navigate('/');
      }}
    >
      Specijalna ponuda
    </Button>
  );
};
export default ChatButton;
