import { api } from "./api";

export const getUsers = async () => {
    const response = await api.get("auth/users");
    return response.data;
};

export const registerUser = async (data: any) => {
    const response = await api.post("auth/register", data);
    return response.data;
};

export const loginUser = async ( data: any) => {
    const response = await api.post("auth/login", data);
    return response.data;
}