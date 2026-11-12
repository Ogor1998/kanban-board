import api from "./axios";


export const findBoard = (id) => {
    return api.get(`/boards/${id}`)
}

export const updateBoardTitle = (id, specs) => {
    return api.post(`boards/${id}`, { specs })
}