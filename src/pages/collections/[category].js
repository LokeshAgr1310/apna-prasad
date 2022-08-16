// customer ratings, god, location, price
// https://amzn.eu/d/aBzsGa1
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, onSnapshot, setDoc, where, query } from "firebase/firestore"
import { db } from "../../../firebase-config"
import Head from 'next/head'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import ShowProducts from '../../components/ShowProducts'
import ProductCard from '../../components/ProductCard'
import { useRouter } from 'next/router'
import ProductCollectionCard from '../../components/ProductCollectionCard'

function ProductCollections({ category, filters }) {

    // console.log("Category: ", category)
    // console.log("Filters: ", )

    const [productsDetails, setProductsDetails] = useState([])

    const [showFilters, setShowFilters] = useState(false)
    const [isFilterClicked, setIsFilterClicked] = useState(false)
    const [currWidth, setCurrWidth] = useState("")

    const router = useRouter()

    const getProductDetails = async () => {

        const q = query(collection(db, "products"), where("category", "==", category))
        onSnapshot(q, (products) => {
            setProductsDetails(products.docs.map((product) => ({
                "id": product.id,
                ...product.data()
            })))
        })
    }

    const getProductDetailsWithFilters = async (filter, value) => {
        const q = query(collection(db, "products"), where("category", "==", category), where(filter, "==", value))
        onSnapshot(q, (products) => {
            setProductsDetails(products.docs.map((product) => ({
                "id": product.id,
                ...product.data()
            })))
        })
    }

    console.log("Query: ", router.query)
    useEffect(() => {
        if (router.query.filter) {
            getProductDetailsWithFilters(router.query.filter, router.query.by)
        }
        else {
            getProductDetails()
        }

    }, [category, router.query])

    useEffect(() => {
        // console.log("Width:", window.innerWidth)
        if (typeof window !== "undefined") {
            setCurrWidth(window.innerWidth)
            if (window.innerWidth < "1176") {
                setShowFilters(true)
            }
            window.addEventListener("resize", () => {
                setCurrWidth(window.innerWidth)
                if (window.innerWidth < "1176") {
                    setShowFilters(true)
                } else {
                    setShowFilters(false)
                }
            })
        }
    }, [])

    useEffect(() => {

    }, [showFilters])

    // const createSliderWithTooltip = Slider.createSliderWithTooltip;
    // const Range = createSliderWithTooltip(Slider.Range);
    console.log("product:", productsDetails)
    return (
        <>
            <Head>
                <title>APNA PRASAD | COLLECTION</title>
            </Head>
            <div className="flex flex-col w-full my-10">
                {/* Breadcumb */}
                <div className='ml-3 xs:ml-5 sm:ml-10 flex space-x-5'>
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/">
                                    <a className="inline-flex items-center text-xs xs:text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900">
                                        <i className="fa-solid fa-house-chimney mr-2 text-gray-400"></i>
                                        Home
                                    </a>
                                </Link>
                            </li>
                            {/* <li>
                                <div className="flex items-center">
                                    <i className="fa-solid fa-angle-right text-gray-400"></i>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 capitalize">{category}</span>
                                </div>
                            </li> */}
                            <li>
                                <div className="flex items-center">
                                    <i className="fa-solid fa-angle-right text-gray-400"></i>
                                    <span className="ml-1 text-xs xs:text-sm sm:text-base font-medium text-gray-500 md:ml-2 capitalize">{category}</span>
                                </div>
                            </li>
                            {/* <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Flowbite</span>
                            </div>
                        </li> */}
                        </ol>
                    </nav>

                    {
                        showFilters && (
                            <div>
                                <button
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-xs xs:text-sm px-1.5 xs:px-3 sm:px-5 py-2.5"
                                    type="button"
                                    onClick={() => setIsFilterClicked(true)}
                                >
                                    FILTERS
                                </button>
                                {
                                    isFilterClicked && (
                                        <div className={`fixed right-0 top-[69px] h-full remove_scrollBar overflow-y-auto left-0 flex z-20 shadow-lg w-max pr-10 bg-slate-200 ${isFilterClicked ? "block" : "hidden"}`}>
                                            <div className="pt-5 pl-4 shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <div className='flex space-x-2'>
                                                        <h2 className="font-semibold text-xl">FILTERS</h2>
                                                        {
                                                            (router.query.filter || router.query.ratings) &&
                                                            <button
                                                                className='text-xs px-2 py-0.5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md'
                                                                onClick={() => router.replace(`/collections/${category.toLowerCase().split(" ").join("-")}`)}
                                                            >
                                                                RESET
                                                            </button>
                                                        }
                                                    </div>
                                                    <i
                                                        className="fa-solid fa-xmark text-xl cursor-pointer"
                                                        onClick={() => setIsFilterClicked(false)}
                                                    ></i>
                                                </div>
                                                <div className="my-5 pb-20">
                                                    {
                                                        filters.filters.map((filter, i) => (
                                                            <div key={i} className={`${i !== filters.filters.length - 1 && "border-b"} pb-4`}>
                                                                <div className='w-max pr-2 border-b-4 border-b-primary'>
                                                                    <h3 className='font-semibold text-base text-gray-800 mb-2'>{filter.toUpperCase()}</h3>
                                                                </div>
                                                                <ul className='space-y-1 mt-4 ml-2'>
                                                                    {
                                                                        filters[filter].map((filterValue, index) => (
                                                                            <li key={index} className="text-md line-clamp-1 text-base font-medium text-gray-700 hover:text-orange-700 active:text-orange-700">
                                                                                <Link scroll={false} href={`/collections/${category.toLowerCase().split(" ").join("-")}?filter=${filter}&by=${encodeURIComponent(filterValue)}`}>
                                                                                    <a>
                                                                                        {filterValue}
                                                                                    </a>
                                                                                </Link>
                                                                            </li>

                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>

                {/* Main Content */}
                <div className='flex xl:grid xl:grid-cols-5 mt-8'>

                    {/* Filter block */}
                    {
                        !showFilters && (

                            <div className='xl:col-span-1 pl-3 xl:px-3 pt-3 w-max h-max pb-7 bg-white shadow-md'>
                                <div className='flex flex-wrap items-center space-x-3 mb-2 border-b pb-2'>
                                    <h2 className='font-medium text-base xl:text-lg tracking-wide xl:tracking-wider xl:ml-2'>
                                        <i className="fa-solid stroke-gray-800 fa-filter mr-2"></i>
                                        FILTERS
                                    </h2>
                                    {
                                        (router.query.filter || router.query.ratings) &&
                                        <button
                                            className='text-xs px-2 py-0.5 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md'
                                            onClick={() => router.replace(`/collections/${category.toLowerCase().split(" ").join("-")}`)}
                                        >
                                            RESET
                                        </button>
                                    }
                                </div>
                                <div className='flex flex-col space-y-5 mt-5 pl-2 xl:pl-3 pr-1.5 xl:pr-3'>
                                    {/* God */}
                                    {
                                        filters.filters.map((filter, i) => (
                                            <div key={i} className={`${i !== filters.filters.length - 1 && "border-b"} pb-4`}>
                                                <div className='w-max pr-1 xl:pr-2 border-b-4 border-b-primary'>
                                                    <h3 className='font-semibold text-sm xl:text-base text-gray-800 mb-1 xl:mb-2'>{filter.toUpperCase()}</h3>
                                                </div>
                                                <ul className='space-y-1 mt-4 ml-1 xl:ml-2'>
                                                    {
                                                        filters[filter].map((filterValue, index) => (
                                                            <li key={index} className="text-md line-clamp-1 text-sm xl:text-base font-medium text-gray-700 hover:text-orange-700 active:text-orange-700">
                                                                <Link scroll={false} href={`/collections/${category.toLowerCase().split(" ").join("-")}?filter=${filter}&by=${encodeURIComponent(filterValue)}`}>
                                                                    <a>
                                                                        {filterValue}
                                                                    </a>
                                                                </Link>
                                                            </li>

                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        ))
                                    }
                                    {/* Price */}
                                    {/* <div className='space-y-8'>
                                <div className='w-max pr-2 border-b-4 border-b-base'>
                                    <h3 className='font-bold text-lg text-gray-800 mb-2'>PRICE</h3>
                                </div>
                                <Slider
                                    min={parseInt(filters["price-min"])}
                                    max={parseInt(filters["price-max"])}
                                    step={100}
                                />
                                // {/* < /> *
                            </div> */}
                                    {/* Ratings */}
                                    {/* <div className='space-y-5'>
                                <div className='w-max pr-2 border-b-4 border-b-base'>
                                    <h3 className='font-semibold text-md text-gray-800 mb-2'>RATINGS</h3>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        type="radio"
                                        onClick={() => router.query.filter ?
                                            router.push(`/collections/${category.toLowerCase().split(" ").join("-")}?filter=${router.query.filter}&by=${encodeURIComponent(router.query.by)}&ratings=4`)
                                            : router.push(`/collections/${category.toLowerCase().split(" ").join("-")}?ratings=4`)
                                        }
                                        checked={router.query.ratings && router.query.ratings === "4"}
                                        value=""
                                        name="ratings"
                                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                    <label className="ml-2 text-sm font-medium text-gray-900">
                                        4 <i className="fa-solid fa-star"></i> & above
                                    </label>
                                </div>

                                <div className="flex items-center mb-4">
                                    <input
                                        type="radio"
                                        value=""
                                        name="ratings"
                                        checked={router.query.ratings && router.query.ratings === "3"}
                                        onClick={() => router.query.filter ?
                                            router.push(`/collections/${category.toLowerCase().split(" ").join("-")}?filter=${router.query.filter}&by=${encodeURIComponent(router.query.by)}&ratings=3`)
                                            : router.push(`/collections/${category.toLowerCase().split(" ").join("-")}?ratings=3`)
                                        }
                                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2" />
                                    <label className="ml-2 text-sm font-medium text-gray-900">
                                        3 <i className="fa-solid fa-star"></i> & above
                                    </label>
                                </div>
                            </div> */}
                                </div>
                            </div>
                        )
                    }

                    {/* Product display */}
                    <div className='xl:col-span-4 ml-5 xl:ml-0'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10">
                            {productsDetails?.map((item, index) => (
                                <ProductCollectionCard
                                    isCollection={true}
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    desc={item["short-desc"]}
                                    ratings={item.ratings}
                                    price={item.price}
                                    image={item["image_url"]}
                                    stock={item["stock"]}
                                    currWidth={currWidth}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCollections

export async function getServerSideProps(context) {


    const category = context.params.category
    const categoryId = category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

    const data = await getDoc(doc(db, "categories", categoryId))

    return {
        props: {
            "category": categoryId,
            "filters": data.data()
        }
    }
}