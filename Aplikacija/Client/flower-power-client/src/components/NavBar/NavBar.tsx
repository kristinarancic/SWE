import { createTheme } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import "./NavBar.css";
import DrawerComp from "./DrawerComp";
import SearchBar from "./SearchBar";
import { useLocation } from "react-router-dom";

import {
  isAdmin,
  isGuest,
  isBuyerOrGuest,
  isBuyerOrGuestOrAdmin,
  isBuyerOrShop,
  isBuyerOrShopOrAdmin,
} from "../helpers/roleConditionals";

import LoginButton from "./buttonsNavbar/LoginButton";
import Logomark from "./buttonsNavbar/Logomark";
import ShoppingCartButton from "./buttonsNavbar/ShoppingCartButton";
import { SectionNavBar } from "./helpers/sectionNavBar";

import AccountMenu from "./buttonsNavbar/AccountMenu";
import { useEffect, useState } from "react";


interface NavBarProps {
  role: string;
}

export const NavBar: React.FC<NavBarProps> = ({ role }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ba68c8",
      },
    },
  });
  const themeDrawer = useTheme();
  const isMatch = useMediaQuery(themeDrawer.breakpoints.down(930));

  const location = useLocation();

  const [isShopUrl, setIsShopUrl] = useState(false);
  const [isHomeUrl, setIsHomeUrl] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    setIsShopUrl(path.startsWith("/shop") && !path.includes("/product/"));
  }, [location]);

  useEffect(() => {
    setIsHomeUrl(location.pathname === "/home" || location.pathname === "/");
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar>
          <Toolbar>
            <Logomark />

            {isMatch ? (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: "1.5rem",
                    paddingLetft: "10%",
                    width: "100%",
                  }}
                  className="logotype"
                >
                  FLOWER POWER
                </Typography>
                {(isHomeUrl || isShopUrl) && <DrawerComp role={role} />}
                {isBuyerOrGuest(role) && <ShoppingCartButton role={role} />}
                {isBuyerOrShop(role) && <AccountMenu />}
                {isAdmin(role) && (
                  <>
                    <AccountMenu />
                  </>
                )}
              </>
            ) : (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                  className="logotype"
                >
                  FLOWER POWER
                </Typography>
                {isBuyerOrGuestOrAdmin(role) && (isHomeUrl || isShopUrl) && (
                  <SearchBar />
                )}
                {isBuyerOrGuest(role) && (isHomeUrl || isShopUrl) && (
                  <SectionNavBar />
                )}
                {isGuest(role) && <LoginButton />}
                {isBuyerOrGuest(role) && (
                  <div className="shopping-cart-div">
                    <ShoppingCartButton
                      sx={{ marginLeft: "20px" }}
                      role={role}
                    />
                  </div>
                )}
                {isBuyerOrShopOrAdmin(role) && (
                  <div className="account-logo-button">
                    <AccountMenu />
                  </div>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};

export default NavBar;
