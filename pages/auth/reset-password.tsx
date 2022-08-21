import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/form/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/form/Form"
import { ResetPassword } from "app/auth/validations"
import resetPassword from "app/auth/mutations/resetPassword"
import { BlitzPage, Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import PageHeader from "app/core/components/partials/PageHeader"
import { CheckCircleIcon } from "@heroicons/react/outline"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <Layout title="Set a new password">
      <PageHeader title="Set a new password" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Password Reset Successfully</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Go to the <Link href={Routes.Home()}>homepage</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Form
            className="space-y-4"
            submitText="Reset Password"
            schema={ResetPassword}
            initialValues={{
              password: "",
              passwordConfirmation: "",
              token: router.query.token as string,
            }}
            onSubmit={async (values) => {
              try {
                await resetPasswordMutation(values)
              } catch (error: any) {
                if (error.name === "ResetPasswordError") {
                  return {
                    [FORM_ERROR]: error.message,
                  }
                } else {
                  return {
                    [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                  }
                }
              }
            }}
          >
            <LabeledTextField name="password" label="New Password" type="password" />
            <LabeledTextField
              name="passwordConfirmation"
              label="Confirm New Password"
              type="password"
            />
          </Form>
        )}
      </div>
    </Layout>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"

export default ResetPasswordPage
