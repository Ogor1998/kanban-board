import api from "./axios"


export const inviteUser = (boardId, specs) => {
    return api.post(`/boards/${boardId}/invite`, { specs })
}