import api from "./axios"
export const getActivity = (boardId, specs) => {
    return api.get(`/activity/boards/${boardId}`, { specs })
}
export const getUserActivity = (username, specs) => {
    return api.get(`/activity/user/${username}`, { specs })
}