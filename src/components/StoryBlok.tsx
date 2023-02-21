import { useCallback, useEffect, useState } from "react";
import StoryblokClient from "storyblok-js-client";

export const Storyblok = new StoryblokClient({
  accessToken: "jvQr9vFaXU8HlJqAfUi2tgtt",
  cache: {
    clear: "auto",
    type: "memory",
  },
});

export function useStoryblok(originalStory: any, preview: any) {
  const [story, setStory] = useState(originalStory);

  // adds the events for updating the visual editor
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
  const initEventListeners = useCallback(() => {
    const { StoryblokBridge } = window;
    if (typeof StoryblokBridge !== "undefined") {
      // initialize the bridge with your token
      const storyblokInstance = new StoryblokBridge();

      // reload on Next.js page on save or publish event in the Visual Editor
      storyblokInstance.on(["change", "published"], () =>
        window.location.reload(true)
      );

      // live update the story on input events
      storyblokInstance.on("input", (event: any) => {
        // check if the ids of the event and the passed story match
        // eslint-disable-next-line no-underscore-dangle
        if (story && event.story.content._uid === story.content._uid) {
          // change the story content through the setStory function
          setStory(event.story);
        }
      });

      storyblokInstance.on("enterEditmode", (event: any) => {
        // loading the draft version on initial enter of editor
        Storyblok.get(`cdn/stories/${event.storyId}`, {
          version: "draft",
        })
          .then(({ data }) => {
            if (data.story) {
              setStory(data.story);
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
    }
  }, [story]);

  // appends the bridge script tag to our document
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback: any) {
    // check if the script is already present
    const existingScript = document.getElementById("storyblokBridge");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//app.storyblok.com/f/storyblok-v2-latest.js";
      script.id = "storyblokBridge";
      document.body.appendChild(script);
      script.onload = () => {
        // once the script is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    // only load inside preview mode
    if (preview) {
      // first load the bridge, then initialize the event listeners
      addBridge(initEventListeners);
    }
  }, [initEventListeners, originalStory, preview, setStory]); // runs the effect only once & defines effect dependencies

  return story;
}
