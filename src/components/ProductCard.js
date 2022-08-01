import Ratings from "./Ratings"
import Image from "next/image"
import Link from "next/link"
import { addToCart, selectItems } from '../slices/cartSlice'
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"

function ProductCard({ name, desc, image, ratings, price, id, stock }) {

    const { items } = useSelector(state => state.cart)

    const dispatch = useDispatch()
    // console.log("Items: ", items)

    const router = useRouter()

    return (
        <Link href={`/products/${id}`}>
            <a>
                <div className="rounded-md transition ease-linear duration-[400ms] hover:scale-105 flex justify-center items-center flex-col max-w-[21rem] p-4 shadow-lg bg-slate-50 border">
                    <Image
                        src={image}
                        height={250}
                        width={250}
                        className="cursor-pointer"
                    />
                    <div className="mt-5">
                        <h2 className="text-xl mb-3 font-semibold text-center line-clamp-1">{name}</h2>
                        <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi architecto ab eaque, doloribus asperiores, qui sequi soluta quam.</p>
                        <div className="flex justify-between items-center my-2">
                            <div className="flex items-end mt-2">
                                <span className="text-lg">&#8377;</span>
                                <h4 className="text-2xl ml-1 text-[#ac0909] font-bold">
                                    {price}
                                </h4>
                            </div>
                            <Ratings rating={ratings} />
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default ProductCard