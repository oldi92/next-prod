import { PureComponent } from "react";
import Feature from "../components/Feature";
import Grid from "../components/Grid";
import Page from "../components/Page";
import Teaser from "../components/Teaser";

export interface SbEditableContent {
  _uid: string;
  _editable?: string;
  component: string;
  [index: string]: any;
}
export interface SbEditableProps {
  content: SbEditableContent;
  children: any;
}

declare class SbEditable extends PureComponent<SbEditableProps, {}> {
  constructor(props: SbEditableProps);
  componentDidMount(): void;
  componentDidUpdate(): void;
  addPropsOnChildren(): void;
  addClass(el: HTMLElement, className: string): void;
  render(): React.ReactNode;
}

const DynamicComponent = ({ blok, meta }: any) => {
  const Components: any = {
    feature: Feature,
    grid: Grid,
    teaser: Teaser,
    page: Page,
  };

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
