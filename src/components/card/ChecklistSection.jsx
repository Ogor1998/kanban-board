
import { useState } from "react"
import { Box, Button, Typography, TextField } from "@mui/material"
import { Checkbox } from "@mui/material"
import axios from "axios"
import { LinearProgress } from "@mui/material"


export default function ChecklistSection({ checklist = [], cardId, setColumns }) {
    const [newItem, setNewItem] = useState("")

    const updateCardInColumns = (updatedCard) => {
        setColumns(prev => prev.map(col => ({
            ...col,
            cards: col.cards?.map(c => c._id === updatedCard._id ? updatedCard : c)
        })));
    };

    const addItem = async () => {
        try {
            const res = await axios.post(`/cards/${cardId}/checklist`, { title: newItem.trim() })
            if (!newItem.trim()) return;
            console.log('API response:', res.data);
            updateCardInColumns(res.data.card)
            console.log('this is new item', newItem)
            setNewItem("")
        } catch (err) {
            console.log('Failed to add checklist item', err)
        }
    }

    const toggleItem = async (itemId) => {
        try {
            const res = await axios.patch(`/cards/${cardId}/checklist/${itemId}`)
            console.log('Toggle response:', res.data);
            updateCardInColumns(res.data.card)
        } catch (err) {
            console.log('Failed to toggle item', err)

        }
    }

    const completed = checklist.filter(item => item.completed).length
    const progress = Math.round((completed / checklist.length) * 100) || 0

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>Checklist</Typography>
                <Typography variant="caption" color="text.secondary">{progress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mb: 2 }} />

            <Box sx={{
                display: 'flex',
                gap: '10px',
                minHeight: '10rem',
                flexDirection: 'row',
                justifyContent: 'center',
                border: '0.3px solid #000',
                borderRadius: '15px',
                width: '100%',
                minWidth: 400
            }}>
                <Box sx={{ flex: 1, maxHeight: 200, overflowY: "auto" }}>
                    {checklist.length === 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>No items yet</Typography>
                    ) : (
                        checklist.map(item => (
                            <Box key={item._id} sx={{ display: "flex", alignItems: "center", py: 0.25 }}>
                                <Checkbox
                                    size="small"
                                    checked={Boolean(item.completed)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleItem(item._id);
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        textDecoration: item.completed ? "line-through" : "none",
                                        color: item.completed ? "text.secondary" : "text.primary"
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '5rem',
                    gap: '10px',
                    p: 1
                }}>
                    <TextField
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addItem();
                            }
                        }}
                        placeholder="Add an item"
                        size="small"
                    />
                    <Button
                        type="button"
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            addItem();
                        }}
                    >
                        Add
                    </Button>
                </Box>

            </Box>
        </Box>
    )
}