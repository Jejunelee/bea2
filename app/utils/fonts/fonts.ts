import localFont from "next/font/local";

/* HELVETICA NEUE */
export const helvetica = localFont({
  src: [
    { path: "./HelveticaNeue/HelveticaNeueThin.otf", weight: "100", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueThinItalic.otf", weight: "100", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueUltraLight.otf", weight: "200", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueUltraLightItalic.otf", weight: "200", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueLight.otf", weight: "300", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueLightItalic.otf", weight: "300", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueRoman.otf", weight: "400", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueItalic.ttf", weight: "400", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueMedium.otf", weight: "500", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueMediumItalic.otf", weight: "500", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueBold.otf", weight: "700", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueBoldItalic.otf", weight: "700", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueHeavy.otf", weight: "800", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueHeavyItalic.otf", weight: "800", style: "italic" },

    { path: "./HelveticaNeue/HelveticaNeueBlack.otf", weight: "900", style: "normal" },
    { path: "./HelveticaNeue/HelveticaNeueBlackItalic.otf", weight: "900", style: "italic" },
  ],

  variable: "--font-helvetica",
  display: "swap",
});


/* PP EDITORIAL */
export const editorial = localFont({
  src: [
    { path: "./PPEditorial/PPEditorialNew-Ultralight.otf", weight: "200", style: "normal" },
    { path: "./PPEditorial/PPEditorialNew-UltralightItalic.otf", weight: "200", style: "italic" },

    { path: "./PPEditorial/PPEditorialNew-Regular.otf", weight: "400", style: "normal" },
    { path: "./PPEditorial/PPEditorialNew-Italic.otf", weight: "400", style: "italic" },

    { path: "./PPEditorial/PPEditorialNew-Ultrabold.otf", weight: "800", style: "normal" },
    { path: "./PPEditorial/PPEditorialNew-UltraboldItalic.otf", weight: "800", style: "italic" },
  ],

  variable: "--font-editorial",
  display: "swap",
});