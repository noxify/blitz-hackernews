import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getHides from "app/hides/queries/getHides";

const ITEMS_PER_PAGE = 100;

export const HidesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ hides, hasMore }] = usePaginatedQuery(getHides, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {hides.map((hide) => (
          <li key={hide.id}>
            <Link href={Routes.ShowHidePage({ hideId: hide.id })}>
              <a>{hide.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const HidesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Hides</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewHidePage()}>
            <a>Create Hide</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <HidesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default HidesPage;
