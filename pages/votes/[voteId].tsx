import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getVote from "app/votes/queries/getVote";
import deleteVote from "app/votes/mutations/deleteVote";

export const Vote = () => {
  const router = useRouter();
  const voteId = useParam("voteId", "number");
  const [deleteVoteMutation] = useMutation(deleteVote);
  const [vote] = useQuery(getVote, { id: voteId });

  return (
    <>
      <Head>
        <title>Vote {vote.id}</title>
      </Head>

      <div>
        <h1>Vote {vote.id}</h1>
        <pre>{JSON.stringify(vote, null, 2)}</pre>

        <Link href={Routes.EditVotePage({ voteId: vote.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteVoteMutation({ id: vote.id });
              router.push(Routes.VotesPage());
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

const ShowVotePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.VotesPage()}>
          <a>Votes</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Vote />
      </Suspense>
    </div>
  );
};

ShowVotePage.authenticate = true;
ShowVotePage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowVotePage;
