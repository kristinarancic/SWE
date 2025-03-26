import { IconButton } from "@mui/material";
import React from "react";
import LocalFloristTwoToneIcon from "@mui/icons-material/LocalFloristTwoTone";
import { Link } from "react-router-dom";

const Logomark = () => {
  return (
    <IconButton size="large" edge="start" color="inherit" aria-label="logo">
      <Link to="/" className="logo-icon">
        <LocalFloristTwoToneIcon />
      </Link>
    </IconButton>
  );
};

export default Logomark;
