import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getFavorite from "app/favorites/queries/getFavorite";
import updateFavorite from "app/favorites/mutations/updateFavorite";
import {
  FavoriteForm,
  FORM_ERROR,
} from "app/favorites/components/FavoriteForm";

export const EditFavorite = () => {
  const router = useRouter();
  const favoriteId = useParam("favoriteId", "number");
  const [favorite, { setQueryData }] = useQuery(
    getFavorite,
    { id: favoriteId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateFavoriteMutation] = useMutation(updateFavorite);

  return (
    <>
      <Head>
        <title>Edit Favorite {favorite.id}</title>
      </Head>

      <div>
        <h1>Edit Favorite {favorite.id}</h1>
        <pre>{JSON.stringify(favorite, null, 2)}</pre>

        <FavoriteForm
          submitText="Update Favorite"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateFavorite}
          initialValues={favorite}
          onSubmit={async (values) => {
            try {
              const updated = await updateFavoriteMutation({
                id: favorite.id,
                ...values,
              });
              await setQueryData(updated);
              router.push(Routes.ShowFavoritePage({ favoriteId: updated.id }));
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

const EditFavoritePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditFavorite />
      </Suspense>

      <p>
        <Link href={Routes.FavoritesPage()}>
          <a>Favorites</a>
        </Link>
      </p>
    </div>
  );
};

EditFavoritePage.authenticate = true;
EditFavoritePage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditFavoritePage;
