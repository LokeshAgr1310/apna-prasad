{/* <i class="fa-solid fa-star"></i> */ }
{/* <i class="fa-solid fa-star-half"></i> */ }
function Ratings({ rating }) {

    return (
        <div className="d-flex space-x-2">
            <span className="text-[#ffbf48]">
                {
                    rating >= 1
                        ? <i className="fa-solid fa-star"></i>
                        : rating >= 0.5
                            ? <i className="fa-solid fa-star-half-stroke"></i>
                            : <i className="fa-regular fa-star"></i>
                }
            </span>
            <span className="text-[#ffbf48]">
                {
                    rating >= 2
                        ? <i className="fa-solid fa-star"></i>
                        : rating >= 1.5
                            ? <i className="fa-solid fa-star-half-stroke"></i>
                            : <i className="fa-regular fa-star"></i>
                }
            </span>
            <span className="text-[#ffbf48]">
                {
                    rating >= 3
                        ? <i className="fa-solid fa-star"></i>
                        : rating >= 2.5
                            ? <i className="fa-solid fa-star-half-stroke"></i>
                            : <i className="fa-regular fa-star"></i>
                }
            </span>
            <span className="text-[#ffbf48]">
                {
                    rating >= 4
                        ? <i className="fa-solid fa-star"></i>
                        : rating >= 3.5
                            ? <i className="fa-solid fa-star-half-stroke"></i>
                            : <i className="fa-regular fa-star"></i>
                }
            </span>
            <span className="text-[#ffbf48]">
                {
                    rating >= 5
                        ? <i className="fa-solid fa-star"></i>
                        : rating >= 4.5
                            ? <i className="fa-solid fa-star-half-stroke"></i>
                            : <i className="fa-regular fa-star"></i>
                }
            </span>
        </div>
    )
}

export default Ratings