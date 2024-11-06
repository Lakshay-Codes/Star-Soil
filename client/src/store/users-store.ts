import { UserTypeProps } from "../interfaces";
import {create} from "zustand";

const userStore = create((set)=>({
    currentUser: null,
    setCurrentUser: (user: UserTypeProps) => set({ currentUser: user }),
}))

export default userStore;

export interface UserStoreProps {
    currentUser: UserTypeProps | null;
    setCurrentUser: (user: UserTypeProps) => void;
}