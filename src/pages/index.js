import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import NavLink from '@/components/NavLink'

import { useRouter } from 'next/router'
import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import { useAuth } from '@/hooks/auth'
export default function Home() {

    // loginしていたらdashboardに遷移
    useAuth({ middleware: 'guest', redirectIfAuthenticated: '/dashboard' })

    const router = useRouter()

    // ドロップダウンの開閉状態
    const [open, setOpen] = useState(false)

    return (
        <>
            <Head>
                <title>NEXT</title>
            </Head>

            <div className="bg-gray-900 min-h-screen">
                <nav className="bg-white border-b border-gray-100 shadow-md">
                    {/* Primary Navigation Menu */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                {/* Logo */}
                                <div className="flex-shrink-0 flex items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                                    </Link>
                                </div>

                                {/* Navigation Links */}
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    <NavLink
                                        href="/"
                                    >

                                    </NavLink>
                                </div>
                            </div>

                            {/* Settings Dropdown */}
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
                                        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">

                                            <div className="ml-1">
                                                <svg
                                                    className="fill-current h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                    }>
                                    {/* Authentication */}
                                    <DropdownButton>
                                        <Link href="/login">
                                            Login
                                        </Link>
                                    </DropdownButton>
                                    <DropdownButton>
                                        <Link href="/register">
                                            Register
                                        </Link>
                                    </DropdownButton>

                                </Dropdown>
                            </div>

                            {/* Hamburger */}
                            <div className="-mr-2 flex items-center sm:hidden ">
                                <button
                                    onClick={() => setOpen(open => !open)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        {open ? (
                                            <path
                                                className="inline-flex"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        ) : (
                                            <path
                                                className="inline-flex"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Responsive Navigation Menu */}
                    {
                        open && (
                            <div className="block sm:hidden">

                                {/* Responsive Settings Options */}
                                <div className="pt-4 pb-1 border-t border-gray-200 bg-gray-100">

                                    <div className="mt-3 space-y-1">
                                        {/* Authentication */}
                                        <ResponsiveNavButton>
                                            <Link href="/login">
                                                Login
                                            </Link>
                                        </ResponsiveNavButton>
                                        <ResponsiveNavButton>
                                            <Link href="/register">
                                                Register
                                            </Link>
                                        </ResponsiveNavButton>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </nav >
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-900 text-white py-12">
                        <svg
                            className="mx-auto my-4 w-32 h-32"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="m23.749 30.005c-.119.063-.109.083.005.025.037-.015.068-.036.095-.061 0-.021 0-.021-.1.036zm.24-.13c-.057.047-.057.047.011.016.036-.021.068-.041.068-.047 0-.027-.016-.021-.079.031zm.156-.094c-.057.047-.057.047.011.016.037-.021.068-.043.068-.048 0-.025-.016-.02-.079.032zm.158-.093c-.057.047-.057.047.009.015.037-.02.068-.041.068-.047 0-.025-.016-.02-.077.032zm.213-.141c-.109.073-.147.12-.047.068.067-.041.181-.131.161-.131-.043.016-.079.043-.115.063zm-9.563-29.536c-.073.005-.292.025-.484.041-4.548.412-8.803 2.86-11.5 6.631-1.491 2.067-2.459 4.468-2.824 6.989-.129.88-.145 1.14-.145 2.333 0 1.192.016 1.448.145 2.328.871 6.011 5.147 11.057 10.943 12.927 1.043.333 2.136.563 3.381.704.484.052 2.577.052 3.061 0 2.152-.24 3.969-.771 5.767-1.688.276-.14.328-.177.291-.208-.88-1.161-1.744-2.323-2.609-3.495l-2.557-3.453-3.203-4.745c-1.068-1.588-2.14-3.172-3.229-4.744-.011 0-.025 2.109-.031 4.681-.011 4.505-.011 4.688-.068 4.792-.057.125-.151.229-.276.287-.099.047-.188.057-.661.057h-.541l-.141-.088c-.088-.057-.161-.136-.208-.229l-.068-.141.005-6.271.011-6.271.099-.125c.063-.077.141-.14.229-.187.131-.063.183-.073.724-.073.635 0 .74.025.907.208 1.296 1.932 2.588 3.869 3.859 5.812 2.079 3.152 4.917 7.453 6.312 9.563l2.537 3.839.125-.083c1.219-.813 2.328-1.781 3.285-2.885 2.016-2.308 3.324-5.147 3.767-8.177.129-.88.145-1.141.145-2.333 0-1.193-.016-1.448-.145-2.328-.871-6.011-5.147-11.057-10.943-12.928-1.084-.343-2.199-.577-3.328-.697-.303-.031-2.371-.068-2.631-.041zm6.547 9.677c.151.072.265.208.317.364.027.084.032 1.823.027 5.74l-.011 5.624-.989-1.52-.995-1.521v-4.083c0-2.647.011-4.131.025-4.204.047-.167.161-.307.313-.395.124-.063.172-.068.667-.068.463 0 .541.005.645.063z" />
                        </svg>

                        <h1 className="text-center text-4xl font-bold">NEXT</h1>
                        <p className="text-center text-lg mt-4">
                            未知なる冒険へ。趣味と仲間を見つけよう。
                        </p>
                    </div>
                    <div className="container mx-auto p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <Link href="/login">
                                    <h2 className="text-2xl font-semibold">LOGIN</h2>
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <Link href="/register">
                                    <h2 className="text-2xl font-semibold">REGISTER</h2>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
