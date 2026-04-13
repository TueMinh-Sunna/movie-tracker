import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    user: null,
    isLoading: false,
  },
});