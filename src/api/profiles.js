import api from "./axios"
export const getProfile = (username) => {
    return api.get(`/info/${username}`)
}

export const getUserProfile = (username) => {
    return api.get(`/profile/${username}`)
}