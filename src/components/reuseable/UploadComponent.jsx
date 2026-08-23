import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadComponent({ setFile, setPreviews }) {

    return (

        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload Images
            <VisuallyHiddenInput
                multiple
                type="file"
                onChange={(event) => {
                    const files = Array.from(event.target.files)
                    setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
                    setFile(prev => [...prev, ...files])
                }}
            />

        </Button>

    );
}