import { addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { db } from '../../firebase-config'
import { incrementQty, decrementQty, removeFromCart, deleteCart } from '../slices/cartSlice'
import Link from 'next/link'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRazorpay from 'react-razorpay'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Spinner } from 'flowbite-react'

function Payment({ addressId }) {

    const Razorpay = useRazorpay()

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const { items } = useSelector(state => state.cart)

    const { data: userData } = useSession()

    const [deliverTo, setDeliverTo] = useState({})
    const [placingOrderLoading, setPlacingLoading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)

    const dispatch = useDispatch()

    const router = useRouter()

    const getAddressDetail = async () => {

        try {
            const profileId = JSON.parse(localStorage.getItem("profile-id"))

            const addressRef = doc(db, `profile/${profileId}/shipping-address`, addressId)

            onSnapshot(addressRef, (doc) => {
                setDeliverTo(doc.data())
            })
        } catch (err) {
            console.log("Error: ", err)
        }
    }

    // console.log("Deliver to: ", deliverTo)

    const totalPrice = items?.reduce((total, obj) => {
        return total + obj.qty * parseInt(obj.price)
    }, 0)

    useEffect(() => {

        if (addressId) {
            getAddressDetail()
        }

    }, [addressId])

    const handlePayment = async () => {
        setPlacingLoading(true)
        const order = await axios.post("/api/payments/create-order", { "amount": totalPrice - 99 })

        setPlacingLoading(false)
        // console.log("order: ", order)

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: (totalPrice - 99) * 100,
            currency: "INR",
            name: "APNA PRASAD",
            description: "Placing order!",
            image: "/logo.png",
            order_id: order.data.id,
            handler: async function (response) {
                setPaymentLoading(true)
                // console.log("Response: ", response)
                const data = await axios.post("/api/payments/payment-status", {
                    "razorpay_payment_id": response.razorpay_payment_id,
                    "razorpay_order_id": response.razorpay_order_id,
                    "razorpay_signature": response.razorpay_signature
                })

                if (data.data.success) {
                    const products = items.map((item) => ({
                        "product_id": item.id,
                        "qty": item.qty,
                    }))
                    await setDoc(doc(db, "orders", order.data.id), {
                        "user_profile_id": JSON.parse(localStorage.getItem("profile-id")),
                        "products": products,
                        "deliverTo": addressId,
                        "paidAt": new Date(),
                        "receipt_id": order.data.receipt,
                        "payment_id": response.razorpay_payment_id,
                        "payment_signature": response.razorpay_signature,
                        "orderStatus": "Placed"
                    })

                    const profileId = JSON.parse(localStorage.getItem("profile-id"))
                    await updateDoc(doc(db, "profile", profileId), {
                        "orders": arrayUnion(order.data.id)
                    }).then(() => {
                        setPaymentLoading(false)
                        router.replace(`/order-confirmed?order_id=${order.data.id}`)
                    })


                }

            },
            prefill: {
                name: deliverTo.name,
                email: userData.user.email,
                contact: deliverTo.phone,
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#fb8304",
            },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
            toast.error(response.error.reason, toastPropertyProps)
        });

        rzp1.open();
    };

    return (
        <div className='grid grid-cols-3 px-5 my-8 divide-x-2'>
            <div className="flex flex-col p-6 col-span-2 mr-1">
                {/* Deliver to */}
                <div className="bg-slate-100 px-4 py-2 border shadow-sm rounded-md">
                    <h2 className='text-gray-900 font-semibold'>DELIVER TO: </h2>
                    <div className='ml-3'>
                        <div className="flex text-gray-800 mb-1 font-semibold items-center">
                            <h3 className='mr-3 text-md'>{deliverTo.name}</h3>
                            <span className='text-md'>{deliverTo.phone}</span>
                        </div>
                        <div className='w-3/4 text-sm'>
                            {deliverTo.locality}, {deliverTo.address},  {deliverTo.city}, {deliverTo.state} - {deliverTo.pincode}
                        </div>
                    </div>
                </div>
                {/* cart */}
                <div className=''>
                    <div className="space-y-10 p-3 mt-5">
                        {/* card */}
                        {items?.map((item, i) => (
                            <div key={i} className={`flex justify-between items-center p-3 ${i < items.length - 1 && "border-b-2"} rounded-sm`}>
                                <div className='flex space-x-5'>
                                    <div>
                                        <Link href={`/products/${item?.id}`}>
                                            <a>
                                                <Image src={item?.["image_url"]} className="rounded-md cursor-pointer" height={100} width={100} />
                                            </a>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link href={`/products/${item?.id}`}>
                                            <a className='cursor-pointer'>
                                                <h2 className="text-lg font-semibold text-gray-700">{item?.name}</h2>
                                            </a>
                                        </Link>
                                        <div className='flex space-x-5 items-center'>
                                            <div className="flex items-end mt-2">
                                                <span className="text-md">&#8377;</span>
                                                <h4 className="text-lg ml-1 text-[#ac0909] font-bold">
                                                    {item.price}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center flex-col space-y-5">
                                    <div className='flex space-x-4 items-center'>
                                        <button
                                            className="border px-2 py-1 font-semibold text-md text-gray-700"
                                            disabled={item.qty === 1}
                                            onClick={() => dispatch(decrementQty(item.id))}
                                        >
                                            -
                                        </button>
                                        <span className='text-md font-semibold'>{item.qty}</span>
                                        <button
                                            onClick={() => item.qty !== item.limit ? dispatch(incrementQty(item.id))
                                                : toast.error(`You can buy only up to ${item.qty} unit(s) of this product`, toastPropertyProps)

                                            }
                                            className="border px-2 py-1 font-semibold text-md text-gray-700">
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        <button className="text-gray-800 hover:text-red-700 px-2 py-1 rounded-md font-semibold"
                                            onClick={() => {
                                                dispatch(removeFromCart(item.id))
                                            }}
                                        >REMOVE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* price details */}
            <div className='p-6 shadow-md h-min'>
                <h2 className='text-xl text-gray-600 pb-3 border-b font-semibold'>PRICE DETAILS</h2>
                <div className='grid grid-cols-2 text-md grid-rows-3 mt-3 items-center p-2 mb-3'>
                    <span className=' text-gray-800 justify-items-end mb-2'>
                        Price ({items?.length} Items)
                    </span>
                    <span className='text-end text-gray-800'>
                        <span className="mr-1">&#8377;</span>
                        {
                            totalPrice
                        }
                    </span>
                    <span className='text-gray-800 justify-items-end mb-2'>
                        Discount
                    </span>
                    <span className='text-end text-green-800'>
                        <span className="mr-1">-&#8377;</span>
                        <span className="">99</span>
                    </span>
                    <span className='text-gray-800 justify-items-end'>
                        Delivery
                    </span>
                    <span className='text-end text-gray-800'>
                        FREE
                    </span>
                </div>
                <hr />
                <div className="grid grid-cols-2 my-2 items-center p-2">
                    <span className='font-semibold'>Amount</span>
                    <span className='text-end text-black font-semibold'>
                        <span className=" mr-1">&#8377;</span>
                        {
                            totalPrice - 99
                        }
                    </span>
                </div>
                <hr />
                <div className='flex justify-center my-4'>
                    <button
                        disabled={placingOrderLoading || paymentLoading}
                        onClick={() => handlePayment()}
                        className="block disabled:opacity-75 disabled:cursor-not-allowed bg-base w-full text-white py-3 font-semibold"
                    >
                        {
                            placingOrderLoading ?
                                <>
                                    <Spinner aria-label="Spinner button example" />
                                    <span className="pl-3">
                                        PROCESSING...
                                    </span>
                                </>
                                : paymentLoading ?
                                    <>
                                        <Spinner aria-label="Spinner button example" />
                                        <span className="pl-3">
                                            PLACING ORDER...
                                        </span>
                                    </>
                                    : "PLACE ORDER"
                        }
                    </button>
                </div>
            </div>
            <ToastContainer style={{ fontSize: "15px" }} />
        </div>
    )
}

export default Payment