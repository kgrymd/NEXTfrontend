import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from '@/styles/components/Navigation.module.css'


const Navigation = ({ user }) => {
    const router = useRouter()

    const { logout } = useAuth()

    const [open, setOpen] = useState(false)

    return (
        <nav className={`${styles.nav} border-b border-gray-100`}>
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
                                href="/recruitments"
                                active={router.pathname === '/recruitments'}>
                                Recruitments
                            </NavLink>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/unchartedChallenge"
                                active={router.pathname === '/unchartedChallenge'}>
                                Uncharted challenge
                            </NavLink>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/profile"
                                active={router.pathname === '/profile'}>
                                My page
                            </NavLink>
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-300 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.name}</div>

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
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                <Link
                                    href="/unchartedChallenge/history"
                                    active={router.pathname === '/unchartedChallenge/history'}>
                                    過去のチャレンジ
                                </Link>
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                <Link
                                    href="/myRecruitments/likedRecruitments"
                                    active={router.pathname === '/myRecruitments/likedRecruitments'}>
                                    お気に入りした募集
                                </Link>
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                <Link
                                    href="/myRecruitments/joinedRecruitments"
                                    active={router.pathname === '/myRecruitments/joinedRecruitments'}>
                                    参加した募集
                                </Link>
                            </DropdownButton>
                            <DropdownButton onClick={logout}>
                                <Link
                                    href="/myRecruitments/createdRecruitments"
                                    active={router.pathname === '/myRecruitments/createdRecruitments'}>
                                    作成した募集
                                </Link>
                            </DropdownButton>

                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
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
            {open && (
                <div className="block sm:hidden">

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        user?.icon_path
                                            ? `${process.env.NEXT_PUBLIC_AWS_URL}${user.icon_path}`
                                            : '/user_circle_icon.svg'
                                    }
                                    alt="icon"
                                    className="h-10 w-10 rounded-full border border-gray-400"
                                />
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-300">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-sm text-gray-400">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                            <ResponsiveNavButton>
                                <Link
                                    href="/unchartedChallenge/history"
                                    active={router.pathname === '/unchartedChallenge/history'}>
                                    過去のチャレンジ
                                </Link>
                            </ResponsiveNavButton>
                            <ResponsiveNavButton>
                                <Link
                                    href="/myRecruitments/likedRecruitments"
                                    active={router.pathname === '/myRecruitments/likedRecruitments'}>
                                    お気に入りした募集
                                </Link>
                            </ResponsiveNavButton>
                            <ResponsiveNavButton>
                                <Link
                                    href="/myRecruitments/joinedRecruitments"
                                    active={router.pathname === '/myRecruitments/joinedRecruitments'}>
                                    参加した募集
                                </Link>
                            </ResponsiveNavButton>
                            <ResponsiveNavButton>
                                <Link
                                    href="/myRecruitments/createdRecruitments"
                                    active={router.pathname === '/myRecruitments/createdRecruitments'}>
                                    作成した募集
                                </Link>
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
