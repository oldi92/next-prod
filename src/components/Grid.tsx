import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { useMemo } from "react";
import { DynamicComponent } from "./PageLayout";

function getStoryBlokComponent(sbComponents: any[], component: string): any {
  return sbComponents?.find((item) => item.component === component);
}

const Grid = ({ blok }: { blok: any }) => {
  console.log("******* GRID RENDER ******");

  return (
    <div className="grid grid-cols-3" {...storyblokEditable(blok)}>
      {blok.columns.map((nestedBlok: any) => (
        <DynamicComponent blok={nestedBlok} key={nestedBlok._uid} />
        // <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Grid;
