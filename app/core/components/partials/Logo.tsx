// source:
// https://github.com/blitz-js/blitzjs.com/blob/main/app/core/components/Logo.js

import { FC, PropsWithoutRef, SVGProps } from "react"

const Logo = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => {
  return (
    <div className="flex space-x-0 items-center">
      <svg viewBox="0 0 40 66" {...props}>
        <path d="M0.241243 33.2639H10.9742C15.0585 33.2639 18.9054 35.1835 21.3612 38.4471L31.9483 52.5165C32.1484 52.7824 32.1786 53.1393 32.026 53.435L25.9232 65.2592C25.6304 65.8265 24.8455 65.8932 24.4612 65.3835L0.241243 33.2639Z" />
        <path d="M42.4727 33.2822H31.7398C27.6555 33.2822 23.8086 31.3626 21.3528 28.0991L10.7656 14.0297C10.5656 13.7638 10.5354 13.4068 10.688 13.1111L16.7908 1.28696C17.0836 0.719654 17.8684 0.652924 18.2528 1.16266L42.4727 33.2822Z" />
      </svg>
      <span className="pl-4 text-2xl text-white">HackerNews</span>
    </div>
  )
}

export default Logo
