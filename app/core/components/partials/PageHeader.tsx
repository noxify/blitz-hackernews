import Link from "next/link"
import React from "react"

const PageHeader = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) => {
  return (
    <header className="bg-white shadow md:h-24">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap items-baseline">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight sm:truncate">
              {title}
            </h2>
            {subtitle && <p className="ml-2 mt-1 text-sm text-gray-500 truncate">{subtitle}</p>}
          </div>
          {children && <div className="mt-4 flex md:mt-0 md:ml-4">{children}</div>}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
