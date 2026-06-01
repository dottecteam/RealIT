interface ValidateLoginProps {
    email: string;
    password: string;
    setError: (message: string) => void;
}

export const validateLogin = ({ email, password, setError }: ValidateLoginProps) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("E-mail inválido (deve conter @ e domínio)");
        return false;
    }
    if (password.length < 8) {
        setError("A senha deve ter no mínimo 8 caracteres");
        return false;
    }
    return true;
};