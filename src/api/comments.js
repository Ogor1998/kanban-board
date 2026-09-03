import api from "./axios";

export const getComments = (cardID) => {
    return api.get(`/comments/${cardID}`)
}
export const deleteComments = (commentId) => {
    return api.delete(`/comments/${commentId}`)
}
export const commentsCount = (cardID) => {
    return api.get(`comments/${cardID}/count`)
}
export const createComments = (formData) => {
    return api.post(`/comments`, formData)
}