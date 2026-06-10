import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  profilePicture: {
    id: string;
    publicId: string;
    url: string;
    uploadedAt: string;
  };
};

interface userInterface {
  userDetails: User;
}
const userInitialState: User = {
  id: "",
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  address: {
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  },
  profilePicture: {
    id: "",
    publicId: "",
    url: "",
    uploadedAt: "",
  },
};

const initialState: userInterface = {
  userDetails: userInitialState,
};

const userDetailSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.userDetails = action.payload;
    },
    resetUser: () => initialState,
  },
});

export const { setCurrentUser, resetUser } = userDetailSlice.actions;
export default userDetailSlice.reducer;
