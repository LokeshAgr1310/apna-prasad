import React, { useEffect, useState } from "react"
import { collection, getDoc, getDocs, onSnapshot, query, where, doc, orderBy, setDoc } from 'firebase/firestore'
import { db } from "../../firebase-config"
import Image from "next/image"
import { Spinner, Modal, Tooltip } from "flowbite-react"
import Link from "next/link"
import TrackOrderSteps from "../components/TrackOrderSteps"
import { signIn, useSession } from "next-auth/react"
// import 'tw-elements'
import Head from "next/head"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyOrders() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const [showFilters, setShowFilters] = useState(false)
    const [currWidth, setCurrWidth] = useState("")

    const [isFilterClicked, setIsFilterClicked] = useState(false)

    const [orderDetails, setOrderDetails] = useState([])
    // const [productsDetails, setProductsDetails] = useState({})

    // const [loading, setLoading] = useState(false)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [ratingProductId, setRatingProductId] = useState("")

    const [showPriceDetailsModal, setShowPriceDetailsModal] = useState(false)
    const [priceDetailsOrderId, setPriceDetailsOrderId] = useState("")

    const [productRating, setProductRating] = useState("")
    const [ratingDesc, setRatingDesc] = useState("")

    const { status } = useSession()

    const { data: userData } = useSession()

    const getOrderDetails = async () => {

        // setLoading(true)
        const profileId = JSON.parse(localStorage.getItem("profile-id"))
        const q = query(collection(db, "orders"), where("user_profile_id", "==", profileId), orderBy("paidAt", "desc"))

        onSnapshot(q, (orders) => {
            setOrderDetails(orders.docs.map((order) => ({
                "id": order.id,
                ...order.data()
            })))
        })

        // setLoading(false)
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn()
        } else {
            getOrderDetails()
        }
    }, [status])

    // console.log("Order:", orderDetails)

    const reviewFormHandler = async (e) => {
        e.preventDefault()

        try {
            // const profileId = localStorage.getItem("")
            const reviewProductRef = doc(db, `products/${ratingProductId}/reviews`, userData.user.email)
            await setDoc(reviewProductRef, {
                "user_profile_id": localStorage.getItem("profile-id"),
                "ratings": productRating,
                "desc": ratingDesc,
                "reviewOn": new Date(),
                "user_name": userData.user.name,
                "user_image": userData.user.image,
            }).then(() => {
                setRatingProductId("")
                setShowRatingModal(false)
                setRatingDesc("")
                setProductRating("")
                toast.success("Thanks for the rating!", toastPropertyProps)
            })
        } catch (err) {
            console.log("error", err)
            setRatingProductId("")
            setShowRatingModal(false)
            setRatingDesc("")
            setProductRating("")
            toast.error("Can't review product. Please try again later", toastPropertyProps)
        }

    }

    useEffect(() => {
        // console.log("Width:", window.innerWidth)
        if (typeof window !== "undefined") {
            setCurrWidth(window.innerWidth)
            if (window.innerWidth < "976") {
                setShowFilters(true)
            }
            window.addEventListener("resize", () => {
                setCurrWidth(window.innerWidth)
                if (window.innerWidth < "976") {
                    setShowFilters(true)
                } else {
                    setShowFilters(false)
                }
            })
        }
    }, [])

    useEffect(() => {

    }, [showFilters])

    return (
        <div>
            <Head>
                <title>Apna Prasad | MY ORDERS</title>
            </Head>

            <div className="lg:grid lg:grid-cols-5 lg:gap-y-3 flex flex-col mx-1.5 xs:mx-3 sm:mx-5 lg:mx-8 my-8">
                {/* Filter */}
                <div className="lg:col-span-1 lg:px-0 sm:px-4">
                    {
                        showFilters
                            ? (
                                <>
                                    <div className="flex items-center relative">
                                        <button
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-xs xs:text-sm px-1.5 xs:px-3 mr-1 xs:mr-2.5 sm:px-5 py-2.5 sm:mr-4"
                                            type="button"
                                            onClick={() => setIsFilterClicked(true)}
                                        >
                                            FILTERS
                                        </button>
                                        <div className="w-full">
                                            <form>
                                                {/* <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Seach</label> */}
                                                <div className="relative flex hover:shadow-md">
                                                    <div className="flex absolute inset-y-0 left-0 items-center pl-2 sm:pl-3 pointer-events-none">
                                                        <i className="fa-solid fa-magnifying-glass text-xs xs:text-base text-gray-500"></i>
                                                    </div>
                                                    <input type="search" className="block p-2.5 lg:p-4 pl-7 xs:pl-8 sm:pl-10 w-full text-xs xs:text-sm text-gray-900 bg-white sm:rounded-l-md border-transparent focus:ring-primary focus:border-primary" placeholder="Search your orders" required />
                                                    {
                                                        currWidth > "576"
                                                        &&
                                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium lg:font-bold rounded-r-md focus:outline-none focus:ring-blue-300 text-sm sm:px-5 py-3">SEARCH</button>
                                                    }
                                                </div>
                                            </form>
                                        </div>
                                        {
                                            isFilterClicked && (

                                                <div className={`fixed right-0 top-[69px] h-full remove_scrollBar overflow-y-auto left-0 flex z-20 shadow-lg w-max pr-10 bg-slate-200 ${isFilterClicked ? "block" : "hidden"}`}>
                                                    <div className="pt-5 pl-4 shadow-sm">
                                                        <div className="flex justify-between items-center">
                                                            <h2 className="font-semibold text-xl">FILTERS</h2>
                                                            <i
                                                                className="fa-solid fa-xmark text-xl cursor-pointer"
                                                                onClick={() => setIsFilterClicked(false)}
                                                            ></i>
                                                        </div>
                                                        <div className="my-5">
                                                            <div className="mb-6 pb-4 border-b">
                                                                <h3 className="mb-4 font-semibold text-gray-900">ORDER TIME</h3>
                                                                <ul className="text-sm font-medium text-gray-900 rounded-lg">
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">15 Days</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">1 Month</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">1 year</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">Older</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h3 className="mb-4 font-semibold text-gray-900">ORDER STATUS</h3>
                                                                <ul className="text-sm font-medium text-gray-900 rounded-lg pb-20">
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">ON THE WAY</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">DELIVERED</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">CANCELLED</label>
                                                                        </div>
                                                                    </li>
                                                                    <li className="w-full rounded-t-lg">
                                                                        <div className="flex items-center pl-3">
                                                                            <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                                            <label className="orderFilter_labelBox">RETURNED</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        }
                                    </div>
                                </>
                            )
                            : (
                                <div className="bg-white pt-5 pl-4 shadow-sm h-min">
                                    <h2 className="font-semibold text-xl">FILTERS</h2>
                                    <div className="my-5">
                                        <div className="mb-6 pb-4 border-b">
                                            <h3 className="mb-4 font-semibold text-gray-900">ORDER TIME</h3>
                                            <ul className="text-sm font-medium text-gray-900 bg-white rounded-lg">
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">15 Days</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">1 Month</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">1 year</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">Older</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-4 font-semibold text-gray-900">ORDER STATUS</h3>
                                            <ul className="text-sm font-medium text-gray-900 bg-white rounded-lg">
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">ON THE WAY</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">DELIVERED</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">CANCELLED</label>
                                                    </div>
                                                </li>
                                                <li className="w-full rounded-t-lg">
                                                    <div className="flex items-center pl-3">
                                                        <input type="checkbox" value="" className="orderFilter_checkBox" />
                                                        <label className="orderFilter_labelBox">RETURNED</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                    }

                </div>
                {/* Right Section */}
                <div className="lg:col-span-4 flex flex-col space-y-10 sm:ml-5 px-1.5 sm:px-3">
                    {/* Search bar */}
                    {
                        !showFilters && (
                            <div>
                                <form>
                                    {/* <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Seach</label> */}
                                    <div className="relative flex hover:shadow-md">
                                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                            <i className="fa-solid fa-magnifying-glass w-5 h-5 text-gray-500"></i>
                                        </div>
                                        <input type="search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-white rounded-l-md border-transparent focus:ring-primary focus:border-primary" placeholder="Search your orders here" required />
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-bold rounded-r-md focus:outline-none focus:ring-blue-300 text-sm px-5 py-3">SEARCH</button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {/* Orders */}
                    {
                        orderDetails.length !== 0 ? (
                            <div className="mt-5">
                                {/* All Order cards */}
                                <div className="flex flex-col space-y-8">
                                    {/* Order card */}
                                    {orderDetails?.map((order, i) => (
                                        <div className="bg-white w-full hover:shadow-lg shadow-sm-light px-2 sm:px-5 pt-7 pb-10 space-y-6 flex relative flex-col" key={i}>
                                            <div className="grid grid-cols-1 mb-3 sm:mb-6 px-1 py-4 sm:py-4 sm:px-0 md:p-4 justify-center mt-5">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-0.5 absolute top-0 right-0">{order.id.toUpperCase()}</span>
                                                {/* Tracking order */}
                                                <div className="sm:px-5 mt-8 text-sm ml-4 xs:mx-6 w-4/5 sm:w-3/4">
                                                    {
                                                        order?.orderStatus === "Placed" && order.paidAt
                                                            ? <TrackOrderSteps
                                                                step={1}
                                                                placedOn={new Date(order?.paidAt?.toDate()).toDateString()}
                                                            />
                                                            : order.orderStatus === "Shipped" && order.shippedOn
                                                                ? <TrackOrderSteps
                                                                    step={2}
                                                                    shippedOn={new Date(order?.shippedOn?.toDate()).toDateString()}
                                                                    placedOn={new Date(order?.paidAt?.toDate()).toDateString()}
                                                                />

                                                                : order.orderStatus === "Out for Delivery"
                                                                    ? <TrackOrderSteps
                                                                        step={3}
                                                                        shippedOn={new Date(order?.shippedOn?.toDate()).toDateString()}
                                                                        placedOn={new Date(order?.paidAt?.toDate()).toDateString()}
                                                                    />
                                                                    : order.orderStatus === "Delivered" && order.deliveredOn
                                                                    && <TrackOrderSteps
                                                                        step={4}
                                                                        shippedOn={new Date(order?.shippedOn?.toDate()).toDateString()}
                                                                        placedOn={new Date(order?.paidAt?.toDate()).toDateString()}
                                                                        deliveredOn={new Date(order?.deliveredOn?.toDate()).toDateString()}
                                                                    />
                                                    }
                                                </div>
                                            </div>
                                            <div className="xl:grid xl:grid-cols-5 flex flex-col mx-1.5 sm:mx-5">
                                                <div className="col-span-3 xl:border-r border-b pb-7 xl:pb-0 lg:pr-3 space-y-3 xs:space-y-5 mb-5 sm:mb-8 xl:mb-0">
                                                    <h2 className="text-sm xs:text-base font-semibold sm:font-bold text-gray-800">ORDER ITEMS ({order.products.length})</h2>
                                                    {
                                                        order.products.map((product, index) => (
                                                            <div key={index} className={`flex flex-col w-full mb-3 ${index !== order.products.length - 1 && "border-b"} py-3 px-1.5 sm:p-3`}>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="space-y-1">
                                                                        <Link href={`/products/${product.product_id}`}>
                                                                            <a>
                                                                                <h3 className="font-medium hover:text-blue-500 line-clamp-1 text-sm sm:text-base text-gray-800 cursor-pointer">{product.name}</h3>
                                                                            </a>
                                                                        </Link>
                                                                        <h4 className="font-semibold text-gray-700 text-xs xs:text-[13px] sm:text-sm">
                                                                            <span className="font-medium">Qty: </span>
                                                                            {product.qty}
                                                                        </h4>
                                                                        <h4 className="text-gray-700 font-medium text-[11px] xs:text-[13px] sm:text-sm">
                                                                            <span>Price: </span>
                                                                            {/* <span>{product.price}</span> */}
                                                                            <span>
                                                                                {product.price} * {product.qty} =
                                                                            </span>
                                                                            <span className="font-semibold ml-1 text-[#ac0909]">
                                                                                &#8377; {parseInt(product.price) * product.qty}
                                                                            </span>
                                                                        </h4>
                                                                    </div>
                                                                    <Link href={`/products/${product.product_id}`}>
                                                                        <a className="">
                                                                            <Image
                                                                                src={product["image_url"]}
                                                                                height={70}
                                                                                width={70}
                                                                                className="rounded-sm shadow-md cursor-pointer"
                                                                            />
                                                                        </a>
                                                                    </Link>
                                                                </div>
                                                                {
                                                                    order.orderStatus === "Delivered" && !product["isReview"] && (
                                                                        <div className="flex justify-end mt-6">
                                                                            <React.Fragment>
                                                                                <button onClick={() => {
                                                                                    setRatingProductId(product.product_id)
                                                                                    setShowRatingModal(true)
                                                                                }} className="font-semibold text-xs sm:text-sm text-blue-700 hover:text-blue-800">
                                                                                    <i className="fa-solid fa-ranking-star mr-2"></i>
                                                                                    Rate & Review Product
                                                                                </button>
                                                                                <Modal
                                                                                    show={showRatingModal && product.product_id === ratingProductId}
                                                                                    size={currWidth > "576" ? "lg" : "sm"}
                                                                                    popup={true}
                                                                                    onClose={() => {
                                                                                        setRatingProductId("")
                                                                                        setShowRatingModal(false)
                                                                                    }}
                                                                                >
                                                                                    <Modal.Header />
                                                                                    <Modal.Body>
                                                                                        <div className="space-y-6 flex flex-col md:px-3 pb-4">
                                                                                            <div>
                                                                                                <div className="mb-4">
                                                                                                    <h2 className="text-base md:text-lg mb-2 font-medium md:tracking-wide">RATE THIS PRODUCT</h2>
                                                                                                    <hr />
                                                                                                </div>
                                                                                                <form onSubmit={reviewFormHandler}>
                                                                                                    <div className="flex flex-col space-y-5">
                                                                                                        <select
                                                                                                            value={productRating}
                                                                                                            onChange={(e) => setProductRating(e.target.value)}
                                                                                                            className="bg-gray-50 border-none text-gray-900 text-xs xs:text-sm rounde-lg focus:border-none focus:ring-0 block w-full p-2.5">
                                                                                                            {/* <option value=""></option> */}
                                                                                                            <option value="5">5 - Excellent</option>
                                                                                                            <option value="4">4 - Very Good</option>
                                                                                                            <option value="3">3 - Good</option>
                                                                                                            <option value="2">2 - Bad</option>
                                                                                                            <option value="1">1 - Very Bad</option>
                                                                                                        </select>
                                                                                                        <div className="relative">
                                                                                                            <textarea type="text" value={ratingDesc} onChange={(e) => setRatingDesc(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " rows={currWidth > "576" ? "5" : "3"} />
                                                                                                            <label className="shipping_labelBox">Description</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex justify-center mt-4">
                                                                                                        <button type="submit" className="text-white bg-primary text-md font-semibold px-3 xs:px-5 py-2 rounded-sm shadow-md">SUBMIT</button>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Modal.Body>
                                                                                </Modal>
                                                                            </React.Fragment>
                                                                        </div>

                                                                    )
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                {/* Details */}
                                                <div className="col-span-2 xl:ml-5 space-y-5">
                                                    <h2 className="flex items-center">
                                                        <span className="text-sm xs:text-base font-semibold sm:font-bold text-gray-800">ORDER DETAILS</span>
                                                        <span className="bg-green-100 ml-2 text-green-800 text-[10px] xs:text-xs font-semibold xs:mr-2 px-1.5 xs:px-2.5 py-0.5 rounded">
                                                            {
                                                                order.orderStatus === "Placed"
                                                                    ? "PLACED"
                                                                    : order.orderStatus === "Shipped"
                                                                        ? "SHIPPED"
                                                                        : order.orderStatus === "Delivered"
                                                                        && "DELIVERED"
                                                            }
                                                        </span>
                                                    </h2>
                                                    <div className="flex flex-col space-y-4 text-xs sm:text-sm justify-center">
                                                        <h3 className="flex justify-between">
                                                            <span className="font-medium flex items-center">
                                                                Subtotal ({order.products.length})
                                                                <React.Fragment>
                                                                    <Tooltip
                                                                        content="Order summary"
                                                                        placement="bottom"
                                                                        arrow={false}
                                                                        animation="duration-300"
                                                                    >
                                                                        <button onClick={() => {
                                                                            setPriceDetailsOrderId(order.id)
                                                                            setShowPriceDetailsModal(true)
                                                                        }} className="bg-slate-100 text-xs text-gray-700 px-2 py-1 ml-2 rounded-md">
                                                                            <i className="fa-solid fa-info"></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                    <Modal
                                                                        show={showPriceDetailsModal && order.id === priceDetailsOrderId}
                                                                        size={currWidth > "576" ? "lg" : "sm"}
                                                                        popup={true}
                                                                        onClose={() => {
                                                                            setPriceDetailsOrderId("")
                                                                            setShowPriceDetailsModal(false)
                                                                        }}
                                                                    >
                                                                        <Modal.Header />
                                                                        <Modal.Body>
                                                                            <div className="space-y-6 flex flex-col md:px-3 pb-4">
                                                                                <div>
                                                                                    <div className="mb-4">
                                                                                        <h2 className="text-base md:text-lg mb-2 font-medium tracking-wide">ORDER SUMMARY</h2>
                                                                                        <hr />
                                                                                    </div>
                                                                                    <div className='grid grid-cols-2 grid-rows-3 mt-3 items-center md:p-2 mb-3'>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-gray-800 justify-items-end mb-2'>
                                                                                            Price ({order?.products?.length} Items)
                                                                                        </span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-end text-gray-800'>
                                                                                            <span className="text-sm sm:text-base md:text-lg mr-1">&#8377;</span>
                                                                                            {
                                                                                                order.charges.billAmount
                                                                                            }
                                                                                        </span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-gray-800 justify-items-end mb-2'>
                                                                                            Discount
                                                                                        </span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-end text-green-800'>
                                                                                            <span className="text-sm sm:text-base md:text-lg mr-1">-&#8377;</span>
                                                                                            <span className="">{order.charges.discount}</span>
                                                                                        </span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-gray-800 justify-items-end'>
                                                                                            Delivery
                                                                                        </span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-end text-gray-800'>
                                                                                            {order.charges.shipping === 0 ? "FREE" : order.charges.shipping}
                                                                                        </span>
                                                                                    </div>
                                                                                    <hr />
                                                                                    <div className="grid grid-cols-2 my-2 items-center md:p-2">
                                                                                        <span className='text-sm sm:text-base md:text-lg font-semibold'>Total Amount</span>
                                                                                        <span className='text-sm sm:text-base md:text-lg text-end text-[#ac0909] font-semibold'>
                                                                                            <span className="text-sm sm:text-base md:text-lg mr-1">&#8377;</span>
                                                                                            {
                                                                                                order.charges.totalAmount
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                </React.Fragment>
                                                            </span>
                                                            <span className="font-semibold text-[#ac0909]">&#8377;
                                                                {order.charges.totalAmount}
                                                            </span>
                                                        </h3>
                                                        <h3 className="flex justify-between">
                                                            <span className="font-medium">Ordered </span>
                                                            <span>{new Date(order.paidAt.toDate()).toDateString()}
                                                                {
                                                                    currWidth > "320" &&
                                                                    ` at ${new Date(order.paidAt.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`
                                                                }</span>
                                                        </h3>
                                                        {
                                                            order.orderStatus === "Placed"
                                                                ? (
                                                                    <div className="space-y-3 flex justify-end">
                                                                        <h2 className="text-xs sm:text-sm">Expected Delivery by {new Date().toDateString()}</h2>
                                                                    </div>
                                                                )
                                                                : order.orderStatus === "Shipped"
                                                                    ? (
                                                                        <div className="space-y-4">
                                                                            <h3 className="flex justify-between">
                                                                                <span className="font-medium">Shipped </span>
                                                                                <span>{new Date(order?.shippedOn?.toDate()).toDateString()}
                                                                                    {
                                                                                        currWidth > "320" &&
                                                                                        ` at ${new Date(order?.shippedOn?.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`
                                                                                    }

                                                                                </span>
                                                                            </h3>
                                                                            <div className="flex justify-end">
                                                                                <h2 className="text-xs sm:text-sm">Expected Delivery by {new Date().toDateString()}</h2>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    : order.orderStatus === "Delivered"
                                                                    && (
                                                                        <>
                                                                            <div className="space-y-4">
                                                                                <h3 className="flex justify-between">
                                                                                    <span className="font-medium">Shipped</span>
                                                                                    <span>{new Date(order?.shippedOn?.toDate()).toDateString()}
                                                                                        {
                                                                                            currWidth > "320" &&
                                                                                            ` at ${new Date(order?.shippedOn?.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`
                                                                                        }

                                                                                    </span>
                                                                                </h3>
                                                                                <h3 className="flex justify-between">
                                                                                    <span className="font-medium">Delivered</span>
                                                                                    <span>{new Date(order?.deliveredOn?.toDate()).toDateString()}
                                                                                        {
                                                                                            currWidth > "320" &&
                                                                                            `at ${new Date(order?.deliveredOn?.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}`
                                                                                        }

                                                                                    </span>
                                                                                </h3>
                                                                            </div>
                                                                        </>
                                                                    )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                            : (
                                <div className="grid place-items-center my-10">
                                    <Spinner size="xl" />
                                </div>
                            )
                    }
                </div>
            </div >
            <ToastContainer style={{ fontSize: "15px" }} />
        </div >
    )
}

export default MyOrders