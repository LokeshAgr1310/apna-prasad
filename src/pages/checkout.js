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
                <title>Checkout - Apna Prasad</title>
            </Head>
            <div className="max-w-5xl mx-auto px-5 my-10 py-10 block bg-white shadow-md">
                <div className="flex w-full justify-center flex-col p-3">
                    {/* TABS */}
                    <div className="justify-items-center content-center self-center">
                        {
                            step === "2"
                                ?
                                <CheckoutSteps step1 />
                                : step === "3"
                                    ?
                                    <CheckoutSteps step1 step2 />
                                    : step === "4"
                                    && <CheckoutSteps step1 step2 step3 />

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
        </div>
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