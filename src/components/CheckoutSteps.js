import Link from 'next/link'
import React from 'react'

function CheckoutSteps({ step1, step2, step3, step4 }) {
    return (
        <div>
            <div className="flex">
                <div>
                    {
                        step1
                            ? <div className='flex flex-col justify-center'>
                                <Link href="/cart">
                                    <a className="translate-x-[-10px] mb-3 font-semibold">
                                        CART
                                    </a>
                                </Link>
                                <div className='flex items-center justify-center'>
                                    {/* <i className="fa-solid fa-circle text-base"></i> */}
                                    <i className="fa-solid fa-circle-check text-base"></i>
                                    <div className="h-1 w-36 bg-base ml-[-3px]"></div>
                                </div>
                            </div>
                            :
                            <div className='flex flex-col justify-center'>
                                <Link href="/cart" className="translate-x-[-10px] text-gray-600 mb-3 pointer-events-none">
                                    <a>
                                        CART
                                    </a>
                                </Link>
                                <div className='flex items-center justify-center'>
                                    <i className="fa-solid fa-circle text-gray-400"></i>
                                    <div className="h-1 w-36 bg-gray-400 ml-[-3px]"></div>
                                </div>
                            </div>
                    }
                </div>
                <div>
                    {
                        step2
                            ? <div className='flex flex-col justify-center'>
                                <Link href="/checkout?step=2">
                                    <a className="translate-x-[-20px] mb-3 font-semibold">
                                        SHIPPING
                                    </a>
                                </Link>
                                <div className='flex items-center justify-center'>
                                    {/* <i className="fa-solid fa-circle text-base"></i> */}
                                    <i className="fa-solid fa-circle-check text-base"></i>
                                    <div className="h-1 w-36 bg-base ml-[-3px]"></div>
                                </div>
                            </div>
                            :
                            <div className='flex flex-col justify-center'>
                                <Link href="/checkout?step=2" >
                                    <a className="translate-x-[-20px] text-gray-600 mb-3 pointer-events-none">
                                        SHIPPING
                                    </a>
                                </Link>
                                <div className='flex items-center justify-center'>
                                    <i className="fa-solid fa-circle text-gray-400"></i>
                                    <div className="h-1 w-36 bg-gray-400 ml-[-3px]"></div>
                                </div>
                            </div>
                    }
                </div>
                <div>
                    {
                        step3
                            ? <div className='flex flex-col justify-center'>
                                <Link href="/checkout?step=3">
                                    <a className="translate-x-[-15px] mb-3 font-semibold">
                                        PAYMENT
                                    </a>
                                </Link>
                                <div className='flex items-center'>
                                    {/* <i className="fa-solid fa-circle text-base"></i> */}
                                    <i className="fa-solid fa-circle-check text-base"></i>
                                    {/* <div className="h-1 w-36 bg-base ml-[-3px]"></div> */}
                                </div>
                            </div>
                            :
                            <div className='flex flex-col justify-center'>
                                <Link href="/checkout?step=3">
                                    <a className="translate-x-[-15px] text-gray-600 mb-3 pointer-events-none">
                                        PAYMENT
                                    </a>
                                </Link>
                                <div className='flex items-center'>
                                    <i className="fa-solid fa-circle text-gray-400"></i>
                                    {/* <div className="h-1 w-36 bg-gray-500 ml-[-3px]"></div> */}
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default CheckoutSteps