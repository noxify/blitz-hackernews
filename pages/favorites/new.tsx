import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createFavorite from "app/favorites/mutations/createFavorite";
import {
  FavoriteForm,
  FORM_ERROR,
} from "app/favorites/components/FavoriteForm";

const NewFavoritePage = () => {
  const router = useRouter();
  const [createFavoriteMutation] = useMutation(createFavorite);

  return (
    <Layout title={"Create New Favorite"}>
      <h1>Create New Favorite</h1>

      <FavoriteForm
        submitText="Create Favorite"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateFavorite}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const favorite = await createFavoriteMutation(values);
            router.push(Routes.ShowFavoritePage({ favoriteId: favorite.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.FavoritesPage()}>
          <a>Favorites</a>
        </Link>
      </p>
    </Layout>
  );
};

NewFavoritePage.authenticate = true;

export default NewFavoritePage;
