import Head from 'next/head'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import ShowProducts from '../components/ShowProducts';

import { getDocs, collection, query, where, getDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase-config'

export default function Home({ products }) {

  return (
    <div>
      <Head>
        <title>Apna Prasad</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <section className="flex items-center justify-center flex-col">
        <Carousel showStatus={false} infiniteLoop showThumbs={false}>
          <div>
            <Image src="/carousel-4.jpg" className="rounded-b-md" width={1050} height={480} />
            {/* <p className="">Legend 1</p> */}

          </div>
          <div>
            <Image src="/carousel-2.jpg" width={1050} height={480} />
            {/* <p className="legend">Legend 2</p> */}
          </div>
          <div>
            <Image src="/carousel-3.jpg" width={1050} height={480} />
            {/* <p className="legend">Legend 3</p> */}
          </div>
        </Carousel>
        {/* <div className="bg-blue-200 w-[1050px]"></div> */}
      </section>

      <section>
        <ShowProducts products={products} />
      </section>
    </div>
  )
}

export async function getStaticProps() {

  try {

    let q = query(collection(db, "products"), where("category", "==", "prasad"))

    const prasadData = await getDocs(q)
    const prasadProducts = prasadData.docs.map((item) => ({
      "id": item.id,
      ...item.data()
    }))

    q = query(collection(db, "products"), where("category", "==", "poshaak"))
    const poshaakData = await getDocs(q)
    const poshaakProducts = poshaakData.docs.map((item) => ({
      "id": item.id,
      ...item.data()
    }))

    return {
      props: {
        "products": {
          "Prasad": prasadProducts,
          "Poshaak": poshaakProducts
        },
      }
    }
  } catch (err) {
    return {
      notFound: true
    }
  }

}