import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { BlitzPage, Routes } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Layout title="Sign up">
      <PageHeader title="Sign up" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SignupForm onSuccess={() => router.push(Routes.Home())} />
      </div>
    </Layout>
  )
}

export default SignupPage
