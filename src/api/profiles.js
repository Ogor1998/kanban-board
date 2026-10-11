import api from "./axios"
export const getProfile = (username) => {
    return api.get(`/boards/user/${username}`)
}

export const getUserProfile = (username) => {
    return api.get(`/profile/${username}`)
}