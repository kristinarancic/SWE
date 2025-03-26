import './Footer.css';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import LocalFloristTwoToneIcon from '@mui/icons-material/LocalFloristTwoTone';

const Footer = () => {
  return (
    <div className='container-footer'>
      <div className='logo'>
        <LocalFloristTwoToneIcon
          style={{ fontSize: '40px' }}
          className='logomark'
        />
        <p
          className='logotype'
          style={{ fontSize: '34px', fontWeight: 'bold' }}
        >
          FLOWER POWER
        </p>
      </div>
      <div className='contact'>
        <div className='email'>
          <EmailOutlinedIcon />
          <p className='p-email'>support.flowerpower.com</p>
        </div>
        <div className='address'>
          <FmdGoodOutlinedIcon />
          <p className='p-address'>Aleksandra Medvedeva 14, Niš</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
