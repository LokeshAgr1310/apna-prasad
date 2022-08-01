import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loading'
import Ratings from '../components/Ratings'
import { incrementQty, decrementQty, removeFromCart } from '../slices/cartSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'

function Cart() {

    const { items } = useSelector(state => state.cart)

    const { data } = useSession()

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }
    // console.log("items: ", items)

    const router = useRouter()

    const dispatch = useDispatch()

    const totalPrice = items?.reduce((total, obj) => {
        return total + obj.qty * parseInt(obj.price)
    }, 0)
    useEffect(() => {

    }, [items])

    return (
        <div>
            <Head>
                <title>Cart - Apna Prasad</title>
            </Head>
            <div className="container w-auto mx-10 my-5 h-full">
                {
                    items.length === 0
                        ? (
                            <div className='grid place-items-center space-y-5'>
                                <img src="/empty_cart.png" alt="" />
                                <button
                                    className='bg-blue-500 px-3 py-2 rounded-sm text-white font-bold hover:bg-blue-700'
                                    onClick={() => router.push("/")}
                                >SHOP NOW
                                </button>
                            </div>
                        )
                        : (
                            <div>
                                <h2 className="text-3xl font-semibold text-gray-700 mb-7 mt-6">Your Cart Items ({items?.length})</h2>
                                <div className="grid grid-cols-3 gap-x-6 border bg-white shadow-md divide-x p-5">
                                    {/* all cart */}
                                    <div className="space-y-10 col-span-2 p-3">
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
                                                                <h2 className="text-xl transition ease-in-out hover:scale-105 font-semibold text-gray-700">{item?.name}</h2>
                                                            </a>
                                                        </Link>
                                                        <div className='flex space-x-5 items-center'>
                                                            <div className="flex items-end mt-2">
                                                                <span className="text-lg">&#8377;</span>
                                                                <h4 className="text-2xl ml-1 text-[#ac0909] font-bold">
                                                                    {item.price}
                                                                </h4>
                                                            </div>
                                                            <Ratings rating={item.ratings} />
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
                                                                toast.success("Item removed from cart!!", toastPropertyProps)
                                                            }}
                                                        >REMOVE</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* checkout  */}
                                    <div className="p-3">
                                        <div className="mx-6 my-4">
                                            <h2 className='text-2xl text-gray-600 pb-3 border-b font-semibold'>PRICE DETAILS</h2>
                                            <div className='grid grid-cols-2 grid-rows-3 mt-3 items-center p-2 mb-3'>
                                                <span className='text-lg text-gray-800 justify-items-end mb-2'>
                                                    Price ({items?.length} Items)
                                                </span>
                                                <span className='text-xl text-end text-gray-800'>
                                                    <span className="text-lg mr-1">&#8377;</span>
                                                    {
                                                        totalPrice
                                                    }
                                                </span>
                                                <span className='text-lg text-gray-800 justify-items-end mb-2'>
                                                    Discount
                                                </span>
                                                <span className='text-xl text-end text-green-800'>
                                                    <span className="text-lg mr-1">-&#8377;</span>
                                                    <span className="">99</span>
                                                </span>
                                                <span className='text-lg text-gray-800 justify-items-end'>
                                                    Delivery
                                                </span>
                                                <span className='text-xl text-end text-gray-800'>
                                                    FREE
                                                </span>
                                            </div>
                                            <hr />
                                            <div className="grid grid-cols-2 my-2 items-center p-2">
                                                <span className='text-lg font-semibold'>Total Amount</span>
                                                <span className='text-xl text-end text-black font-semibold'>
                                                    <span className="text-lg mr-1">&#8377;</span>
                                                    {
                                                        totalPrice - 99
                                                    }
                                                </span>
                                            </div>
                                            <hr />
                                            <div className="p-3 mt-3">
                                                <button
                                                    className={`bg-base text-white px-4 py-2 rounded-sm font-semibold w-full`}
                                                    // disabled={!data}
                                                    onClick={() => data ? router.push("/checkout?step=2") : signIn()}
                                                >
                                                    {
                                                        data ? "PROCEED" : "LOGIN TO PROCEED"
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                }
                <ToastContainer style={{
                    fontSize: "15px"
                }} />
            </div >
        </div>
    )
}

export default Cart