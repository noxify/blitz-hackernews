import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import logo from "public/logo.png"
import { Routes, BlitzPage } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import RecordList from "app/core/components/list/RecordList"
import { ChevronLeftIcon } from "@heroicons/react/outline"
import { format, sub } from "date-fns"
import { getLocaleProps, useI18n } from "locales"

export const getServerSideProps = getLocaleProps()

const Past: BlitzPage = ({ date }: { date?: string }) => {
  const { t } = useI18n()

  const pastBaseDate = date ? new Date(date) : new Date()

  return (
    <Layout title={t("pages.past.title")} currentItem="past">
      <PageHeader title={t("pages.past.title")}>
        <Link href={`/past/${format(sub(pastBaseDate, { days: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.day")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { weeks: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.week")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { months: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.month")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { years: 1 }), "yyyy-MM-dd")}`}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.year")}
          </a>
        </Link>
      </PageHeader>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RecordList />
      </div>
    </Layout>
  )
}

export default Past
