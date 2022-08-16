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
// TODO: add shipping charges

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

    const totalDiscount = items?.reduce((total, obj) => {
        return total + obj.qty * obj.discount
    }, 0)

    useEffect(() => {

        if (addressId) {
            getAddressDetail()
        }

    }, [addressId])

    const handlePayment = async () => {
        setPlacingLoading(true)
        const order = await axios.post("/api/payments/create-order", { "amount": totalPrice - totalDiscount })

        setPlacingLoading(false)
        // console.log("order: ", order)

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: (totalPrice - totalDiscount) * 100,
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
                        "discount": item.discount,
                        "name": item.name,
                        "image_url": item["image_url"],
                        "price": item.price,
                        "ratings": item.ratings,
                        "isReview": false
                    }))

                    const paidAt = new Date()
                    await setDoc(doc(db, "orders", order.data.id), {
                        "user_profile_id": JSON.parse(localStorage.getItem("profile-id")),
                        "products": products,
                        "deliverTo": addressId,
                        "paidAt": paidAt,
                        "receipt_id": order.data.receipt,
                        "payment_id": response.razorpay_payment_id,
                        "payment_signature": response.razorpay_signature,
                        "orderStatus": "Placed",
                        "deliveredOn": null,
                        "shippedOn": null,
                        "charges": {
                            "billAmount": parseInt(totalPrice),
                            "discount": parseInt(totalDiscount),
                            "shipping": 0,
                            "totalAmount": parseInt(totalPrice - totalDiscount)
                        }
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
        <div className='flex flex-col lg:grid lg:grid-cols-3 px-1.5 xs:px-2.5 sm:px-3.5 md:px-5 lg:px-3 xl:px-5 my-8 lg:divide-x-2'>
            <div className="flex flex-col py-4 px-2 xs:py-4 xs:px-3 sm:px-1.5 md:p-6 lg:col-span-2 mr-1 bg-white">
                {/* Deliver to */}
                <div className="bg-slate-100 px-1 xs:px-2 sm:px-3 py-3 xs:mx-0 border shadow-sm rounded-md">
                    {/* <h2 className='text-gray-900 font-medium text-sm xs:text-base sm:text-lg'>
                        <i className="fa-solid fa-location-dot mr-1 xs:mr-2 text-xs xs:text-sm sm:text-base text-red-700"></i>SHIPPED TO
                    </h2> */}
                    <div>
                        <div className="flex sm:flex-row flex-col text-gray-800 mb-1 font-medium sm:items-center">
                            <div className="flex items-center">
                                <i className="fa-solid fa-location-dot text-xs xs:text-sm sm:text-base text-red-700"></i>
                                <h3 className='sm:mr-3 text-sm sm:text-base ml-1 xs:ml-2 md:text-lg'>{deliverTo.name}</h3>
                            </div>
                            <span className='text-[13px] sm:text-sm md:text-base ml-2 xs:ml-3'>{deliverTo.phone}</span>
                        </div>
                        <div className='sm:w-3/4 w-full text-[10px] xs:text-sm ml-2 xs:ml-3'>
                            {deliverTo.locality}, {deliverTo.address},  {deliverTo.city}, {deliverTo.state} - {deliverTo.pincode}
                        </div>
                    </div>
                </div>
                {/* cart */}
                <div className='py-5'>
                    <div className="sm:space-y-10 lg:col-span-2 p-1.5 xs:p-2 sm:py-3 sm:px-0 md:p-3 lg:px-0 xl:px-3 bg-white">
                        {/* card */}
                        {items?.map((item, i) => (
                            <div key={i} className={`flex pb-6 flex-col sm:flex-row sm:justify-between mx-1 sm:items-center py-1 sm:p-3 ${i < items.length - 1 && "border-b mb-6 sm:mb-0"} rounded-sm`}>
                                <div className='grid grid-cols-5 xs:flex space-x-1.5 xs:space-x-2.5 sm:space-x-5'>
                                    <div className="col-span-2">
                                        <Link href={`/products/${item?.id}`}>
                                            <a>
                                                <Image src={item?.["image_url"]} className="rounded-md cursor-pointer" height={100} width={100} />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className='col-span-3'>
                                        <Link href={`/products/${item?.id}`}>
                                            <a className='cursor-pointer line-clamp-1'>
                                                <h2 className="text-sm xs:text-base leading-none sm:text-lg md:text-xl font-semibold text-gray-700">{item?.name}</h2>
                                            </a>
                                        </Link>
                                        <div className="mt-1 sm:mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-2 md:space-x-4">
                                            <div className='flex items-center space-x-2 md:space-x-4'>
                                                <span className="text-gray-600 text-xs sm:text-base md:text-lg lg:text-xl line-through">
                                                    &#8377; {item.price}
                                                </span>
                                                <div className="flex items-end font-bold text-[#ac0909] text-base sm:text-lg md:text-xl lg:text-2xl">
                                                    <span>&#8377;</span>
                                                    <h4>
                                                        {parseInt(item.price) - parseInt(item.discount)}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-green-800 text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                                                    {(parseInt(item.discount) / parseInt(item.price) * 100).toFixed(0)}% off
                                                </span>
                                            </div>
                                            {/* <Ratings rating={item.ratings} /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center px-3 xs:px-4 sm:px-0 justify-between flex-row sm:flex-col sm:space-y-5 mt-3 sm:mt-0">
                                    <div className='flex space-x-4 items-center'>
                                        <button
                                            className="border px-2 py-1 font-semibold text-sm xs:text-base text-gray-700"
                                            disabled={item.qty === 1}
                                            onClick={() => dispatch(decrementQty(item.id))}
                                        >
                                            -
                                        </button>
                                        <span className='text-sm xs:text-base font-semibold'>{item.qty}</span>
                                        <button
                                            onClick={() => item.qty !== item.limit ? dispatch(incrementQty(item.id))
                                                : toast.error(`You can buy only up to ${item.qty} unit(s) of this product`, toastPropertyProps)

                                            }
                                            className="border px-2 py-1 font-semibold text-sm xs:text-base text-gray-700">
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        <button className="text-gray-800 hover:text-red-700 text-sm xs:text-base px-2 py-1 rounded-md font-semibold"
                                            onClick={() => {
                                                dispatch(removeFromCart(item.id))
                                                toast.success("Item removed from cart!!", toastPropertyProps)
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
            <div className="px-1.5 py-3 sm:p-3 bg-white mt-5 lg:mt-0 shadow-md h-min lg:ml-4">
                <div className="mx-2 lg:mx-4 xl:mx-6 my-4">
                    <h2 className='text-lg xs:text-xl sm:text-2xl text-gray-600 pb-3 border-b font-semibold'>PRICE DETAILS</h2>
                    <div className='grid grid-cols-3 grid-rows-3 mt-3 items-center text-sm xs:text-base sm:text-lg md:text-xl sm:p-2 mb-3 font-medium'>
                        <span className='text-gray-800 justify-items-end mb-2 col-span-2'>
                            Price ({items?.length} Items)
                        </span>
                        <span className='text-end text-gray-800'>
                            <span className="mr-1">&#8377;</span>
                            {
                                totalPrice
                            }
                        </span>
                        <span className='text-gray-800 justify-items-end mb-2 col-span-2'>
                            Discount
                        </span>
                        <span className='text-end text-green-800'>
                            <span className="mr-1">-&#8377;</span>
                            <span className="">{totalDiscount}</span>
                        </span>
                        <span className='text-gray-800 justify-items-end col-span-2'>
                            Delivery
                        </span>
                        <span className='text-end text-gray-800'>
                            FREE
                        </span>
                    </div>
                    <hr />
                    <div className="grid grid-cols-3 text-gray-800 my-2 font-semibold items-center p-1 sm:p-2 text-sm xs:text-base sm:text-lg md:text-xl">
                        <span className='col-span-2'>SUBTOTAL</span>
                        <span className='text-end'>
                            <span className="mr-1">&#8377;</span>
                            {
                                totalPrice - totalDiscount
                            }
                        </span>
                    </div>
                    <hr />
                    <div className="p-3 mt-3">
                        <button
                            disabled={placingOrderLoading || paymentLoading}
                            onClick={() => handlePayment()}
                            className="block disabled:opacity-75 disabled:cursor-not-allowed bg-primary w-full text-white py-3 font-semibold"
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
            </div>
            {/* <div className='p-6 shadow-md h-min'>
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
                        <span className="">{totalDiscount}</span>
                    </span>
                    <span className='text-gray-800 justify-items-end'>
                        Delivery
                    </span>
                    <span className='text-end text-gray-800'>
                        FREE
                    </span>
                </div>
                <hr />
                <div className="grid grid-cols-2 mt-2 mb-1 items-center pt-2">
                    <span className='font-semibold'>Amount</span>
                    <span className='text-end text-black font-semibold'>
                        <span className=" mr-1">&#8377;</span>
                        {
                            totalPrice - totalDiscount
                        }
                    </span>
                </div>
                <div className='flex justify-end text-xs mb-4'>
                    (
                    <span><strong className='text-red-600 mr-1'>*</strong>Includes of all taxes</span>
                    )
                </div>
                <hr />
                <div className='flex justify-center my-4'>
                    <button
                        disabled={placingOrderLoading || paymentLoading}
                        onClick={() => handlePayment()}
                        className="block disabled:opacity-75 disabled:cursor-not-allowed bg-primary w-full text-white py-3 font-semibold"
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
            </div> */}
            <ToastContainer style={{ fontSize: "15px" }} />
        </div>
    )
}

export default Payment