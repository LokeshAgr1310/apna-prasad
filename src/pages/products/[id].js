import { onSnapshot, doc, getDoc, getDocs, collection, limit, query, where, FieldPath, documentId } from "firebase/firestore"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import { db } from "../../../firebase-config"
import IndividualProductDetails from "../../components/IndividualProductDetails"
import Ratings from "../../components/Ratings"
import { addToCart } from "../../slices/cartSlice"
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ProductCard from "../../components/ProductCard"
import { useEffect } from "react"

TimeAgo.addLocale(en)

function ProductPage({ product, id, reviews, otherProducts }) {

    const { items } = useSelector(state => state.cart)

    const dispatch = useDispatch()

    const router = useRouter()

    // console.log("other: ", otherProducts);
    // console.log("Date: ", new Date(JSON.parse(reviews)[0].reviewOn).toDateString())

    useEffect(() => {

    }, [reviews, id, product, otherProducts])

    return (
        <div>
            <Head>
                <title>{product.name}</title>
            </Head>
            <div className="max-w-5xl my-10 mx-auto flex flex-col">
                <div className="grid px-5 py-10 grid-cols-3 bg-white shadow-md">
                    {/* Image Container */}
                    <div className="px-5">
                        {/* <div className="p-1 border-base border"> */}
                        <Image src={product?.["image_url"]} className="rounded-sm shadow-md object-cover" height={350} width={350} />
                        {/* TODO:PRODUCT GALLERY */}
                        {/* <div>
                            <h4>Product Gallery</h4>
                            <div>
                                {/* <Image src= />
                            </div>
                        </div> */}
                        <div className="flex items-center my-5">
                            <button className="bg-primary text-white mr-2 hover:shadow-md w-40 px-4 py-3 font-bold font rounded-sm"
                                onClick={() => items.some(obj => obj.id === id) ? router.push('/cart') : dispatch(addToCart({
                                    "id": id,
                                    "qty": 1,
                                    "price": product.price,
                                    "image_url": product["image_url"],
                                    "ratings": product.ratings,
                                    "name": product.name,
                                    "limit": product.stock,
                                    "discount": Math.ceil(parseInt(product.price) * 0.01 * parseInt(product.discount))
                                }))}
                            >{
                                    items.some((obj) => obj.id === id)
                                        ? "GO TO CART"
                                        : "ADD TO CART"
                                }</button>
                            <button className="bg-[#ff9f00] text-white hover:shadow-md px-4 w-40 py-3 font-bold font rounded-sm">BUY NOW</button>
                        </div>
                        {/* </div> */}
                    </div>
                    {/* Product Description */}
                    <div className="col-span-2 px-3 pt-3">
                        <h1 className="text-4xl text-stone-800 mb-4">{product.name}</h1>
                        <div className="flex items-center">
                            <span className="bg-green-700 mr-3 px-1 py-[2px] text-white text-sm flex items-center justify-center w-10 rounded-sm">
                                {product.ratings}
                                <i className="fa-solid fa-star ml-1" style={{ fontSize: "10px" }}></i>
                            </span>
                            <span className="text-gray-600 font-semibold">(21 Reviews & 56 Ratings)</span>
                        </div>
                        <div className="mt-5 flex items-end space-x-4">
                            <div className="flex items-end text-3xl font-bold text-[#ac0909]">
                                <span>&#8377;</span>
                                <h4 className=" ml-1">
                                    {parseInt(product.price) - Math.ceil(parseInt(product.price) * 0.01 * parseInt(product.discount))}
                                </h4>
                            </div>
                            <span className="text-gray-600 line-through">
                                &#8377; {product.price}
                            </span>
                            <span className="text-green-800 font-semibold">
                                {product.discount}% off
                            </span>
                        </div>

                        <div className="mt-8">
                            <div className="mb-4">
                                <h3 className="text-xl text-stone-700 mb-1 font-semibold">DESCRIPTION</h3>
                                <hr className="bg-primary h-1 w-40" />
                            </div>
                            <div className="mt-6">
                                <p className="text-md text-gray-700">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt rem optio, magnam eaque fuga corrupti et qui voluptatem tempore odio voluptatibus, quos suscipit obcaecati, reprehenderit dolorem iste deleniti velit repudiandae consequuntur ea laboriosam accusamus expedita. Suscipit a maiores dolorum nemo illum. Sit fugit cupiditate eligendi tempore repellat vero. Iure, in!
                                </p>
                                <p className="text-md text-gray-700">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus debitis nisi cupiditate deleniti magnam, qui harum amet nobis culpa asperiores quis quidem vel nostrum suscipit facilis optio explicabo maxime labore, esse sunt? Quisquam, suscipit. Porro, tempora deleniti rerum eum odit quas adipisci vitae a consequuntur blanditiis repellat dicta incidunt corrupti itaque eius consectetur corporis fuga? Obcaecati soluta sunt tempora repellat assumenda autem ea consectetur nemo consequuntur dignissimos, veritatis delectus doloremque.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEW SECTION */}
                {
                    JSON.parse(reviews).length !== 0
                    && (

                        <div className="bg-white shadow-md mt-5 px-5 py-10">
                            <div className="w-max">
                                <h2 className="text-2xl pr-2 font-semibold mb-2 text-gray-800">Ratings & Reviews</h2>
                                <hr className="w-full h-1 bg-primary" />
                            </div>

                            {/* All reviews */}
                            <div className="flex flex-col ml-10 mt-10">
                                {JSON.parse(reviews).map((review, i) => (
                                    <div key={i} className="bg-slate-100 p-3 rounded-md shadow-sm">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-3">
                                                <img src={review.user_image} className="h-10 w-10 rounded-full" />
                                                <div className="flex space-x-3 items-center">
                                                    <span className="text-lg font-medium text-gray-800">{review.user_name}</span>
                                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-900">
                                                        {new Date().toDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-700 mt-2 ml-5">
                                                    {review.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
            {/* SUGGESTED */}
            <div className="px-10 mt-20 mb-10">
                <div className="w-max">
                    <h2 className="pr-3 mb-2 tracking-wide text-2xl font-medium">SUGGESTED FOR YOU</h2>
                    <hr className="h-1 bg-primary" />
                </div>
                {/* Products */}
                <div className="w-full flex overflow-x-auto remove_scrollBar">
                    <div className="flex mt-5 px-3 pt-4 pb-2 h-auto">
                        {
                            otherProducts.map((item, i) => (
                                <ProductCard
                                    key={i}
                                    id={item.id}
                                    name={item.name}
                                    desc={item["short-desc"]}
                                    ratings={item.ratings}
                                    price={item.price}
                                    image={item["image_url"]}
                                    stock={item["stock"]}
                                />
                            ))
                        }
                    </div>
                    {/* <div className="bg-gradient-to-r w-10 from-[#e2f9ff] to-[#ecf9ff]" /> */}
                </div>
            </div>
        </div >
    )
}

export default ProductPage


export async function getServerSideProps(context) {

    const data = await getDoc(doc(db, "products", context?.params?.id))

    const reviewData = await getDocs(collection(db, `products/${context?.params?.id}/reviews`))
    const reviews = reviewData.docs.map((review) => ({
        "id": review.id,
        ...review.data()
    }))

    const q = query(collection(db, "products"), where(documentId(), "!=", context?.params?.id), limit(5))
    const otherProductsData = await getDocs(q)



    const otherProducts = otherProductsData.docs.map((product) => ({
        "id": product.id,
        ...product.data()
    }))
    return {
        props: {
            "product": data.data(),
            "id": context?.params?.id,
            "reviews": JSON.stringify(reviews),
            "otherProducts": otherProducts
        }
    }
}