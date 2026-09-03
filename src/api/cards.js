import api from "./axios";


export const createCard = (formData) => {
    return api.post('/cards', formData)
}
export const updateACard = (cardID, formData) => {
    return api.put(`/cards/${cardID}`, formData)
}
export const deleteCard = (cardID) => {
    return api.delete(`/cards/${cardID}`)
}