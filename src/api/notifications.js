import api from "./axios"
// export const getActivity = (boardId) => {
//     return api.get(`/activity/${boardId}`)
// }
export const getNotifications = (username, specs) => {
    return api.get(`/notifications/user/${username}`, { specs })
}