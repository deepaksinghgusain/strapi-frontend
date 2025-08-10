import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SeoTags, MetaTagNameMap, OpenGraphTagMap, TwitterTagMap } from '../models/meta-tag';

@Injectable({
  providedIn: 'root'
})
export class MetatagsService {
  public renderer: Renderer2;
  constructor(
    private meta: Meta,
    private title: Title,
    private _renderer: RendererFactory2
  ) {
    this.renderer = _renderer.createRenderer(null, null);
  }
  //here we use meta service to add the meta tag in head of section of each page.
  //just we need to use this service and pass the data in an array.
  addTags(data: any) {
    data.forEach((element: any) => {
      this.meta.updateTag({
        name: element.name, content: element.content
      })
    });
  }

  removeCanonicalUrl() {
    const head = document.getElementsByTagName('head')[0];
    const existingLink: HTMLLinkElement | null = document.getElementById('canonicalUrl') as HTMLLinkElement;
    if (existingLink) {
      this.renderer.removeChild(head, existingLink);
    }
    return Promise.resolve(true)
  }

  async clearSEOTags() {
    if (typeof document !== 'undefined') {
      await this.removeCanonicalUrl();
      const metaTags = Array.from(document.getElementsByTagName('meta')) as HTMLMetaElement[];
      const metaTagNames = [
        OpenGraphTagMap.description,
        TwitterTagMap.description,
        MetaTagNameMap.metaDescription,
        MetaTagNameMap.metaRobots,
        MetaTagNameMap.metaViewport,
        MetaTagNameMap.keywords,
        OpenGraphTagMap.title,
        TwitterTagMap.title,
        MetaTagNameMap.metaImage.og.image,
        MetaTagNameMap.metaImage.twitter.image,
        MetaTagNameMap.metaImage.og.alt,
        MetaTagNameMap.metaImage.twitter.alt
      ]
      metaTags.forEach(metaElement => {
        const metaAttirbuteProperty = metaElement.attributes.getNamedItem('property')?.value || '';
        if (metaTagNames.includes(metaElement.name)) {
          this.meta.removeTag(metaElement.name);
        } else if (metaTagNames.includes(metaAttirbuteProperty)) {
          this.meta.removeTagElement(metaElement);
        }
      })
    }

    return Promise.resolve(true);
  }

  addSEOTags(seoData: SeoTags) {
    this.clearSEOTags().then(
      result => {
        if (seoData) {
          Object.keys(seoData).forEach((key) => {
            const tagProperty = key as keyof SeoTags;
            if (seoData[tagProperty]) {
              switch (tagProperty) {
                case "metaImage":
                  // add meta tag for
                  // Open Graph Image and Image alternate text
                  // Twitter Graph Image and Image alternate text
                  this.meta.updateTag({
                    property: MetaTagNameMap.metaImage.og.image,
                    content: `${environment.apibaseurl}${seoData.metaImage.data.attributes.url}`,
                  });
                  this.meta.updateTag({
                    property: MetaTagNameMap.metaImage.twitter.image,
                    content: `${environment.apibaseurl}${seoData.metaImage.data.attributes.url}`
                  });
                  if (seoData.metaImage.data.attributes.alternativeText) {
                    this.meta.updateTag({
                      property: MetaTagNameMap.metaImage.og.alt,
                      content: seoData.metaImage.data.attributes.alternativeText
                    });
                    this.meta.updateTag({
                      property: MetaTagNameMap.metaImage.twitter.alt,
                      content: seoData.metaImage.data.attributes.alternativeText
                    });
                  }
                  break;

                case "metaSocial": {
                  if (seoData.metaSocial && seoData.metaSocial.length) {
                    seoData.metaSocial.forEach(socialObj => {
                      if (socialObj.socialNetwork === 'Facebook') {
                        this.meta.updateTag({
                          property: OpenGraphTagMap.title,
                          content: socialObj.title
                        });
                        this.meta.updateTag({
                          property: OpenGraphTagMap.description,
                          content: socialObj.description
                        });
                      } else {
                        this.meta.updateTag({
                          property: TwitterTagMap.title,
                          content: socialObj.title
                        });
                        this.meta.updateTag({
                          property: TwitterTagMap.description,
                          content: socialObj.description
                        });
                      }
                    })
                  }
                }
                  break;

                case "metaTitle": {
                  this.title.setTitle(seoData.metaTitle);
                  this.meta.updateTag({
                    property: MetaTagNameMap.metaTitle.og,
                    content: seoData.metaTitle
                  });
                  this.meta.updateTag({
                    property: MetaTagNameMap.metaTitle.twitter,
                    content: seoData.metaTitle
                  });
                };
                  break;

                case "canonicalURL":
                  if (typeof document !== 'undefined') {
                    const head = document.getElementsByTagName('head')[0];
                    let link: HTMLLinkElement | null = document.getElementById('canonicalUrl') as HTMLLinkElement;
                    if (!link) {
                      link = this.renderer.createElement('link') as HTMLLinkElement;
                      link.rel = "canonical";
                      link.id = "canonicalUrl";
                    }
                    link.href = seoData.canonicalURL;
                    this.renderer.appendChild(head, link);
                  }
                  break;

                default:
                  if (tagProperty !== 'id') {
                    this.meta.updateTag({
                      name: MetaTagNameMap[tagProperty],
                      content: seoData[tagProperty]
                    });
                  }
                  break;
              }
            }
          })
        }

        if (typeof window !== 'undefined') {
          const url = window.location.href;
          this.meta.updateTag({
            property: 'og:url',
            content: url
          });
        }
      }
    )
  }

}
