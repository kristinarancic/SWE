import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import "./DrawerComp.css";

import { useDispatch } from "react-redux";
import { toggleLoginDialog } from "../../services/Dialog/dialogSlice";

import { isGuest } from "../helpers/roleConditionals";
import { useLocation } from "react-router-dom";

interface NavBarProps {
  role: string;
}

const DrawerComp: React.FC<NavBarProps> = ({ role }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handleLoginOpen = (role: "User" | "Shop") => {
    setOpenDrawer(false);
    dispatch(toggleLoginDialog(role));
  };

  const location = useLocation();

  const [isShopUrl, setIsShopUrl] = useState(false);
  const [isHomeUrl, setIsHomeUrl] = useState(false);

  useEffect(() => {
    setIsShopUrl(location.pathname.startsWith("/shop"));
  }, [location]);

  useEffect(() => {
    setIsHomeUrl(location.pathname === "/home" || location.pathname === "/");
  }, [location]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <ul className="ul-drawer">
          <li className="li-drawers">
            <a
              href="#O-nama"
              className="sekcije-drawer"
              onClick={() => setOpenDrawer(false)}
            >
              O nama
            </a>
          </li>
          <li className="li-drawers">
            <a
              href="#Pretraga"
              className="sekcije-drawer"
              onClick={() => setOpenDrawer(false)}
            >
              Pretraga
            </a>
          </li>
          {isHomeUrl && (
            <>
              <li className="li-drawers">
                <a
                  href="#Prodavnice"
                  className="sekcije-drawer"
                  onClick={() => setOpenDrawer(false)}
                >
                  Prodavnice
                </a>
              </li>
              <li className="li-drawers">
                <a
                  href="#Cesta-pitanja"
                  className="sekcije-drawer"
                  onClick={() => setOpenDrawer(false)}
                >
                  Česta pitanja
                </a>
              </li>
            </>
          )}
          {isShopUrl && (
            <>
              <li className="li-drawers">
                <a
                  href="#Proizvodi"
                  className="sekcije-drawer"
                  onClick={() => setOpenDrawer(false)}
                >
                  Proizvodi
                </a>
              </li>
              <li className="li-drawers">
                <a
                  href="#Recenzije"
                  className="sekcije-drawer"
                  onClick={() => setOpenDrawer(false)}
                >
                  Recenzije
                </a>
              </li>
              <li className="li-drawers">
                <a
                  href="#Kontakt"
                  className="sekcije-drawer"
                  onClick={() => setOpenDrawer(false)}
                >
                  Kontakt
                </a>
              </li>
            </>
          )}
          {isGuest(role) && (
            <>
              <li className="li-drawers-login">
                <a
                  href="#Prijavi-se"
                  className="sekcije-drawer-login"
                  onClick={handleMenuOpen}
                >
                  Prijavi se
                </a>
              </li>
              <Menu
                id="login-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleLoginOpen("User");
                    handleMenuClose();
                  }}
                >
                  Prijavi se kao korisnik
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleLoginOpen("Shop");
                    handleMenuClose();
                  }}
                >
                  Prijavi se kao prodavnica
                </MenuItem>
              </Menu>
            </>
          )}
        </ul>
      </Drawer>
      <IconButton
        sx={{ color: "whitesmoke", marginLeft: "auto", marginRight: "15px" }}
        onClick={() => setOpenDrawer(!openDrawer)}
      >
        <MenuIcon />
      </IconButton>
    </React.Fragment>
  );
};

export default DrawerComp;
