import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createEntry from "app/entries/mutations/createEntry"
import { EntryForm, FORM_ERROR } from "app/entries/components/EntryForm"
import { CreateEntry } from "app/entries/validations"
import PageHeader from "app/core/components/partials/PageHeader"
import { getLocaleProps, useI18n } from "locales"

export const getServerSideProps = getLocaleProps()

const NewEntryPage = () => {
  const router = useRouter()
  const [createEntryMutation] = useMutation(createEntry)

  const { t } = useI18n()

  return (
    <Layout title={t("pages.create.title")}>
      <PageHeader title={t("pages.create.title")} />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <EntryForm
          initialValues={{ type: "general", title: "", link: "", content: "" }}
          className="space-y-4"
          submitText={t("pages.create.create_entry")}
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={CreateEntry}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const entry = await createEntryMutation(values)
              await router.push(Routes.ShowEntryPage({ entryId: entry.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </Layout>
  )
}

NewEntryPage.authenticate = {
  redirectTo: Routes.LoginPage(),
}

export default NewEntryPage
