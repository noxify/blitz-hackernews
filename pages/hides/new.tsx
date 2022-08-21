import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createHide from "app/hides/mutations/createHide";
import { HideForm, FORM_ERROR } from "app/hides/components/HideForm";

const NewHidePage = () => {
  const router = useRouter();
  const [createHideMutation] = useMutation(createHide);

  return (
    <Layout title={"Create New Hide"}>
      <h1>Create New Hide</h1>

      <HideForm
        submitText="Create Hide"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateHide}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const hide = await createHideMutation(values);
            router.push(Routes.ShowHidePage({ hideId: hide.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.HidesPage()}>
          <a>Hides</a>
        </Link>
      </p>
    </Layout>
  );
};

NewHidePage.authenticate = true;

export default NewHidePage;
