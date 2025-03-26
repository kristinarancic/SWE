export const isAdmin = (role: string) => {
  return role === 'Admin';
};


export const isBuyer = (role: string) => {
  return role === 'Buyer';
};

export const isGuest = (role: string) => {
  return role === 'Guest';
};

export const isShop = (role: string) => {
  return role === 'Shop';
};

export const isBuyerOrGuest = (role: string) => {
  return isGuest(role) || isBuyer(role);
};

export const isBuyerOrShop = (role: string) => {
  return isShop(role) || isBuyer(role);
};

export const isBuyerOrGuestOrAdmin = (role: string) => {
  return isGuest(role) || isBuyer(role) || isAdmin(role);
};
export const isBuyerOrShopOrAdmin = (role: string) => {
  return isBuyer(role) || isShop(role) || isAdmin(role);
};
