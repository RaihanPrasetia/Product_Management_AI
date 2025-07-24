// src/components/SuccessMessage.tsx
import { Alert } from "@mui/material";

interface SuccessMessageProps {
    message: string;
}

const SuccessMessage = ({ message }: SuccessMessageProps) => {
    return (
        <Alert severity="success" sx={{ mt: 2 }}>
            {message}
        </Alert>
    );
};

export default SuccessMessage;
