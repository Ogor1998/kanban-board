import React from 'react';
import { Box, Skeleton } from '@mui/material';
import '../pages/Show.css';

export default function ColumnSkeleton() {
    return (
        <Box className="big__container">
            <Box
                className="board__top"
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                }}
            >

                <Skeleton
                    variant="rounded"
                    width={220}
                    height={40}
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.25)', borderRadius: '10px' }}
                />
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Skeleton
                        variant="rounded"
                        width={180}
                        height={38}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                    />
                    <Skeleton
                        variant="rounded"
                        width={120}
                        height={38}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                    />
                    <Skeleton
                        variant="circular"
                        width={38}
                        height={38}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                    />
                </Box>
            </Box>

            {/* Board Grid matching .board */}
            <div className="board">
                {[1, 2, 3].map((col) => (
                    <div key={col} className="row" style={{ padding: '16px' }}>
                        {/* Column Header (matches Heading) */}
                        <Box
                            sx={{
                                width: '25rem',
                                maxWidth: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 1,
                                mb: 1
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width="45%"
                                height={32}
                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.28)' }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Skeleton
                                    variant="circular"
                                    width={24}
                                    height={24}
                                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                                />
                                <Skeleton
                                    variant="circular"
                                    width={24}
                                    height={24}
                                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                                />
                            </Box>
                        </Box>

                        {/* Cards matching .card (25rem wide, centered, rounded) */}
                        {[1, 2, 3].map((card) => (
                            <Box
                                key={card}
                                className="card"
                                sx={{
                                    bgcolor: '#ffffff',
                                    p: 2.5,
                                    boxSizing: 'border-box',
                                    alignItems: 'stretch !important'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Skeleton variant="text" width="70%" height={26} />
                                    <Skeleton
                                        variant="rounded"
                                        width={48}
                                        height={20}
                                        sx={{ borderRadius: '9px' }}
                                    />
                                </Box>
                                <Skeleton variant="text" width="90%" height={18} />
                                <Skeleton variant="text" width="40%" height={18} />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
                                    <Skeleton variant="circular" width={26} height={26} />
                                </Box>
                            </Box>
                        ))}

                        {/* Add Card Button placeholder */}
                        <Skeleton
                            variant="rounded"
                            sx={{
                                width: '25rem',
                                maxWidth: '100%',
                                height: 38,
                                borderRadius: '10px',
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                mt: 0.5
                            }}
                        />
                    </div>
                ))}
            </div>
        </Box>
    );
}