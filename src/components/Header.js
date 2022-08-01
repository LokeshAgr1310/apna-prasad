import Image from "next/image"
import { SearchIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setCart } from "../slices/cartSlice"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebase-config"
import { Dropdown } from "flowbite-react"
// import { Dropdown } from "flowbite-react"

function Header() {

    const { data, status } = useSession()

    const router = useRouter()

    const [showDropDown, setShowDropDown] = useState(false)

    const { items } = useSelector(state => state.cart)

    const dispatch = useDispatch()
    // console.log("Session: ", data)

    const getProfileId = async () => {
        const q = query(collection(db, "profile"), where("email", "==", data?.user?.email))
        const queryData = await getDocs(q)
        queryData.docs.map((doc) => {
            localStorage.setItem("profile-id", JSON.stringify(doc.id))
        })
    }

    useEffect(() => {
        dispatch(setCart())

        if (status === 'authenticated') {
            if (!localStorage.getItem("profile-id")) {
                getProfileId()
            }
        }
    }, [dispatch, status])

    return (
        <nav className="w-full divide-y divide-white shadow-lg">
            <div className="bg-[#fb8304] h-22">
                <div className="p-3 mx-3 flex items-center justify-between">
                    <Link href="/">
                        <a>
                            <Image
                                onClick={() => router.push('/')}
                                src="/logo.png"
                                height={50}
                                width={70}
                                className="object-cover cursor-pointer"
                            />
                        </a>
                    </Link>
                    <div className="flex items-center max-w-2xl flex-grow space-x-3">
                        <input type="text" className="h-10 grow rounded-md p-3 focus:outline-none border-none" placeholder="Search in the store" />
                        <SearchIcon className="h-9 text-[#fb8304] rounded-full p-2 cursor-pointer bg-white" />
                    </div>
                    <div className="space-x-5 flex cursor-pointer items-center mr-4 mt-3">
                        <Link href="/cart">
                            <a>
                                <div className="flex flex-col items-center justify-center group relative">
                                    {/* <UserAddIcon className="h-6 icon" /> */}
                                    <i className="fa-solid fa-cart-shopping icon"></i>
                                    <span className="bg-red-600 animate-bounce text-[12px] bottom-4 left-4 text-white font-bold absolute rounded-full px-[5px] py-[1px]">{items?.length}</span>
                                </div>
                            </a>
                        </Link>
                        {
                            data ?
                                <div className="relative inline-block text-left">
                                    <button
                                        id="dropdownButton"
                                        className="text-white bg-base focus:outline-none font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center peer" type="button">
                                        <i className="fa-solid fa-bars icon"></i>
                                    </button>

                                    <div className={`z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow hidden peer-focus:block hover:block`} style={{
                                        position: "absolute", margin: "0px", transform: "translate3d(-100px, 10px, 0px)"
                                    }} id="dropdownMenu">
                                        <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            <div>{data?.user?.name}</div>
                                            <div className="font-medium truncate">{data?.user?.email}</div>
                                        </div>
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                            <li>
                                                <Link href="/">
                                                    <a className="block py-2 px-4 hover:bg-gray-100">PROFILE</a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/my-orders">
                                                    <a className="block py-2 px-4 hover:bg-gray-100">
                                                        MY ORDERS
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/">
                                                    <a className="block py-2 px-4 hover:bg-gray-100">SETTINGS</a>
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="py-1">
                                            <span onClick={() => {
                                                localStorage.removeItem("profile-id")
                                                signOut()
                                            }} className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">Sign out</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="flex flex-col items-center group" onClick={() => signIn()}>
                                    <h4 className="text-white tracking-wide">LOGIN</h4>
                                </div>
                        }
                    </div>
                </div>
            </div>
            {/* <div className="bg-[#fb8304] py-2 h-12">
                <ul className="flex space-x-4 text-xl text-white mx-5">
                    <Link href="/login">
                        <li className="cursor-pointer tracking-wider">
                            Prasad
                        </li>
                    </Link>
                    <Link href="/">
                        <li className="cursor-pointer tracking-wide">Poshaak</li>
                    </Link>
                    <Link href="/">
                        <li className="cursor-pointer tracking-wide">Idols</li>
                    </Link>
                    <Link href="/">
                        <li className="cursor-pointer tracking-wide">More</li>
                    </Link>
                </ul>
            </div> */}
        </nav >
    )
}

export default Header