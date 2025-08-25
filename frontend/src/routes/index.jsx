import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Loader from "@/components/common/Loader";
import RequireAuth from '@/components/common/require-auth';
import MainLayout from '@/layouts/MainLayout.jsx';
import AuthLayout from '@/layouts/AuthLayout.jsx';
import OAuthSuccess from '@/pages/auth/oauth-sucess.jsx';

const HomePage = lazy(() => import("@/pages/home/landing"));
const BlogListPage = lazy(() => import("@/pages/blogs/BlogListPage"));
const BlogDetailPage = lazy(() => import("@/pages/blogs/BlogDetailPage"));
const BlogEditorPage = lazy(() => import("@/pages/blogs/BlogEditorPage"));
const ProfileViewPage = lazy(() => import("@/pages/profile/ViewProfile"));
const MyBlogsPage = lazy(() => import("@/pages/blogs/BlogListPage"));
const ProfileEditPage = lazy(() => import("@/pages/profile/EditProfile"));
const DashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const NotFoundPage = lazy(() => import("@/pages/error/NotFound"));
const ServerErrorPage = lazy(() => import("@/pages/error/ServerError"));


const AppRouter = () => {

    // eslint-disable-next-line no-unused-vars
    const withSuspense = (Component) => (
        <Suspense fallback={<Loader />}>
            <Component />
        </Suspense>
    );

      
    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            errorElement: withSuspense(ServerErrorPage),
            children: [
                { index: true, element: withSuspense(HomePage) },
                { path: "blogs", element: withSuspense(BlogListPage) },
                { path: "blogs/:id", element: withSuspense(BlogDetailPage) },
                { path: "profile/:username", element: withSuspense(ProfileViewPage) },
                {
                    element: <RequireAuth />,
                    children: [
                        { path: "blogs/new", element: withSuspense(BlogEditorPage)},
                        { path: "blogs/edit/:id", element: withSuspense(BlogEditorPage) },
                        { path: "profile/me", element: withSuspense(MyBlogsPage) },
                        { path: "profile/edit", element: withSuspense(ProfileEditPage) },
                    ],
                },
            ],
        },

        // Auth layout (no header/footer)
        {
            path: "/",
            element: <AuthLayout />,
            children: [
                { path: "login", element: null },
                { path: "signup", element: null },
            ],

        },
        {
            path: '/auth/o-auth/google',
            element: <OAuthSuccess />
        },
        {
            path: '/auth/o-auth/github',
            element: <OAuthSuccess/>
        },

        {
            path: "*",
            element: withSuspense(NotFoundPage),
        },
    ]);

    return router;

}

export default AppRouter
