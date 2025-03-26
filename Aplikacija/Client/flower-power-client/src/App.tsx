import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import User from './pages/User/User';
import Product from './pages/Shop/Product/Product';

import PrefetchShops from './services/Shops/PrefetchShops';

import PersistUserAuth from './services/Auth/AuthFeatures/persistAuth';
import RequireAuth from './services/Auth/AuthFeatures/requireAuth';
import PrefetchReviews from './services/Reviews/PrefetchReviews';
import PrefetchProducts from './services/Products/PrefetchProducts';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<PersistUserAuth />}>
        {/* Public Rooutes */}
        <Route element={<PrefetchShops />}>
          <Route path='/:page?' element={<Home />} />
          <Route element={<PrefetchProducts />}>
            <Route
              path='/shop/:id/:productsPage?/product/:productId'
              element={<Product />}
            />
            <Route element={<PrefetchReviews role='Shop' />}>
              <Route path='shop/:id/:productsPage?' element={<Shop />} />
            </Route>
          </Route>
        </Route>
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<PrefetchReviews role='User' />}>
            <Route path='userprofile/:id' element={<User />} />
          </Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
