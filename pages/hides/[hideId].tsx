import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getHide from "app/hides/queries/getHide";
import deleteHide from "app/hides/mutations/deleteHide";

export const Hide = () => {
  const router = useRouter();
  const hideId = useParam("hideId", "number");
  const [deleteHideMutation] = useMutation(deleteHide);
  const [hide] = useQuery(getHide, { id: hideId });

  return (
    <>
      <Head>
        <title>Hide {hide.id}</title>
      </Head>

      <div>
        <h1>Hide {hide.id}</h1>
        <pre>{JSON.stringify(hide, null, 2)}</pre>

        <Link href={Routes.EditHidePage({ hideId: hide.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteHideMutation({ id: hide.id });
              router.push(Routes.HidesPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowHidePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.HidesPage()}>
          <a>Hides</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Hide />
      </Suspense>
    </div>
  );
};

ShowHidePage.authenticate = true;
ShowHidePage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowHidePage;
