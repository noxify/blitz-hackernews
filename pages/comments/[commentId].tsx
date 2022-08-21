import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getComment from "app/comments/queries/getComment";
import deleteComment from "app/comments/mutations/deleteComment";

export const Comment = () => {
  const router = useRouter();
  const commentId = useParam("commentId", "number");
  const [deleteCommentMutation] = useMutation(deleteComment);
  const [comment] = useQuery(getComment, { id: commentId });

  return (
    <>
      <Head>
        <title>Comment {comment.id}</title>
      </Head>

      <div>
        <h1>Comment {comment.id}</h1>
        <pre>{JSON.stringify(comment, null, 2)}</pre>

        <Link href={Routes.EditCommentPage({ commentId: comment.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteCommentMutation({ id: comment.id });
              router.push(Routes.CommentsPage());
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

const ShowCommentPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CommentsPage()}>
          <a>Comments</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Comment />
      </Suspense>
    </div>
  );
};

ShowCommentPage.authenticate = true;
ShowCommentPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowCommentPage;
