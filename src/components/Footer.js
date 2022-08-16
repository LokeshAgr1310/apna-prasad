import Image from "next/image"
import Link from "next/link"

function Footer() {
    return (
        <footer className='pt-2 mt-20 bg-primary text-white px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 pb-3'>
            <div className='mt-3 mb-1 grid grid-cols-2 md:grid-cols-4 items-center'>
                <div className='flex items-center md:col-span-1'>
                    <Link href="/">
                        <a className='flex items-center space-x-1 md:space-x-3'>
                            <Image src="/logo.png" className="w-10" height={50} width={50} />
                            <h2 className="tracking-wide text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-medium">APNA PRASAD</h2>
                        </a>
                    </Link>
                </div>
                <div className='justify-self-center md:col-span-2 order-last whitespace-nowrap mt-3 md:mt-0 md:order-none col-span-2 text-[10px] xs:text-xs sm:text-sm lg:text-lg'>
                    <h3>&copy; 2022
                        <Link href="/">
                            <a className="hover:underline mx-1">APNA PRASAD</a>
                        </Link>
                        All Rights Reserved.
                    </h3>
                </div>
                <div className='flex space-x-4 justify-self-end md:col-span-1'>
                    <a href="/">
                        <i className="fa-brands fa-instagram text-sm xs:text-lg transition-colors duration-100 ease-linear text-gray-600 hover:text-white"></i>
                    </a>
                    <a href="/">
                        <i className="fa-brands fa-facebook text-sm xs:text-lg transition-colors duration-100 ease-linear text-gray-600 hover:text-white"></i>
                    </a>
                    <a href="/">
                        <i className="fa-brands fa-youtube text-sm xs:text-lg transition-colors duration-100 ease-linear text-gray-600 hover:text-white"></i>
                    </a>
                    <a href="/">
                        <i className="fa-brands fa-snapchat text-sm xs:text-lg transition-colors duration-100 ease-linear text-gray-600 hover:text-white"></i>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer