import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getVotes from "app/votes/queries/getVotes";

const ITEMS_PER_PAGE = 100;

export const VotesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ votes, hasMore }] = usePaginatedQuery(getVotes, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {votes.map((vote) => (
          <li key={vote.id}>
            <Link href={Routes.ShowVotePage({ voteId: vote.id })}>
              <a>{vote.name}</a>
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

const VotesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Votes</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewVotePage()}>
            <a>Create Vote</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <VotesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default VotesPage;
