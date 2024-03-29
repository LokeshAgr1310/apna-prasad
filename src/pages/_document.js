import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head />
            <link rel="icon" href="/logo.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            {/* <link href="https://fonts.googleapis.com/css2?family=Dongle&family=Poppins:wght@200&family=Ubuntu:wght@300&display=swap" rel="stylesheet"></link> */}
            {/* <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC:wght@300&display=swap" rel="stylesheet"></link> */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
            />
            {/* <link rel="stylesheet" href="https://unpkg.com/flowbite@1.5.2/dist/flowbite.min.css" /> */}
            <body>
                <Main />
                <script src='../../node_modules/tw-elements/dist/js/index.min.js'></script>
                <NextScript />
                {/* <script src="../../node_modules/flowbite/dist/flowbite.js"></script> */}
            </body>
        </Html>
    )
}