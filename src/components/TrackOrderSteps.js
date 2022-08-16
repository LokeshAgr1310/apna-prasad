import React from 'react'
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

function TrackOrderSteps({ step, placedOn, shippedOn, deliveredOn }) {
    return (
        <ProgressBar
            percent={
                step === 1 ? 0
                    : step === 2 ? 33
                        : step === 3 ? 66
                            : step === 4 && 100
            }
            filledBackground="#26a541"
            height={5}
            // stepPositions={[25, 50, 75, 100]}
            className="line-clamp-2"
        // hasStepZero={false}
        >
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <h3 className="absolute translate-x-[-15px] bottom-6 sm:text-sm xs:text-xs text-[10px] font-medium">
                            Order Placed
                        </h3>
                        {/* <h3 className="absolute translate-x-[-15px] top-6 text-xs w-full font-medium">
                            {placedOn}
                        </h3> */}
                        {
                            step === 1
                                ? (
                                    <span className="flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        // style={{ width: "30px" }}
                                        className={`fa-solid fa-circle mr-[-6px] sm:text-sm xs:text-xs text-[10px]`}>
                                    </i>
                                )
                        }
                    </div>

                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <h3 className="absolute translate-x-[-15px] bottom-6 sm:text-sm xs:text-xs text-[10px] font-medium">
                            Shipped
                        </h3>
                        {
                            step === 2
                                ? (
                                    <span className="flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span className="relative inline-flex w-4 h-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        // style={{ width: "30px" }}
                                        className={`fa-solid fa-circle mr-[-6px] sm:text-sm xs:text-xs text-[10px]`}>
                                    </i>
                                )
                        }
                    </div>
                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <h3 className="absolute translate-x-[-15px] bottom-6 sm:text-sm xs:text-xs text-[10px] font-medium">
                            Out for Delivery
                        </h3>
                        {
                            step === 3
                                ? (
                                    <span className="flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5ee67c] opacity-75"></span>
                                        <span className="relative inline-flex w-4 h-4 rounded-full bg-[#26a541]"></span>
                                    </span>
                                ) : (

                                    <i
                                        // style={{ width: "30px" }}
                                        className={`fa-solid fa-circle mr-[-6px] sm:text-sm xs:text-xs text-[10px]`}>
                                    </i>
                                )
                        }
                    </div>
                )}
            </Step>
            <Step transition="scale">
                {({ accomplished }) => (
                    <div className={`relative flex flex-col justify-center ${accomplished ? "text-[#26a541]" : "text-gray-400"}`}>
                        <h3 className="absolute translate-x-[-15px] bottom-6 sm:text-sm xs:text-xs text-[10px] font-medium">
                            Delivered
                        </h3>
                        <i
                            // style={{ width: "30px" }}
                            className="fa-solid fa-circle mr-[-6px] sm:text-sm xs:text-xs text-[10px]">
                        </i>
                    </div>
                )}
            </Step>
        </ProgressBar>

    )
}

export default TrackOrderSteps