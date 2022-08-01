import { onSnapshot, doc, getDoc } from "firebase/firestore"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import { db } from "../../../firebase-config"
import IndividualProductDetails from "../../components/IndividualProductDetails"
import Ratings from "../../components/Ratings"
import { addToCart } from "../../slices/cartSlice"

function ProductPage({ product, id }) {

    const { items } = useSelector(state => state.cart)

    const dispatch = useDispatch()

    const router = useRouter()

    return (
        <div>
            <Head>
                <title>{product.name}</title>
            </Head>
            <div className="max-w-5xl shadow-md px-5 my-10 mx-auto py-10 block bg-white">
                <div className="grid grid-cols-3">
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
                            <button className="bg-base text-white mr-2 hover:shadow-md w-40 px-4 py-3 font-bold font rounded-sm"
                                onClick={() => items.some(obj => obj.id === id) ? router.push('/cart') : dispatch(addToCart({
                                    "id": id,
                                    "qty": 1,
                                    "price": product.price,
                                    "image_url": product["image_url"],
                                    "ratings": product.ratings,
                                    "name": product.name,
                                    "limit": product.stock
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
                                    {product.price}
                                </h4>
                            </div>
                            <span className="text-gray-600 line-through">
                                &#8377; 1499
                            </span>
                            <span className="text-green-800 font-semibold">
                                60% off
                            </span>
                        </div>

                        <div className="mt-8">
                            <div className="mb-4">
                                <h3 className="text-xl text-stone-700 mb-1 font-semibold">DESCRIPTION</h3>
                                <hr className="bg-base h-1 w-40" />
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


                {/* SUGGESTED */}
            </div>
        </div>
    )
}

export default ProductPage


export async function getServerSideProps(context) {

    const data = await getDoc(doc(db, "products", context?.params?.id))
    return {
        props: {
            "product": data.data(),
            "id": context?.params?.id
        }
    }
}