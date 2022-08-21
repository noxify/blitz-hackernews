import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createVote from "app/votes/mutations/createVote";
import { VoteForm, FORM_ERROR } from "app/votes/components/VoteForm";

const NewVotePage = () => {
  const router = useRouter();
  const [createVoteMutation] = useMutation(createVote);

  return (
    <Layout title={"Create New Vote"}>
      <h1>Create New Vote</h1>

      <VoteForm
        submitText="Create Vote"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateVote}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const vote = await createVoteMutation(values);
            router.push(Routes.ShowVotePage({ voteId: vote.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.VotesPage()}>
          <a>Votes</a>
        </Link>
      </p>
    </Layout>
  );
};

NewVotePage.authenticate = true;

export default NewVotePage;
