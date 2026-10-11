import api from "./axios"
export const getActivity = (boardId) => {
    return api.get(`/activity/${boardId}`)
}
export const getUserActivity = (username, specs) => {
    return api.get(`/activity/user/${username}`, { specs })
}