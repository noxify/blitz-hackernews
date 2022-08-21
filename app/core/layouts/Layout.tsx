import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import Header from "app/core/components/partials/Header"

const Layout: BlitzLayout<{ title?: string; currentItem?: string; children?: React.ReactNode }> = ({
  title,
  currentItem,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "blitz-hackernews"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full">
        <Header currentItem={currentItem} />
        {children}
      </div>
    </>
  )
}

export default Layout
