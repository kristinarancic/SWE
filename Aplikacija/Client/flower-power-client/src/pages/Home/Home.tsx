import Footer from '../../components/Footer/Footer';
import AboutUs from '../../components/Home/sections/o-nama/AboutUs';
import Shops from '../../components/Home/sections/prodavnice/Shops';
import Faq from '../../components/Home/sections/cesta-pitanja/Faq';
import Slider from '../../components/Home/Slider';

import { selectAllShops } from '../../services/Shops/shopsApiSlice';
import Loading from '../../components/helpers/Loading';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { useParams } from 'react-router';

const Home = () => {
  // For pagination
  const { page } = useParams();
  const shopsPage = page ? parseInt(page) : 1;
  const shops = useSelector((state: RootState) =>
    selectAllShops(state, Number(shopsPage))
  );
  return (
    <>
      <Slider />
      <AboutUs />
      {shops.length !== 0 ? (
        <Shops shops={shops} />
      ) : (
        <div style={{ position: 'relative' }}>
          <Loading />
        </div>
      )}
      <Faq />
      <Footer />
    </>
  );
};

export default Home;
