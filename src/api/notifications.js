import api from "./axios"
// export const getActivity = (boardId) => {
//     return api.get(`/activity/${boardId}`)
// }
export const getNotifications = (specs) => {
    return api.get(`/notifications/user`, { specs })
}