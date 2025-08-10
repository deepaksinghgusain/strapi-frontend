export const MetaTagNameMap = {
  metaDescription: 'description',
  metaRobots: 'robots',
  metaViewport: 'viewport',
  keywords: 'keywords',
  metaTitle: {
    og: 'og:title',
    twitter: 'twitter:title',
  },
  metaImage: {
    og: {
      image: 'og:image',
      alt: 'og:image:alt'
    },
    twitter: {
      image: 'twitter:image',
      alt: 'twitter:image:alt'
    }
  }
}


type MetaImageFormat = {
  [key in "large" | "medium" | "small" | "thumbnail"]: {
    url: string;
  };
};

interface MetaImage {
  data: {
    attributes: {
      alternativeText: string;
      url: string;
      formats: MetaImageFormat[]
    }
  }
}

export const OpenGraphTagMap = {
  title: 'og:title',
  description: 'og:description',
}

export const TwitterTagMap = {
  title: 'twitter:title',
  description: 'twitter:description',
}


export type SeoTags = {
  id: number;
  metaDescription: string,
  metaTitle: string,
  metaRobots: string,
  metaViewport: string,
  keywords: string,
  metaImage: MetaImage;
  canonicalURL: string;
  metaSocial: Array<{
    [K in keyof typeof OpenGraphTagMap]: string;
  }
    & {
      socialNetwork: "Facebook" | "Twitter"
    }>
}
