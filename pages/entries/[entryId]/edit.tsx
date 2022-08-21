import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getEntry from "app/entries/queries/getEntry";
import updateEntry from "app/entries/mutations/updateEntry";
import { EntryForm, FORM_ERROR } from "app/entries/components/EntryForm";

export const EditEntry = () => {
  const router = useRouter();
  const entryId = useParam("entryId", "number");
  const [entry, { setQueryData }] = useQuery(
    getEntry,
    { id: entryId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateEntryMutation] = useMutation(updateEntry);

  return (
    <>
      <Head>
        <title>Edit Entry {entry.id}</title>
      </Head>

      <div>
        <h1>Edit Entry {entry.id}</h1>
        <pre>{JSON.stringify(entry, null, 2)}</pre>

        <EntryForm
          submitText="Update Entry"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateEntry}
          initialValues={entry}
          onSubmit={async (values) => {
            try {
              const updated = await updateEntryMutation({
                id: entry.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowEntryPage({ entryId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditEntryPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditEntry />
      </Suspense>

      <p>
        <Link href={Routes.EntriesPage()}>
          <a>Entries</a>
        </Link>
      </p>
    </div>
  );
};

EditEntryPage.authenticate = true;
EditEntryPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditEntryPage;
