import Feature from "./Feature";
import Grid from "./Grid";
import Page from "./Page";
import Teaser from "./Teaser";

export const DynamicComponent = ({ blok, meta }: any) => {
  const Components: any = {
    feature: Feature,
    grid: Grid,
    teaser: Teaser,
    page: Page,
  };

  console.log("******** DYNAMIC COMPONENT **********");
  console.log("BLOK ", blok);
  console.log("FEATURE COMPONENT ", Feature);

  if (typeof Components[blok.component] !== "undefined") {
    const Component = Components[blok.component];
    return <Component blok={blok} meta={meta} />;
  }

  return (
    <p className="text-system-danger text-xl">
      The component <strong>{blok.component}</strong> has not been created in
      the app yet!
    </p>
  );
};

export const PageLayout = ({ blok }: any) => {
  console.log("********* PAGE LAYOUT *********");
  console.log("BLOK ", blok);

  return (
    <main
      className="flex-grow relative px-4 lg:px-0"
      data-testid="page-template-main"
    >
      {blok.body
        ? // eslint-disable-next-line no-underscore-dangle
          blok.body.map((blk: any) => (
            <DynamicComponent blok={blk} key={blk._uid} />
          ))
        : null}
    </main>
  );
};
