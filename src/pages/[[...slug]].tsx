/**
 * This is a catch all for storyblok pages any storyblok page
 * placed in a folder outside the community pages will
 * be routed according to the folder structure.
 *
 * It assumes that the page will always have a locale prefix
 * on its slug e.g. fr/mypage/about-evs
 * The locale prefix comes from the directory structure
 * defined in Storyblok.
 */
import { ISbStoryParams as StoryParams } from "storyblok-js-client";
import { useRouter } from "next/router";
// import { Storyblok, useStoryblok } from "@electro/consumersite/src/storyblok";
// import dirtyReplaceForChargerCount from "../src/storyblok/helpers/dirtyReplaceForChargerCount";
// import { getDatasourceEntries } from "../src/storyblok/util/storyblok";
import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Teaser from "../components/Teaser";
import { PageLayout } from "../components/PageLayout";
import { Storyblok, useStoryblok } from "../components/StoryBlok";
import { storyblokInit, apiPlugin } from "@storyblok/react";

interface landingPagePageProps {
  story: StoryParams;
}

const components: any = {
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
  page: Page,
};

storyblokInit({
  accessToken: "jvQr9vFaXU8HlJqAfUi2tgtt",
  use: [apiPlugin],
  components,
});

export default function Page({ story }: landingPagePageProps) {
  console.log("***** STORYBLOK PAGE ****** ");
  console.log("STORY ", story);

  const router = useRouter();
  const enableBridge = "_storyblok" in router.query;
  const storyBlok = useStoryblok(story, enableBridge);

  console.log(storyBlok);

  return <PageLayout blok={storyBlok.content} />;
}

export async function getStaticProps({
  params,
  preview = false,
  locale,
  defaultLocale,
}: any) {
  const slug = params?.slug ? params.slug.join("/") : "home";
  const sbParams: StoryParams = {
    version: "published",
  };

  if (preview) {
    sbParams.version = "draft";
    sbParams.cv = Date.now();
  }

  //   const localisedSlug = `${locale}/${slug}`;
  //   const { data } = await Storyblok.get(
  //     `cdn/stories/${localisedSlug}`,
  //     sbParams
  //   );
  let { data } = await Storyblok.get(`cdn/stories/${slug}`, sbParams);
  console.log("DATA ", data);

  /**
   * Storyblok won't let us add a datasource to a text item directly in it's UI.
   * To work around this we are adding our own template code.
   * It's nothing more that a dirty replace (I know!) for a single value.
   */
  //   const chargerCountDataSource = await getDatasourceEntries('charger-count')
  //   const chargerCount = chargerCountDataSource.find((item) => item.name === 'total')

  //   const contentWithChargerCount = dirtyReplaceForChargerCount(data.story, chargerCount.value)
  return {
    props: {
      /**
       * We need to provide a key here or links between
       * dynamically generated pages will not work!
       * https://github.com/vercel/next.js/issues/9992#issuecomment-615402511
       */
      key: data.story.id,
      slug,
      story: data.story,
      preview,
    },
    revalidate: 3600,
  };
}

const IGNORED_PATHS = ["community/"];
/**
 * In storyblok we have dynamic localised directories for each region.
 * This allows us to have custom content for each country.
 * The slugs in storybook look like this
 * /fr/route/path
 * next-translate needs a locale for every page. This means that we have
 * to specify the country code based on the locale in the slug and then remove it
 * from the paths array because next-translate adds it back in after.
 * This avoids static pages being generate on routes like /fr/fr/route/path
 */
export async function getStaticPaths() {
  const { data } = await Storyblok.get("cdn/links/");
  // console.log("DATA ", data);

  const paths: any = [];

  Object.keys(data.links).forEach((linkKey) => {
    if (
      data.links[linkKey].is_folder ||
      IGNORED_PATHS.some((slug) => data.links[linkKey].slug.includes(slug))
    ) {
      return;
    }

    const { slug, isStartpage } = data.links[linkKey];

    const splitSlug =
      slug.includes("home") || isStartpage ? [] : slug.split("/");

    paths.push({ params: { slug: splitSlug } });
  });

  // console.log("***** PATHS ****** ");
  // console.log(paths);

  return {
    paths,
    fallback: false,
  };
}
