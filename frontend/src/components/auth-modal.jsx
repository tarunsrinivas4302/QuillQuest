import { Link, useNavigate } from 'react-router-dom';
import EmailAuthForm from './email-auth-form';
import { X } from 'lucide-react';
import OAuthBtn from './oAuthBtn';

const AuthModal = ({ type }) => {
    const navigate = useNavigate();

    const closeModal = () => navigate('/');

   
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 w-full h-full">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative shadow-lg">
                <button onClick={closeModal} className="absolute top-2 right-2 text-xl cursor-pointer"><X /></button>
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {type === 'login' ? 'Login' : 'Register'}
                </h2>
                <EmailAuthForm type={type} />
                <div className="text-right mt-1.5">
                    {type === "signup" ? (
                        <>
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </>
                    )}
                </div>
                <hr className='my-2' />
                <div className="text-center text-gray-500 my-3 capitalize">or continue with</div>

                <OAuthBtn text="Sign in With Google" />
                <OAuthBtn text="Sign in With Github" />

            </div>
        </div >
    );
};

export default AuthModal;
