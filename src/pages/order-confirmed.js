import Image from "next/image"
import { useRouter } from 'next/router'
import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { deleteCart } from "../slices/cartSlice"

function OrderConfirmed() {

    const router = useRouter()

    const { items } = useSelector(state => state.cart)

    const dispatch = useDispatch()
    useEffect(() => {
        if (items.length !== 0) {
            dispatch(deleteCart())
        }
    }, [])

    return (
        <div className="flex justify-center my-8">
            <div className="flex flex-col p-4">
                <Image src="/order_confirmation_image.png" height={300} width={600} className="shadow-md rounded-sm" />
                <div className="mx-6 mt-4 flex flex-col items-center">
                    <span className="text-xl flex-wrap">Thanks for purchasing products from <h3 className="text-primary font-bold text-2xl inline">APNA PRASAD! </h3> Click below to track your order!!</span>
                    <button
                        className="bg-primary text-white font-semibold px-5 py-2 mt-3 inline rounded-sm shadow-md"
                        onClick={() => router.replace("/my-orders")}
                    >MY ORDERS</button>
                </div>
            </div>
        </div>
    )
}

export default OrderConfirmed
