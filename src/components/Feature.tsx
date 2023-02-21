import { storyblokEditable } from "@storyblok/react";

const Feature = ({ blok }: { blok: any }) => (
  <div className="column feature" {...storyblokEditable(blok)}>
    {blok.name}
  </div>
);

export default Feature;
