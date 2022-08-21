import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import logo from "public/logo.png"
import { Routes, BlitzPage } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import RecordList from "app/core/components/list/RecordList"
import { getLocaleProps, useI18n } from "locales"

export const getServerSideProps = getLocaleProps()

const Home: BlitzPage = () => {
  const { t } = useI18n()

  return (
    <Layout title={t("pages.latest.title")} currentItem="home">
      <PageHeader title="Lastest Entries" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RecordList />
      </div>
    </Layout>
  )
}

export default Home
