import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getEntries from "app/entries/queries/getEntries";

const ITEMS_PER_PAGE = 100;

export const EntriesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ entries, hasMore }] = usePaginatedQuery(getEntries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link href={Routes.ShowEntryPage({ entryId: entry.id })}>
              <a>{entry.name}</a>
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

const EntriesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Entries</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewEntryPage()}>
            <a>Create Entry</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <EntriesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default EntriesPage;
