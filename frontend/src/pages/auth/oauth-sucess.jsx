import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
const OAuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            localStorage.setItem('accessToken', token);
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [navigate, token]);

    return <div>Logging you in...</div>;
};

export default OAuthSuccess;
