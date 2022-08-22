import { Suspense } from "react"
import { Routes, useParam } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getComments from "app/comments/queries/getComments"
import { arrayToTree } from "performant-array-to-tree"

const ITEMS_PER_PAGE = 100

export const CommentsList = () => {
  const router = useRouter()
  const entryId = useParam("commentId", "number")

  const page = Number(router.query.page) || 0
  const [comments] = useQuery(getComments, {
    orderBy: { id: "desc" },
    where: {
      entryId,
    },
  })

  const commentTree = arrayToTree(comments, {})

  console.log(commentTree)
  return (
    <div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Link href={Routes.ShowCommentPage({ commentId: comment.id })}>
              <a>{comment.id}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const CommentsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Comments</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewCommentPage()}>
            <a>Create Comment</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <CommentsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default CommentsPage
