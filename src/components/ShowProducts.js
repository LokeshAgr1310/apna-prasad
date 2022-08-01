import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"

export default function ShowProducts({ products }) {

    useEffect(() => {

    }, [])

    return (
        <div>
            {
                Object.keys(products).map((categ) => (
                    <div className="m-16" key={categ}>
                        <h1 className="text-3xl font-semibold mb-3">{categ}</h1>
                        <hr className="bg-base h-1 w-32" />
                        <div className="mt-12 mx-5 p-2 flex flex-wrap justify-center space-x-8">
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






