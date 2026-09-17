export const getActionColor = (action) => {
    switch (action) {
        case 'Created a card': return '#4caf50'  // green
        case 'Deleted a card': return '#f44336'  // red
        case 'Updated a card': return '#2196f3'  // blue
        case 'Moved a card': return '#ff9800'  // orange
        case 'Invited a member': return '#9c27b0'  // purple
        case 'Deleted a member': return '#e91e63'
        case 'Created a board title': return '#4caf50'
        case 'Updated a board title': return '#2196f3'
        case 'Invited a board member': return '#4caf50'
        case 'Deleted a board': return '#f44336'
        case 'Created a column': return '#4caf50'
        case 'Updated a column title': return '#2196f3'
        case 'Deleted a column': return '#f44336'
        default: return '#607d8b'  // grey
    }
}