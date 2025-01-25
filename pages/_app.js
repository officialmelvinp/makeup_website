import "../styles/globals.css"
import { useEffect } from "react"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      // You can add analytics or other route change logic here
      console.log(`App is changing to ${url}`)
    }

    router.events.on("routeChangeStart", handleRouteChange)

    // If the component is unmounted, unsubscribe from the event
    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

export default MyApp

