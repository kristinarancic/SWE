import React, { Dispatch, SetStateAction } from "react";
import {
  IShop,
  IUser,
  IEditUser,
  IRegisterUser,
  IWorkingHours,
} from "./Interfaces";

// Dodati tipove za forme
export const handleChange = <T,>(
  event: React.ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<T>>,
  formData: T
) => {
  setFormData({ ...formData, [event.target.name]: event.target.value });
};

export const handleChangeSelect = <T,>(
  event: React.ChangeEvent<HTMLSelectElement>,
  setFormData: Dispatch<SetStateAction<T>>,
  formData: T
) => {
  setFormData({ ...formData, [event.target.name]: event.target.value });
};
//Ovo je za Select u "Azuriraj proizvod"

export const handleResidenceChange = <
  T extends IShop | IUser | IEditUser | IRegisterUser
>(
  event: React.ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<T>>,
  formData: T
) => {
  setFormData({
    ...formData,
    residence: {
      ...formData.residence,
      [event.target.name]: event.target.value,
    },
  });
};

export const handleWorkingHoursChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setUser: React.Dispatch<React.SetStateAction<IShop>>,
  user: IShop
) => {
  const { name, value } = e.target;
  const updatedWorkingHours: IWorkingHours = {
    ...(user.workingHours as IWorkingHours),
  };
  if (
    name.startsWith("workingDays_") ||
    name.startsWith("saturday_") ||
    name.startsWith("sunday_")
  ) {
    const [day, field] = name.split("_");
    if (updatedWorkingHours[day as keyof IWorkingHours]) {
      const dayWorkingHours = updatedWorkingHours[
        day as keyof IWorkingHours
      ] as { start: string; finish: string };
      dayWorkingHours[field as keyof typeof dayWorkingHours] = value;
    }
  }
  setUser((prevUser) => ({
    ...prevUser,
    workingHours: updatedWorkingHours,
  }));
};

export const handleImageUpload = async <T,>(
  event: React.ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<T>>,
  formData: T
) => {
  const image = event.target.files?.[0];
  // Limit image to 2MB
  if (!image || (image.size !== undefined && image.size > 15000000))
    return "Slika je veća od 15MB, molimo Vas unesite sliku manje veličine!";
  const base64 = await convertToBase64(image);
  setFormData({ ...formData, photo: base64 });
};

export const convertToBase64 = (image: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const handleShowPassword = (
  setShowPassword: Dispatch<SetStateAction<boolean>>
) => setShowPassword((prevShowPassword: boolean) => !prevShowPassword);
