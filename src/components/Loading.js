import React from 'react'

function Loader({ display, applyClass, size }) {
    return (
        <div
            style={{
                // height: `${height ? height : ''}`,
                // width: `${width ? width : '200px'}`,
                margin: 'auto',
                display: `${display ? display : "block"}`,
                color: 'black',
                placeItems: 'center center'
            }}
            className={applyClass}
        >
            <i className={`fa-solid fa-spinner animate-spin text-${size} text-blue-700`}></i>
        </div>
    )
}

export default Loader