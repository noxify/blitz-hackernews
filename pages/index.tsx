import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import logo from "public/logo.png"
import { Routes, BlitzPage } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import RecordList from "app/core/components/list/RecordList"
import { getLocaleProps, useI18n } from "locales"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getEntries from "app/entries/queries/getEntries"
import { useRouter } from "next/router"
import { format, startOfDay } from "date-fns"
import Pagination from "app/core/components/list/Pagination"

export const getServerSideProps = getLocaleProps()

const ITEMS_PER_PAGE = 10

const Home: BlitzPage = () => {
  const { t } = useI18n()

  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ entries, count, hasMore }] = usePaginatedQuery(getEntries, {
    orderBy: { id: "desc" },
    where: {
      createdAt: { gte: startOfDay(new Date()) },
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Layout title={t("pages.latest.title")} currentItem="home">
      <PageHeader
        title="Lastest Entries"
        subtitle={`(Date: ${format(new Date(), "yyyy-MM-dd")})`}
      />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Pagination
          position="top"
          previousLink={goToPreviousPage}
          nextLink={goToNextPage}
          currentPage={page}
          pages={Math.ceil(count / ITEMS_PER_PAGE)}
          more={hasMore}
        />
        <RecordList data={entries} />
        <Pagination
          position="bottom"
          previousLink={goToPreviousPage}
          nextLink={goToNextPage}
          currentPage={page}
          pages={Math.ceil(count / ITEMS_PER_PAGE)}
          more={hasMore}
        />
      </div>
    </Layout>
  )
}

export default Home
