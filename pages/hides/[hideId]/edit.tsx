import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getHide from "app/hides/queries/getHide";
import updateHide from "app/hides/mutations/updateHide";
import { HideForm, FORM_ERROR } from "app/hides/components/HideForm";

export const EditHide = () => {
  const router = useRouter();
  const hideId = useParam("hideId", "number");
  const [hide, { setQueryData }] = useQuery(
    getHide,
    { id: hideId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateHideMutation] = useMutation(updateHide);

  return (
    <>
      <Head>
        <title>Edit Hide {hide.id}</title>
      </Head>

      <div>
        <h1>Edit Hide {hide.id}</h1>
        <pre>{JSON.stringify(hide, null, 2)}</pre>

        <HideForm
          submitText="Update Hide"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateHide}
          initialValues={hide}
          onSubmit={async (values) => {
            try {
              const updated = await updateHideMutation({
                id: hide.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowHidePage({ hideId: updated.id }));
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

const EditHidePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditHide />
      </Suspense>

      <p>
        <Link href={Routes.HidesPage()}>
          <a>Hides</a>
        </Link>
      </p>
    </div>
  );
};

EditHidePage.authenticate = true;
EditHidePage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditHidePage;
