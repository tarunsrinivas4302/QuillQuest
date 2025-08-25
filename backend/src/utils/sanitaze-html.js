import sanitizeHtml from "sanitize-html";
export const sanitizedHtmlContent = (content) =>
  sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "pre",
      "code",
      "iframe",
      "p",
      "",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "frameborder", "allow", "allowfullscreen"],
      code: ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "player.vimeo.com",
      "www.google.com",
    ],
  });
