import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createComment from "app/comments/mutations/createComment";
import { CommentForm, FORM_ERROR } from "app/comments/components/CommentForm";

const NewCommentPage = () => {
  const router = useRouter();
  const [createCommentMutation] = useMutation(createComment);

  return (
    <Layout title={"Create New Comment"}>
      <h1>Create New Comment</h1>

      <CommentForm
        submitText="Create Comment"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateComment}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const comment = await createCommentMutation(values);
            router.push(Routes.ShowCommentPage({ commentId: comment.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.CommentsPage()}>
          <a>Comments</a>
        </Link>
      </p>
    </Layout>
  );
};

NewCommentPage.authenticate = true;

export default NewCommentPage;
