import { api } from "./api";

export const createBoard = async (data: any) => {
    const {title, description, members} = data
    if(!title)return
    const response = await api.post('/boards', {title:title,description:description, members:members})
    
    return response.data
}

export const getBoards = async () => {
    const response = await api.get('/boards')
    return response.data
}


export const countBoards = async () => {
    const response = await api.get('/boards/count')
    return response.data
}

export const deleteBoard = async (id: string) => {
    await api.delete(`/boards/${id}`)
}

export const getBoardById = async (id: string) => {
    const response = await api.get(`/boards/${id}`)
    return response.data
}

export const updateBoard = async (id: string, data: any) => {
    const response = await api.patch(`/boards/${id}`, data)
    return response.data
}


export const getBoardsWithTaskCount = async () => {
    const response = await api.get('/boards/count')
    return response.data
}