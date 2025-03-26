import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

interface AccountIconProps {
  sx?: React.CSSProperties;
}

const SearchIconButton = ({ sx }: AccountIconProps) => {
  return (
    <IconButton
      size="medium"
      edge="start"
      color="inherit"
      aria-label="logo"
      sx={sx}
    >
      <SearchIcon />
    </IconButton>
  );
};

export default SearchIconButton;
