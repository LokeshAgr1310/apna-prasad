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
                <div className="rounded-md min-w-[12.5rem] xs:min-w-[15rem] sm:min-w-[18rem] md:max-w-[22rem] transition mr-3 xs:mr-4 sm:mr-6 ease-linear duration-[400ms] hover:scale-105 flex flex-col p-2.5 sm:p-4 shadow-lg bg-slate-50 border">
                    {
                        image !== "" && (
                            <div className="w-full flex justify-center">
                                <Image
                                    src={image}
                                    height={200}
                                    width={350}
                                // className=""
                                // className=""
                                />
                            </div>
                        )
                    }
                    <div className="mt-3 w-full">
                        <h2 className="text-xs xs:text-sm sm:text-base md:text-lg mb-3 font-medium line-clamp-1">{name}</h2>
                        <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 line-clamp-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi architecto ab eaque, doloribus asperiores, qui sequi soluta quam.
                        </p>
                        <div className="flex justify-between items-center my-3">
                            {/* <div className="flex items-end mt-2"> */}
                            <h4>
                                <span className="text-xs xs:text-sm sm:text-lg">&#8377;</span>
                                <span className="text-sm sm:text-lg ml-1 text-[#ac0909] font-bold">
                                    {price}
                                </span>
                            </h4>
                            {/* </div> */}
                            <Ratings rating={ratings} />
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default ProductCard