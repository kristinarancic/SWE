import "./Shops.css";
import { Button } from "@mui/base";
import { useNavigate, useParams } from "react-router-dom";

import { IShop } from "../../../helpers/Interfaces";
import coverPhoto from "../../../../images/cover.jpg"
import { useSelector } from "react-redux";
import { selectNumberOfPages } from "../../../../services/Shops/shopsApiSlice";
import { RootState } from "../../../../services/store";

interface Props {
  shops: IShop[];
}

const Shops: React.FC<Props> = ({ shops }) => {
  const navigate = useNavigate();
  const { page } = useParams();
  const currentPage = page ? parseInt(page) : 1;
  const numberOfPages = useSelector((state: RootState) =>
    selectNumberOfPages(state, currentPage)
  );
  const isLastPage = numberOfPages === currentPage ? true : false;

  return (
    <section id="Prodavnice" className="shops">
      <div className="container">
        <h1 className="shop-shop">Prodavnice</h1>
        <div className="shop-grid">
          {shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div className="text-shop">
                <h2 className="shop-name">{shop.name}</h2>
              </div>
              <img
                className="shop-img"
                src={shop ? shop.photo : coverPhoto}
                alt={shop.name}
              />
              <button
                onClick={() => navigate(`/shop/${shop.id}`)}
                className="button-visitShop"
              >
                Poseti prodavnicu
              </button>
            </div>
          ))}
        </div>
        {!isLastPage && (
          <Button
            className="show-more"
            onClick={() => {
              navigate(`/${currentPage + 1}`);
            }}
          >
            Prikazi više
          </Button>
        )}{" "}
        {currentPage !== 1 && (
          <Button
            className="show-more"
            onClick={() => {
              navigate(`/${currentPage - 1}`);
            }}
          >
            Nazad
          </Button>
        )}
      </div>
    </section>
  );
};

export default Shops;
