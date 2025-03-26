import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import { useDispatch } from "react-redux";
import { toggleLoginDialog } from "../../../services/Dialog/dialogSlice";

export default function LoginButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleLoginOpen = (role: "User" | "Shop" | undefined) => {
    dispatch(toggleLoginDialog(role));
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClick}
        size="medium"
        sx={{ ml: 2 }}
        color="secondary"
        variant="contained"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Prijavi se
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{ color: "#ab47bc" }}
          onClick={() => {
            handleLoginOpen("Shop");
          }}
        >
          <ListItemIcon>
            <LoginIcon fontSize="medium" sx={{ color: "#9c27b0" }} />
          </ListItemIcon>
          Cvećara
        </MenuItem>
        <MenuItem
          sx={{ color: "#ab47bc" }}
          onClick={() => {
            handleLoginOpen("User");
          }}
        >
          <ListItemIcon>
            <LoginIcon fontSize="medium" sx={{ color: "#9c27b0" }} />
          </ListItemIcon>
          Kupac
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
