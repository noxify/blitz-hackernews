import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getFavorite from "app/favorites/queries/getFavorite";
import deleteFavorite from "app/favorites/mutations/deleteFavorite";

export const Favorite = () => {
  const router = useRouter();
  const favoriteId = useParam("favoriteId", "number");
  const [deleteFavoriteMutation] = useMutation(deleteFavorite);
  const [favorite] = useQuery(getFavorite, { id: favoriteId });

  return (
    <>
      <Head>
        <title>Favorite {favorite.id}</title>
      </Head>

      <div>
        <h1>Favorite {favorite.id}</h1>
        <pre>{JSON.stringify(favorite, null, 2)}</pre>

        <Link href={Routes.EditFavoritePage({ favoriteId: favorite.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteFavoriteMutation({ id: favorite.id });
              router.push(Routes.FavoritesPage());
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

const ShowFavoritePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.FavoritesPage()}>
          <a>Favorites</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Favorite />
      </Suspense>
    </div>
  );
};

ShowFavoritePage.authenticate = true;
ShowFavoritePage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowFavoritePage;
