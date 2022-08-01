import { useEffect, useState } from "react"
import { collection, getDoc, getDocs, onSnapshot, query, where, doc, orderBy } from 'firebase/firestore'
import { db } from "../../firebase-config"
import Image from "next/image"
import { Spinner } from "flowbite-react"
import Link from "next/link"
import TrackOrderSteps from "../components/TrackOrderSteps"
import { signIn, useSession } from "next-auth/react"
import Head from "next/head"

function MyOrders() {

    const [orderDetails, setOrderDetails] = useState([])
    const [productsDetails, setProductsDetails] = useState({})

    const [loading, setLoading] = useState(false)

    const { status } = useSession()

    const getOrderDetails = async () => {

        setLoading(true)
        const profileId = JSON.parse(localStorage.getItem("profile-id"))
        const q = query(collection(db, "orders"), where("user_profile_id", "==", profileId), orderBy("paidAt", "desc"))

        await getDocs(q).then((orders) => {
            const productsId = []
            orders.docs.map((order) => order.data().products.map((product) => {
                if (!productsId.includes(product.product_id)) {
                    productsId.push(product.product_id)
                }
            }))

            const productObj = {}
            productsId.map(async (id) => {
                await getDoc(doc(db, "products", id)).then((data) => {
                    productObj[[data.id]] = {
                        "category": data.data().category,
                        "name": data.data().name,
                        "image_url": data.data()["image_url"],
                        "price": data.data().price,
                        "ratings": data.data().ratings,
                    }
                })
            })

            setTimeout(() => {
                setProductsDetails(productObj)
                setOrderDetails(orders.docs.map((order) => ({
                    "id": order.id,
                    ...order.data()
                })))

            }, 1000)

            setLoading(false)
        })
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn()
        } else {
            getOrderDetails()
        }
    }, [status])

    console.log("Order:", orderDetails)

    return (
        <div>
            <Head>
                <title>Apna Prasad | MY ORDERS</title>
            </Head>

            <div className="grid grid-cols-5 gap-y-3 gap-x-10 mx-10 my-8">
                {/* Filter */}
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
                                        <label className="orderFilter_labelBox">On THE WAY</label>
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
                {/* Right Section */}
                <div className="col-span-4 flex flex-col space-y-10 px-6">
                    {/* Search bar */}
                    <div>
                        <form>
                            {/* <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Seach</label> */}
                            <div className="relative flex hover:shadow-md">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <i className="fa-solid fa-magnifying-glass w-5 h-5 text-gray-500"></i>
                                </div>
                                <input type="search" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-white rounded-l-md border-transparent focus:ring-base focus:border-base" placeholder="Search your orders here" required />
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-bold rounded-r-md focus:outline-none focus:ring-blue-300 text-sm px-5 py-3">SEARCH</button>
                            </div>
                        </form>
                    </div>
                    {/* Orders */}
                    {
                        orderDetails.length !== 0 && Object.keys(productsDetails).length !== 0 ? (
                            <div className="mt-5">
                                {/* All Order cards */}
                                <div className="flex flex-col space-y-8 px-3">
                                    {/* Order card */}
                                    {orderDetails?.map((order, i) => (
                                        <div className="bg-white w-full hover:shadow-lg shadow-sm-light px-5 pt-7 pb-10 space-y-10 flex relative flex-col" key={i}>
                                            <div className="grid grid-cols-1 mb-6 p-4 items-center justify-center mt-5">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 absolute top-0 right-0">{order.id.toUpperCase()}</span>
                                                {/* Tracking order */}
                                                <div className="px-5 mt-8 text-sm mx-6 w-3/4">
                                                    {
                                                        order.orderStatus === "Placed"
                                                            ? <TrackOrderSteps
                                                                step={1}
                                                                placedOn={new Date(order.paidAt.toDate()).toDateString()}
                                                            />
                                                            : order.orderStatus === "Shipped"
                                                                ? <TrackOrderSteps
                                                                    step={2}
                                                                    shippedOn={new Date(order.shippedOn.toDate()).toDateString()}
                                                                    placedOn={new Date(order.paidAt.toDate()).toDateString()}
                                                                />

                                                                : order.orderStatus === "Out for Delivery"
                                                                    ? <TrackOrderSteps
                                                                        step={3}
                                                                        shippedOn={new Date(order.shippedOn.toDate()).toDateString()}
                                                                        placedOn={new Date(order.paidAt.toDate()).toDateString()}
                                                                    />
                                                                    : order.orderStatus === "Delivered"
                                                                    && <TrackOrderSteps
                                                                        step={4}
                                                                        shippedOn={new Date(order.shippedOn.toDate()).toDateString()}
                                                                        placedOn={new Date(order.paidAt.toDate()).toDateString()}
                                                                        deliveredOn={new Date(order.deliveredOn.toDate()).toDateString()}
                                                                    />
                                                    }
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-5 mx-5">
                                                <div className="col-span-3 border-r pr-3 space-y-5">
                                                    <h2 className="font-bold text-gray-800">ORDER ITEMS ({order.products.length})</h2>
                                                    {
                                                        order.products.map((product, index) => (
                                                            <div key={index} className={`flex w-full justify-between items-center mb-3 ${index !== order.products.length - 1 && "border-b"} p-3`}>
                                                                <div className="space-y-1">
                                                                    <Link href={`/products/${product.product_id}`}>
                                                                        <a>
                                                                            <h3 className="font-medium hover:text-blue-500 text-gray-800 cursor-pointer">{productsDetails[product.product_id].name}</h3>
                                                                        </a>
                                                                    </Link>
                                                                    <h4 className="font-semibold text-gray-700 text-sm">
                                                                        <span className="font-medium">Qty: </span>
                                                                        {product.qty}
                                                                    </h4>
                                                                    <h4 className="text-gray-700 font-medium text-sm">
                                                                        <span>Price: </span>
                                                                        <span>&#8377;</span>
                                                                        <span>
                                                                            {parseInt(productsDetails[product.product_id].price)} * {product.qty} =
                                                                        </span>
                                                                        <span className="font-semibold ml-1 text-[#ac0909]">
                                                                            &#8377; {parseInt(productsDetails[product.product_id].price) * product.qty}
                                                                        </span>
                                                                    </h4>
                                                                </div>
                                                                <Link href={`/products/${product.product_id}`}>
                                                                    <a>
                                                                        <Image
                                                                            src={productsDetails[product.product_id]["image_url"]}
                                                                            height={70}
                                                                            width={70}
                                                                            className="rounded-sm shadow-md cursor-pointer"
                                                                        />
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                {/* Details */}
                                                <div className="col-span-2 ml-5 space-y-5">
                                                    <h2 className="flex items-center">
                                                        <span className="font-bold text-gray-800">ORDER DETAILS</span>
                                                        <span className="bg-green-100 ml-2 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
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
                                                    <div className="flex flex-col space-y-4 text-sm justify-center">
                                                        <h3 className="flex justify-between">
                                                            <span className="font-medium">Subtotal ({order.products.length})</span>
                                                            <span className="font-semibold text-[#ac0909]">&#8377; {order.products.reduce((total, product) => {
                                                                return total + product.qty * parseInt(productsDetails[product.product_id].price)
                                                            }, 0)}</span>
                                                        </h3>
                                                        <h3 className="flex justify-between">
                                                            <span className="font-medium">Ordered </span>
                                                            <span>{new Date(order.paidAt.toDate()).toDateString()} at {new Date(order.paidAt.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</span>
                                                        </h3>
                                                        {
                                                            order.orderStatus === "Placed"
                                                                ? (
                                                                    <div className="space-y-3 flex justify-end">
                                                                        <h2 className="text-sm">Expected Delivery by Wed Aug 4 2022</h2>
                                                                    </div>
                                                                )
                                                                : order.orderStatus === "Shipped"
                                                                    ? (
                                                                        <div className="space-y-4">
                                                                            <h3 className="flex justify-between">
                                                                                <span className="font-medium">Shipped </span>
                                                                                <span>{new Date(order?.shippedOn?.toDate()).toDateString()} at {new Date(order.shippedOn.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</span>
                                                                            </h3>
                                                                            <div className="flex justify-end">
                                                                                <h2 className="text-sm">Expected Delivery by Wed Aug 4 2022</h2>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    : order.orderStatus === "Delivered"
                                                                    && (
                                                                        <div className="space-y-4">
                                                                            <h3 className="flex justify-between">
                                                                                <span className="font-medium">Shipped</span>
                                                                                <span>{new Date(order?.shippedOn?.toDate()).toDateString()} at {new Date(order.shippedOn.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</span>
                                                                            </h3>
                                                                            <h3 className="flex justify-between">
                                                                                <span className="font-medium">Delivered</span>
                                                                                <span>{new Date(order?.deliveredOn?.toDate()).toDateString()} at {new Date(order.deliveredOn.toDate()).toLocaleTimeString([], { hour: "numeric", minute: "numeric" })}</span>
                                                                            </h3>
                                                                        </div>
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
        </div>
    )
}

export default MyOrders