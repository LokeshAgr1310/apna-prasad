import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { SessionProvider, useSession } from "next-auth/react"
import Header from '../components/Header'
import LoadingBar from 'react-top-loading-bar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { setCart } from '../slices/cartSlice'
import Image from 'next/image'
import Link from 'next/link'
import { LinkIcon } from '@heroicons/react/outline'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {

  const [progressBar, setProgressBar] = useState(0)
  const router = useRouter()

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgressBar(0)
    })
    router.events.on("routeChangeComplete", () => {
      setProgressBar(100)
    })
    router.events.on("routeChangeError", () => {
      setProgressBar(100)
    })

  }, [router])

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <>
          <header className='sticky top-0 z-30'>
            <LoadingBar
              // color='background: rgb(63, 94, 251)'
              waitingTime={800}
              height={4}
              // style={{
              //   backgroundColor: "background: rgb(63, 94, 251)",
              //   background: "radial-gradient(circle,rgba(63, 94, 251, 1) 0%,rgba(252, 70, 107, 1) 100%)"
              // }}
              progress={progressBar}
              onLoaderFinished={() => setProgressBar(0)}
            />
            {/* <div className='loading-bar'> */}

            {/* </div> */}
            <Header />
          </header>
          <Component {...pageProps} />


          <Footer />

        </>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp