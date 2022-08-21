import { BlitzPage } from "@blitzjs/next"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { useRouter } from "next/router"
import PageHeader from "app/core/components/partials/PageHeader"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Layout title="Login">
      <PageHeader title="Login" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <LoginForm
          onSuccess={(_user) => {
            const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
            return router.push(next)
          }}
        />
      </div>
    </Layout>
  )
}

export default LoginPage
