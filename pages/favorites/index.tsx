import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getFavorites from "app/favorites/queries/getFavorites";

const ITEMS_PER_PAGE = 100;

export const FavoritesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ favorites, hasMore }] = usePaginatedQuery(getFavorites, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>
            <Link href={Routes.ShowFavoritePage({ favoriteId: favorite.id })}>
              <a>{favorite.name}</a>
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

const FavoritesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Favorites</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewFavoritePage()}>
            <a>Create Favorite</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <FavoritesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
