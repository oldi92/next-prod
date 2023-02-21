import { storyblokEditable } from "@storyblok/react";

const Feature = ({ blok }: { blok: any }) => {
  console.log("******** FEATURE RENDER ********");

  return (
    <div className="column feature" {...storyblokEditable(blok)}>
      {blok.name}
    </div>
  );
};

export default Feature;
