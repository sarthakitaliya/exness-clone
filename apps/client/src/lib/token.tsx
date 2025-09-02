import Cookie from "js-cookie";
import api from "./api";

export const getAuthToken = () => {
    return Cookie.get("token");
};


export const setAuthToken = (token: string) => {
    Cookie.set("token", token, {
        expires: 7,
        secure: true, 
        sameSite: "strict", 
    });
};

export const checkAuth = async() => {
    const token = getAuthToken();   
    const user = await api.get("/user/check-auth");

    if (!token || !user) {
        return null;
    }
    return user;
};