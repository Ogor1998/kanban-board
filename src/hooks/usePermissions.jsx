import { useAuth } from "../context/AuthContext";

import React from 'react'

const usePermissions = (board) => {
    const { currentUser } = useAuth();
    const isAdmin = board?.members?.some(m => m.user?._id === currentUser?._id && m.role === 'admin');
    const isOwner = currentUser?._id === board?.owner?._id;
    const isMember = board?.members?.some(m => m.user?._id === currentUser?._id)
    const canEdit = isAdmin || isOwner;
    return (
        {
            isAdmin,
            isOwner,
            canEdit,
            isMember
        }
    )
}

export default usePermissions