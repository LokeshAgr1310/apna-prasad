import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

function Profile() {

    const { data } = useSession()

    return (
        <div className="my-10 flex flex-col w-full">
            <div className="ml-10">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/">
                                <a className="inline-flex items-center text-xs xs:text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900">
                                    <i className="fa-solid fa-house-chimney mr-2 text-gray-400"></i>
                                    Home
                                </a>
                            </Link>
                        </li>
                        {/* <li>
                                    <div className="flex items-center">
                                        <i className="fa-solid fa-angle-right text-gray-400"></i>
                                        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 capitalize">{category}</span>
                                    </div>
                                </li> */}
                        <li>
                            <div className="flex items-center">
                                <i className="fa-solid fa-angle-right text-gray-400"></i>
                                <span className="ml-1 text-xs xs:text-sm sm:text-base font-medium text-gray-500 md:ml-2 capitalize">My Account</span>
                            </div>
                        </li>
                        {/* <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Flowbite</span>
                                </div>
                            </li> */}
                    </ol>
                </nav>
            </div>
            <div className="grid grid-cols-5 mt-8 mx-16">
                <div>
                    <Image src={data?.user?.image} width={150} height={150} className="rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default Profile