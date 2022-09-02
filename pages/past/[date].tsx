import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useParam } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import RecordList from "app/entries/components/RecordList"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { format, startOfDay, sub } from "date-fns"
import { getLocaleProps, useI18n } from "locales"
import { useRouter } from "next/router"
import { endOfDay } from "date-fns"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getEntries from "app/entries/queries/getEntries"
import Pagination from "app/entries/components/Pagination"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"

export const getServerSideProps = getLocaleProps()

const ITEMS_PER_PAGE = 50

const Past: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const { t } = useI18n()
  const date = useParam("date", "string")

  const pastBaseDate = date ? new Date(date) : new Date()
  const hiddenQuery = currentUser
    ? {
        id: {
          notIn: currentUser.hides
            .filter((ele) => ele.entryId !== null)
            .map((ele) => ele.entryId) as number[],
        },
      }
    : {}
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ entries, count, hasMore }] = usePaginatedQuery(getEntries, {
    orderBy: { id: "desc" },
    where: {
      AND: [
        {
          createdAt: { gte: startOfDay(pastBaseDate) },
        },
        { createdAt: { lte: endOfDay(pastBaseDate) } },
        hiddenQuery,
      ],
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Layout title={t("pages.past.title")} currentItem="past">
      <PageHeader
        title={t("pages.past.title")}
        subtitle={`(${t("date")}: ${format(pastBaseDate, "yyyy-MM-dd")})`}
      >
        <Link href={`/past/${format(sub(pastBaseDate, { days: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.day")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { weeks: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.week")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { months: 1 }), "yyyy-MM-dd")}`}>
          <a className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.month")}
          </a>
        </Link>
        <Link href={`/past/${format(sub(pastBaseDate, { years: 1 }), "yyyy-MM-dd")}`}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none ">
            <ChevronLeftIcon className="h-4 w-4" /> {t("pages.past.filters.year")}
          </a>
        </Link>
      </PageHeader>
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

export default Past
