import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import RecordList from "app/entries/components/RecordList"
import { getLocaleProps, useI18n } from "locales"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getEntries from "app/entries/queries/getEntries"
import { useRouter } from "next/router"
import Pagination from "app/entries/components/Pagination"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const getServerSideProps = getLocaleProps()

const ITEMS_PER_PAGE = 10

const TellPage: BlitzPage = () => {
  const { t } = useI18n()

  const currentUser = useCurrentUser()
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
        hiddenQuery,
        {
          type: { equals: "tell" },
        },
      ],
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Layout title={t("pages.tell.title")} currentItem="tell">
      <PageHeader title={t("pages.tell.title")} />
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

export default TellPage
