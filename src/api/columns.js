import api from "./axios";


export const getColumns = (boardId) => {
    return api.get(`/columns/${boardId}`)
}
export const createColumn = (formData) => {
    return api.post(`/columns`, formData)
}

export const updateColumn = (columnID, formData) => {
    return api.put(`/columns/${columnID}`, formData)
}

export const deleteColumn = (columnID) => {
    return api.delete(`/columns/${columnID}`)
}