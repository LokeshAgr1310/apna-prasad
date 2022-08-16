import Head from "next/head"
import CheckoutSteps from "../components/CheckoutSteps"
import Payment from "../components/Payment"
import ShippingAddress from "../components/ShippingAddress"
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

function Checkout({ step, addr }) {

    const { data, status } = useSession()

    const { items } = useSelector(state => state.cart)

    const router = useRouter()

    useEffect(() => {

        if (status === "unauthenticated") {
            signIn()
        } else {
            if (items.length === 0) {
                router.push("/cart")
            }
        }
    }, [data])

    // console.log("STEP: ", step)
    return (
        <div>
            <Head>
                <title>Apna Prasad | CHECKOUT</title>
            </Head>
            <div className={`mx-3 xs:mx-6 sm:mx-10 md:mx-12 lg:mx-14 xl:mx-20 px-1 sm:px-1 my-5 sm:my-10 pt-5 pb-5 sm:pb-10 block ${step !== "3" && "bg-white shadow-md pt-16"}`}>
                <div className="flex w-full justify-center items-center flex-col py-3 sm:p-3">
                    {/* TABS */}
                    <div className="w-full sm:w-1/2 sm:items-self-center px-8 xs:px-10 sm:px-0">
                        {
                            // step === "2"
                            //     ?
                            //     <CheckoutSteps step1 />
                            //     : step === "3"
                            //         ?
                            //         <CheckoutSteps step1 step2 />
                            //         : step === "4"
                            //         && <CheckoutSteps step1 step2 step3 />
                            <CheckoutSteps step={step} />

                        }
                    </div>
                    <div>
                        {
                            step === "2"
                                ? <ShippingAddress />
                                : step === "3" && < Payment addressId={addr} />
                        }
                    </div>
                    {/* CONTENT */}
                </div>

            </div>
        </div >
    )
}

export default Checkout


export async function getServerSideProps(context) {

    const step = context.query.step
    const addressId = context.query.addr
    if (step) {
        if (addressId) {
            return {
                props: {
                    "step": step,
                    "addr": addressId
                }
            }
        }
        return {
            props: {
                "step": step,
            }
        }
    }
    return {
        props: {
            notFound: true
        }
    }
}