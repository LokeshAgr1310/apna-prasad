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

    const totalDiscount = items?.reduce((total, obj) => {
        return total + obj.qty * obj.discount
    }, 0)
    useEffect(() => {

    }, [items])

    return (
        <div>
            <Head>
                <title>CART | Apna Prasad</title>
            </Head>
            {/* <div className="my-5 h-full"> */}
            {
                items.length === 0
                    ? (
                        <div className='grid place-items-center space-y-5 mx-auto h-full my-5'>
                            <img src="/empty_cart.png" className="max-w-[12rem] xs:max-w-[16rem] sm:max-w-sm" alt="" />
                            <button
                                className='bg-blue-500 px-3 py-2 rounded-sm text-white font-bold hover:bg-blue-700'
                                onClick={() => router.push("/")}
                            >SHOP NOW
                            </button>
                        </div>
                    )
                    : (
                        <div className="flex flex-col mx-1.5 xs:mx-3 sm:mx-6 md:mx-10">
                            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-7 mt-6">Your Cart Items ({items?.length})</h2>
                            <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-x-6 lg:divide-x py-3 px-1.5 xs:px-3 sm:p-5">
                                {/* all cart */}
                                <div className="sm:space-y-10 lg:col-span-2 p-1.5 xs:p-2 sm:p-3 bg-white shadow-md">
                                    {/* card */}
                                    {items?.map((item, i) => (
                                        <div key={i} className={`flex pb-6 flex-col sm:flex-row sm:justify-between sm:items-center py-1 sm:p-3 ${i < items.length - 1 && "border-b mb-6 sm:mb-0"} rounded-sm`}>
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
                                                        <a className='cursor-pointer'>
                                                            <h2 className="text-sm xs:text-base leading-none sm:text-lg md:text-xl font-semibold text-gray-700">{item?.name}</h2>
                                                        </a>
                                                    </Link>
                                                    {/* <div className='flex justify-between items-center'>
                                                        <div className="flex items-end mt-2">
                                                            <span className="text-sm sm:text-base md:text-lg">&#8377;</span>
                                                            <h4 className="text-2xl ml-1 text-[#ac0909] font-bold">
                                                                {parseInt(item.price) - parseInt(item.discount)}
                                                            </h4>
                                                        </div>
                                                        <Ratings rating={item.ratings} />
                                                    </div> */}
                                                    {/* <div className="flex flex-col sm:flex-row sm:items-center my-1 sm:my-3">
                                                        <h4>
                                                            <span className="text-xs xs:text-base sm:text-lg">&#8377;</span>
                                                            <span className="text-sm xs:text-lg ml-1 text-[#ac0909] font-bold">
                                                                {parseInt(item.price) - parseInt(item.discount)}
                                                            </span>
                                                        </h4>
                                                        <Ratings rating={item.ratings} />
                                                    </div> */}
                                                    <div className="mt-1 sm:mt-3 flex flex-col sm:flex-row sm:items-end">
                                                        <div className='flex items-center'>
                                                            <span className="text-gray-600 text-xs sm:text-lg md:text-xl mr-2 line-through">
                                                                &#8377; {item.price}
                                                            </span>
                                                            <div className="flex items-end font-bold text-[#ac0909] text-base mr-2 sm:text-xl md:text-2xl">
                                                                <span>&#8377;</span>
                                                                <h4 className=" ml-1">
                                                                    {parseInt(item.price) - parseInt(item.discount)}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-green-800 text-xs sm:text-lg md:text-xl font-semibold">
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
                                {/* checkout  */}
                                <div className="px-1.5 py-3 sm:p-3 bg-white mt-10 lg:mt-0 shadow-md">
                                    <div className="mx-6 my-4">
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
                                                className={`bg-primary text-white px-4 py-2 rounded-sm font-semibold w-full text-xs xs:text-sm sm:text-base`}
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
            <ToastContainer className="text-sm sm:text-base" />
        </div >
        // </div>
    )
}

export default Cart