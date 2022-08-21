import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/form/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/form/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import PageHeader from "app/core/components/partials/PageHeader"
import { CheckCircleIcon } from "@heroicons/react/solid"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <Layout title="Forgot Your Password?">
      <PageHeader title="Forgot Your Password?" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isSuccess ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Request Submitted</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    If your email is in our system, you will receive instructions to reset your
                    password shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Form
            submitText="Send Reset Instructions"
            className="space-y-4"
            schema={ForgotPassword}
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              try {
                await forgotPasswordMutation(values)
              } catch (error: any) {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }}
          >
            <LabeledTextField name="email" label="Email" placeholder="Email" type="text" />
          </Form>
        )}
      </div>
    </Layout>
  )
}

export default ForgotPasswordPage
