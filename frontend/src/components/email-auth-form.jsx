import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { CloudUpload } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/auth-context'

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profileImage: z.any().optional(), // We validate manually
})

const EmailAuthForm = ({ type }) => {
    const { data: registerData, fetchData } = useFetch()
    const { fetchData: loginFn } = useFetch()
    const { login } = useAuthContext();
    const schema = type === 'login' ? loginSchema : registerSchema;
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const fileInputRef = useRef(null)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const navigate = useNavigate()


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            setValue('profileImage', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

    }

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File must be under 5MB');
                return;
            }
            setSelectedFile(file);
            setValue('profileImage', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('ring-2', 'ring-blue-500')
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('ring-2', 'ring-blue-500')
    }

    const onSubmit = async (fdata) => {

        const isSignup = type === 'signup';
        const body = new FormData();

        if (isSignup) {
            for (const key in fdata) {
                if (key === 'profileImage' && selectedFile) {
                    body.append(key, selectedFile);
                } else {
                    body.append(key, fdata[key]);
                }
            }
        } else {
            Object.assign(body, fdata); // login can still be plain JSON
        }

        const url = type === 'login' ? 'userLogin' : 'userSignup';

        try {
            if (type === "login") {
                const loginRes = await loginFn("userLogin", {
                    email: fdata.email,
                    password: fdata.password,
                });
                localStorage.setItem("accessToken", loginRes?.accessToken);
                login(loginRes?.user);
                navigate('/');
            } else if (type === "signup") {
                await fetchData(url, body);
                if (registerData) {
                    toast.success(`${type === 'login' ? 'Login' : 'Registration'} successful`);

                    if (type === 'signup') {
                        const loginRes = await loginFn("userLogin", {
                            email: fdata.email,
                            password: fdata.password,
                        });
                        localStorage.setItem("accessToken", loginRes?.accessToken);
                        login(loginRes?.user);
                        navigate('/');
                    }
                }
            }

        } catch (err) {
            toast.error(err?.response?.data?.message || "Authentication failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            {type === 'signup' && (
                <div>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        {...register('username')}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
            )}

            <div>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {type === 'signup' && (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-dashed border-2 border-gray-300 px-3 cursor-pointer text-center rounded hover:border-blue-400 transition ${preview ? 'py-2' : 'py-6'}`}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="mx-auto h-24 w-full object-cover rounded" />
                    ) : (
                        <>
                            <CloudUpload size={28} className="inline" />
                            <p className="text-gray-600">Drag & drop or click to upload profile picture</p>
                        </>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        {...register('profileImage')}
                        onChange={handleFileChange}
                        name="profileImage"
                        className="hidden"
                        ref={(e) => {
                            register('profileImage').ref(e); // <-- only attach react-hook-form ref
                            fileInputRef.current = e; // <-- manually save it for clicking
                        }}
                    />

                    {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage.message}</p>}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {isSubmitting ? 'Submitting...' : type === 'login' ? 'Login' : 'Register'}
            </button>
        </form>
    )
}

export default EmailAuthForm
