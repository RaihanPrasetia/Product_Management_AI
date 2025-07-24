// src/components/ErrorMessage.tsx
import { Alert } from "@mui/material";

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <Alert severity="error" sx={{ mt: 2 }}>
            {message}
        </Alert>
    );
};

export default ErrorMessage;
