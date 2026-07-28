import { useLocation } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Typography } from '@mui/material'

const Error = () => {
    const location = useLocation();
    const statusCode = location.state?.statusCode || 404
    const message = location.state?.message || "Page not found"
    const stack = location.state?.stack  // ← add this

    const style = {
        textAlign: 'center'
    }

    return (
        <div style={style}>
            <Typography variant="h1" gutterBottom>
                {statusCode}
            </Typography>
            <Typography variant="body2" gutterBottom>  {message}</Typography>

            {stack && (
                <pre style={{
                    background: '#1a1a1a',
                    color: '#ff4444',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    overflow: 'auto'
                }}>
                    {stack}
                </pre>
            )}
        </div>
    )
}

export default Error