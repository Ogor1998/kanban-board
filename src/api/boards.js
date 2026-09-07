import api from "./axios";


export const findBoard = (id) => {
    return api.get(`/boards/${id}`)
}