import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import useFetch from "@/hooks/useFetch";
const Landing = () => {
	const { isAuthenticated } = useAuthContext();
	const { data, fetchData } = useFetch()
	useEffect(() => {
		fetchData('trendingBlogs')
	}, [])

	return (
		<div className="bg-white text-gray-900 font-serif bg-repeat bg-[url('/bg.jpg')]">
			<section className="border-b border-gray-200">
				<div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-start md:flex-row justify-between">
					<div className="md:w-1/2 space-y-6">
						<h1 className="text-5xl font-bold leading-tight tracking-tight">
							Explore ideas, share stories, and connect with thoughtful people
						</h1>
						<p className="text-lg text-gray-700">
							Inkspire is a place to read and write your thoughts, insights, and
							perspectives on the things that matter most.
						</p>
						<div className="mt-6">
							<Link
								data-modal-target="popup-modal" data-modal-toggle="popup-modal"
								to={isAuthenticated ? "/blogs/new" : "/signup"}
								className="px-6 py-3 bg-black text-white font-medium rounded hover:opacity-90 transition"
							>
								Start Writing
							</Link>
						</div>
					</div>
					<div className="md:w-1/2 mt-10 md:mt-0 flex justify-end">
						<img
							src="/writing.webp"
							alt="Writing"
							className="w-full max-w-md scale-110 object-contain max-md:hidden max-sm:hidden"
						/>
					</div>
				</div>
			</section>

			{/* Trending Topics (Mockup-style like Medium) */}
			<section className="py-16 px-6 max-w-6xl mx-auto">
				<h2 className="text-2xl font-semibold mb-6">Trending on Inkspire</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{data?.blogs?.length > 0 && data.blogs.map((item) => {
						console.log({ item })
						return <div key={item.id} className="space-y-2">
							<p className="text-sm text-gray-400">{item.author?.username}</p>
							<h3 className="text-lg font-semibold hover:underline cursor-pointer">
								{item.title}
							</h3>
							<p className="text-sm text-gray̥-600">3 min read • <span className="font-mono">{item.createdAt.toLocaleString('en-US', { month: 'short' })}</span></p>
						</div>
					})
					}
				</div>
			</section>

			<section className="border-t border-b border-gray-200 py-16 px-6 font-mono">
				<div className="max-w-4xl mx-auto text-center space-y-6">
					<h2 className="text-3xl font-bold">
						Join a community of curious minds and bold writers.
					</h2>
					<p className="text-gray-700">
						Whether you're a seasoned writer or just getting started, Inkspire
						gives you the tools and audience to grow.
					</p>
					<Link
						to={isAuthenticated ? "/blogs/new" : "/signup"}
						className="inline-block px-6 py-3 bg-black text-white font-medium rounded hover:opacity-90 transition"
					>
						Start Publishing
					</Link>
				</div>
			</section>
		</div>
	);
};

export default Landing;
