import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const SectionNavBar = () => {
  const location = useLocation();
  const [isShopUrl, setIsShopUrl] = useState(false);

  useEffect(() => {
    setIsShopUrl(location.pathname.startsWith("/shop"));
  }, [location]);

  if (!isShopUrl) {
    return (
      <nav>
        <ul>
          <li>
            <a href="#O-nama" className="sekcija">
              O nama
            </a>
          </li>
          <li>
            <a href="#Prodavnice" className="sekcija">
              Prodavnice
            </a>
          </li>
          <li>
            <a href="#Cesta-pitanja" className="sekcija">
              Česta pitanja
            </a>
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav>
        <ul>
          <li>
            <a href="#O-nama" className="sekcija">
              O nama
            </a>
          </li>
          <li>
            <a href="#Proizvodi" className="sekcija">
              Proizvodi
            </a>
          </li>
          <li>
            <a href="#Recenzije" className="sekcija">
              Recenzije
            </a>
          </li>
          <li>
            <a href="#Kontakt" className="sekcija">
              Kontakt
            </a>
          </li>
        </ul>
      </nav>
    );
  }
};
