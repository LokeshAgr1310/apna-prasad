import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function ShowProducts({ products }) {

    const router = useRouter()

    useEffect(() => {

    }, [])

    return (
        <div className="">
            {
                Object.keys(products).map((categ) => (
                    <div className="mx-4 my-10 xs:mx-5 sm:m-10 md:m-16" key={categ}>
                        <div className="flex justify-between items-center">
                            <div className="w-max xs:pr-0.5 sm:pr-2 sm:border-b-4 border-b-2 border-b-primary">
                                <h1 className="text-base xs:text-lg sm:text-xl md:text-3xl font-semibold sm:mb-3 mb-1">{categ}</h1>
                            </div>
                            <button
                                onClick={() => router.push(`/collections/${categ.toLowerCase().split(" ").join("-")}`)}
                                className="text-xs xs:text-sm text-gray-800 xs:hover:text-black sm:hover:text-white flex items-center sm:hover:shadow-md font-medium  sm:bg-sky-600 sm:hover:bg-sky-700 sm:text-white sm:px-4 py-2 rounded-md"
                            >
                                VIEW ALL
                                {/* <i className="fa-solid fa-angles-right ml-1 sm:ml-2"></i> */}
                            </button>
                        </div>
                        <div className="mt-8 pb-4 flex overflow-x-auto remove_scrollBar xl:justify-center">
                            {products[categ]?.map((item, index) => (
                                <ProductCard
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    desc={item["short-desc"]}
                                    ratings={item.ratings}
                                    price={item.price}
                                    image={item["image_url"]}
                                    stock={item["stock"]}
                                />
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}






