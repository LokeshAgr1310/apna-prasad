import Link from 'next/link'
import React from 'react'
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from 'react-step-progress-bar'

function CheckoutSteps({ step }) {
    return (
        <ProgressBar
            percent={
                step === "1" ? 25
                    : step === "2" ? 50
                        : step === "3" && 100
            }
            filledBackground="#26a541"
            height={5}
            // stepPositions={[25, 50, 75, 100]}
            className="line-clamp-2"
            hasStepZero={true}
        >
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <Link href="/cart">
                            <a className={`absolute translate-x-[-15px] ${parseInt(step) <= 1 && "pointer-events-none"} bottom-6 text-xs sm:text-sm font-medium`}>
                                CART
                            </a>
                        </Link>
                        {/* <h3 className="absolute translate-x-[-15px] top-6 text-xs w-full font-medium">
                            {placedOn}
                        </h3> */}
                        {
                            step === "1"
                                ? (
                                    <span class="flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span class="relative inline-flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        className={`fa-solid fa-circle mr-[-6px] text-xs sm:text-sm`}>
                                    </i>
                                )
                        }
                    </div>

                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <Link href="/cart">
                            <a className={`absolute translate-x-[-15px] bottom-6 ${parseInt(step) <= 2 && "pointer-events-none"} text-xs sm:text-sm font-medium`}>
                                SHIPPING
                            </a>
                        </Link>
                        {
                            step === "2"
                                ? (
                                    <span class="flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span class="relative inline-flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        className={`fa-solid fa-circle mr-[-6px] text-xs sm:text-sm`}>
                                    </i>
                                )
                        }
                    </div>
                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <Link href="/checkout?step=3">
                            <a className={`absolute translate-x-[-15px] bottom-6 text-xs sm:text-sm ${parseInt(step) <= 3 && "pointer-events-none"} font-medium`}>
                                PAYMENT
                            </a>
                        </Link>
                        {
                            step === "3"
                                ? (
                                    <span class="flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span class="relative inline-flex w-2.5 h-2.5 xs:h-3 xs:w-3 sm:w-4 sm:h-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        className={`fa-solid fa-circle mr-[-6px] text-xs sm:text-sm`}>
                                    </i>
                                )
                        }
                    </div>
                )}
            </Step>
        </ProgressBar>
        // <div>
        //     <div className="flex">
        //         <div>
        //             {
        //                 step1
        //                     ? <div className='flex flex-col justify-center'>
        //                         <Link href="/cart">
        //                             <a className="translate-x-[-10px] mb-3 font-semibold">
        //                                 CART
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center justify-center'>
        //                             {/* <i className="fa-solid fa-circle text-primary"></i> */}
        //                             <i className="fa-solid fa-circle-check text-primary"></i>
        //                             <div className="h-1 w-36 bg-primary ml-[-3px]"></div>
        //                         </div>
        //                     </div>
        //                     :
        //                     <div className='flex flex-col justify-center'>
        //                         <Link href="/cart" className="translate-x-[-10px] text-gray-600 mb-3 pointer-events-none">
        //                             <a>
        //                                 CART
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center justify-center'>
        //                             <i className="fa-solid fa-circle text-gray-400"></i>
        //                             <div className="h-1 w-36 bg-gray-400 ml-[-3px]"></div>
        //                         </div>
        //                     </div>
        //             }
        //         </div>
        //         <div>
        //             {
        //                 step2
        //                     ? <div className='flex flex-col justify-center'>
        //                         <Link href="/checkout?step=2">
        //                             <a className="translate-x-[-20px] mb-3 font-semibold">
        //                                 SHIPPING
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center justify-center'>
        //                             {/* <i className="fa-solid fa-circle text-primary"></i> */}
        //                             <i className="fa-solid fa-circle-check text-primary"></i>
        //                             <div className="h-1 w-36 bg-primary ml-[-3px]"></div>
        //                         </div>
        //                     </div>
        //                     :
        //                     <div className='flex flex-col justify-center'>
        //                         <Link href="/checkout?step=2" >
        //                             <a className="translate-x-[-20px] text-gray-600 mb-3 pointer-events-none">
        //                                 SHIPPING
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center justify-center'>
        //                             <i className="fa-solid fa-circle text-gray-400"></i>
        //                             <div className="h-1 w-36 bg-gray-400 ml-[-3px]"></div>
        //                         </div>
        //                     </div>
        //             }
        //         </div>
        //         <div>
        //             {
        //                 step3
        //                     ? <div className='flex flex-col justify-center'>
        //                         <Link href="/checkout?step=3">
        //                             <a className="translate-x-[-15px] mb-3 font-semibold">
        //                                 PAYMENT
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center'>
        //                             {/* <i className="fa-solid fa-circle text-primary"></i> */}
        //                             <i className="fa-solid fa-circle-check text-primary"></i>
        //                             {/* <div className="h-1 w-36 bg-primary ml-[-3px]"></div> */}
        //                         </div>
        //                     </div>
        //                     :
        //                     <div className='flex flex-col justify-center'>
        //                         <Link href="/checkout?step=3">
        //                             <a className="translate-x-[-15px] text-gray-600 mb-3 pointer-events-none">
        //                                 PAYMENT
        //                             </a>
        //                         </Link>
        //                         <div className='flex items-center'>
        //                             <i className="fa-solid fa-circle text-gray-400"></i>
        //                             {/* <div className="h-1 w-36 bg-gray-500 ml-[-3px]"></div> */}
        //                         </div>
        //                     </div>
        //             }
        //         </div>
        //     </div>
        // </div>
    )
}

export default CheckoutSteps