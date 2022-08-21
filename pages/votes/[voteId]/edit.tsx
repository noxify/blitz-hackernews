import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getVote from "app/votes/queries/getVote";
import updateVote from "app/votes/mutations/updateVote";
import { VoteForm, FORM_ERROR } from "app/votes/components/VoteForm";

export const EditVote = () => {
  const router = useRouter();
  const voteId = useParam("voteId", "number");
  const [vote, { setQueryData }] = useQuery(
    getVote,
    { id: voteId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateVoteMutation] = useMutation(updateVote);

  return (
    <>
      <Head>
        <title>Edit Vote {vote.id}</title>
      </Head>

      <div>
        <h1>Edit Vote {vote.id}</h1>
        <pre>{JSON.stringify(vote, null, 2)}</pre>

        <VoteForm
          submitText="Update Vote"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateVote}
          initialValues={vote}
          onSubmit={async (values) => {
            try {
              const updated = await updateVoteMutation({
                id: vote.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowVotePage({ voteId: updated.id }));
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

const EditVotePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditVote />
      </Suspense>

      <p>
        <Link href={Routes.VotesPage()}>
          <a>Votes</a>
        </Link>
      </p>
    </div>
  );
};

EditVotePage.authenticate = true;
EditVotePage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditVotePage;
