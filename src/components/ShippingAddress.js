import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { addDoc, arrayUnion, collection, doc, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { Accordion } from 'flowbite-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShippingAddress() {

    const toastPropertyProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    const router = useRouter()

    const [isNewAddress, setIsNewAddress] = useState(false)
    const [isEditAddress, setIsEditAddress] = useState(false)

    const [editAddressId, setEditAddressId] = useState("")

    const [addressCheckedId, setAddressCheckedId] = useState("")

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [pinCode, setPinCode] = useState("")
    const [locality, setLocality] = useState("")

    const [area, setArea] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    const [landmark, setLandmark] = useState("")
    const [alternatePhone, setAlternatePhone] = useState("")

    // const router = useRouter()
    const [userAddress, setUserAddress] = useState([])

    const getUserAddress = async () => {
        const profileId = JSON.parse(localStorage.getItem("profile-id"))

        const q = query(collection(db, `profile/${profileId}/shipping-address`))
        // const profileRef = collection(db, "profile/shipping-address")
        onSnapshot(q, (addressDocs) => {
            setUserAddress(addressDocs.docs.map((doc) => ({
                "id": doc.id,
                ...doc.data()
            })))
        })

    }

    useEffect(() => {
        getUserAddress()
    }, [isNewAddress, isEditAddress])


    const newAddressFormHandler = async (e) => {
        e.preventDefault()

        try {
            const profileId = JSON.parse(localStorage.getItem("profile-id"))
            const profileRef = doc(collection(db, `profile/${profileId}/shipping-address`))

            await setDoc(profileRef, {
                "name": name,
                "phone": phone,
                "pincode": pinCode,
                "locality": locality,
                "address": area,
                "city": city,
                "state": state,
                "landmark": landmark,
                "alternate-phone": alternatePhone
            }).then(() => {
                toast.success("New address succefully added!", toastPropertyProps)
                setName("")
                setPhone("")
                setArea("")
                setPinCode("")
                setLocality("")
                setCity("")
                setAlternatePhone("")
                setLandmark("")
                setState("")
                setIsNewAddress(false)
            })

        } catch (err) {
            toast.error("Something went wrong! Please try again later!!", toastPropertyProps)
        }
    }

    const deliveryAddressHandlerForm = (e) => {
        e.preventDefault()

        // localStorage.setItem("shipping-address", JSON.stringify(add))
        router.push(`/checkout?step=3&addr=${addressCheckedId}`)
    }

    const editAddressButton = (address) => {
        setEditAddressId(address.id)
        setIsEditAddress(true)
        setName(address.name)
        setPhone(address.phone)
        setPinCode(address.pincode)
        setLocality(address.locality)
        setCity(address.city)
        setArea(address.address)
        setLandmark(address.landmark)
        setState(address.state)
        setAlternatePhone(address["alternate-phone"])
    }

    const editAddressFormHandler = async (e) => {
        e.preventDefault()

        try {

            const profileId = JSON.parse(localStorage.getItem("profile-id"))

            await updateDoc(doc(db, `profile/${profileId}/shipping-address/${editAddressId}`), {
                "name": name,
                "phone": phone,
                "pincode": pinCode,
                "locality": locality,
                "address": area,
                "city": city,
                "state": state,
                "landmark": landmark,
                "alternate-phone": alternatePhone
            }).then(() => {
                toast.success("Address updated succefully!!", toastPropertyProps)
                setName("")
                setPhone("")
                setArea("")
                setPinCode("")
                setLocality("")
                setCity("")
                setAlternatePhone("")
                setLandmark("")
                setState("")
                setIsEditAddress(false)
                setEditAddressId("")
            })
        } catch (err) {
            toast.error("Something went wrong! Please try again later!!", toastPropertyProps)
        }


    }

    return (
        <div className="mt-8 px-2 sm:px-0 md:px-5">
            <h2 className='text-sm xs:text-base sm:text-lg font-semibold text-gray-800 mb-3'>DELIVERY ADDRESS</h2>
            {
                userAddress?.length === 0
                    ? (
                        <div className="my-5 px-5">
                            <h3>Don&apos;t set any address yet!!</h3>
                        </div>
                    ) : (
                        <div className="my-5 md:px-5">
                            <ul className="grid grid-cols-1 w-full">
                                {
                                    userAddress?.map((address, i) => (
                                        <div key={i}>
                                            <li className={`flex flex-col bg-slate-100 py-4 md:px-2 rounded-sm shadow-sm ${userAddress.length - 1 !== i ? "mb-5" : "mb-3"}`}>
                                                <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between px-2 sm:px-2.5 md:px-3">
                                                    <div>
                                                        <form className="flex items-center xs:pl-2 sm:pl-4 cursor-pointer">
                                                            <input type="radio" checked={address.id === addressCheckedId} onChange={() => setAddressCheckedId(address.id)} value={address.id} name="address" className="sm:w-4 sm:h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />

                                                            <label className="sm:py-4 ml-5 w-full text-sm text-gray-900">

                                                                <div className="flex sm:flex-row flex-col font-semibold sm:items-center">
                                                                    <h3 className='sm:mr-3 mb-1 text-sm sm:text-base md:text-lg whitespace-nowrap'>{address.name}</h3>
                                                                    <span className='text-xs sm:text-sm md:text-base'>{address.phone}</span>
                                                                </div>
                                                                <div className='sm:w-3/4 text-xs sm:text-sm w-full mt-2'>
                                                                    {address.locality}, {address.address},  {address.city}, {address.state} - {address.pincode}
                                                                </div>
                                                            </label>
                                                        </form>
                                                    </div>
                                                    <div className="my-3 sm:my-0 self-end sm:self-center text-sm xs:text-base">
                                                        <button className='text-blue-600 content-center font-semibold' onClick={() => editAddressButton(address)}>EDIT</button>
                                                    </div>
                                                </div>
                                                {
                                                    addressCheckedId === address.id && (
                                                        <div className="ml-5 xs:ml-10 sm:ml-14 md:ml-20">
                                                            <button type='button' onClick={(e) => deliveryAddressHandlerForm(e)} className="px-2.5 xs:px-3 sm:px-10 py-2 text-xs xs:text-sm sm:text-base bg-primary text-white rounded-sm hover:shadow-md font-semibold">DELIVER HERE</button>
                                                        </div>

                                                    )
                                                }
                                            </li>
                                            {
                                                isEditAddress && editAddressId === address.id &&
                                                (
                                                    <div className="my-5">
                                                        <form className='p-1 md:p-3 lg:p-4' onSubmit={editAddressFormHandler}>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 mb-10 sm:grid-rows-5 w-full sm:gap-x-2.5 md:gap-x-10 gap-y-4">
                                                                <div className="relative">
                                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Name</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={phone} maxLength="10" onChange={(e) => setPhone(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Mobile Number</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Pincode</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Locality</label>
                                                                </div>

                                                                <div className="relative sm:col-span-2 sm:row-span-2">
                                                                    <textarea type="text" value={area} onChange={(e) => setArea(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " rows={5} />
                                                                    <label className="shipping_labelBox">Address (Area and Street)</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">City/District/Town</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">State</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Landmark (Optional)</label>
                                                                </div>

                                                                <div className="relative">
                                                                    <input type="text" maxLength="10" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                                                    <label className="shipping_labelBox">Alternate Phone (Optional)</label>
                                                                </div>
                                                            </div>

                                                            <div className='flex justify-center space-x-5 mt-5'>
                                                                <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-3 rounded-sm hover:shadow-md font-semibold'>SAVE</button>
                                                                <button type='button' onClick={() => {
                                                                    setName("")
                                                                    setPhone("")
                                                                    setArea("")
                                                                    setPinCode("")
                                                                    setLocality("")
                                                                    setCity("")
                                                                    setAlternatePhone("")
                                                                    setLandmark("")
                                                                    setState("")
                                                                    setEditAddressId("")
                                                                    setIsEditAddress(false)

                                                                }} className='text-red-600 font-semibold text-sm sm:text-base'>CANCEL</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )

                                            }
                                        </div>

                                    ))
                                }
                            </ul>
                        </div >
                    )
            }
            <div className='px-2 xs:px-3 sm:px-5'>
                {
                    isNewAddress ?
                        <div>
                            <form className='p-1 md:p-3 lg:p-4' onSubmit={newAddressFormHandler}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 mb-10 sm:grid-rows-5 w-full sm:gap-x-2.5 md:gap-x-10 gap-y-4">
                                    <div className="relative">
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Name</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={phone} maxLength="10" onChange={(e) => setPhone(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Mobile Number</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Pincode</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Locality</label>
                                    </div>

                                    <div className="relative sm:col-span-2 sm:row-span-2">
                                        <textarea type="text" value={area} onChange={(e) => setArea(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " rows={5} />
                                        <label className="shipping_labelBox">Address (Area and Street)</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">City/District/Town</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} required aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">State</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Landmark (Optional)</label>
                                    </div>

                                    <div className="relative">
                                        <input type="text" maxLength="10" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} aria-describedby="floating_helper_text" className="shipping_inputBox peer" placeholder=" " />
                                        <label className="shipping_labelBox">Alternate Phone (Optional)</label>
                                    </div>
                                </div>

                                <div className='flex justify-center space-x-5 mt-5'>
                                    <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-3 xs:px-4 sm:px-7 py-1.5 xs:py-2 sm:py-3 rounded-sm hover:shadow-md font-semibold'>SAVE</button>
                                    <button type='button' onClick={() => setIsNewAddress(false)} className='text-red-600 hover:text-red-700 font-semibold text-sm sm:text-base'>CANCEL</button>
                                </div>
                            </form>
                        </div>
                        : (
                            <button onClick={() => setIsNewAddress(true)} disabled={isEditAddress} className="px-2.5 py-1.5 xs:px-3 sm:px-4 xs:py-2 cursor-pointer text-sm sm:text-base font-semibold text-white bg-blue-600">
                                <i className="fa-solid fa-plus mr-2"></i>
                                ADD NEW ADDRESS
                            </button>

                        )
                }

            </div>
            <ToastContainer style={{
                fontSize: "15px"
            }} />
        </div >
    )
}

export default ShippingAddress