import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

type ImageWithFallbackProps = {
  /** Fallback image to be used, if left empty the component will not render anything if the image fails to load. */
  fallbacksrc?: string
} & ImageProps

/**
 * A wrapper around Next.js' Image component that allows for a fallback image to be specified.
 * @param fallbacksrc The path to the fallback image, if left empty the component will not render anything if the image fails to load.
 */
export default function ImageWithFallback(props: ImageWithFallbackProps) {

  const [useFallback, setUseFallback] = useState(false)

  // Reset useFallback when src changes, since the image might load successfully now
  useEffect(() => {
    setUseFallback(false)
  }, [props.src])

  return useFallback ?
    // If fallbacksrc is not set, don't render anything
    props.fallbacksrc ? (
      <Image {...props} src={props.fallbacksrc} />
    ) : (
      null
    )
  : (
    <Image {...props} onError={() => setUseFallback(true)}/>
  )
}