import React from "react";
import LinkNext from "next/link";
import { useParams } from "next/navigation";
import type { UrlObject } from "url";

export const Link = (props: Parameters<typeof LinkNext>[0]) => {
  const params = useParams();
  return <LinkNext prefetch={false} {...props} href={addLocale(props.href, params.locale as string)} />;
};

const isUrl = (link: string | UrlObject): link is UrlObject =>
  typeof link === "object" && "href" in link && !!link.href;

export const addLocale = (link: any, locale?: string) => {
  const href = isUrl(link) ? link.href : (link as string);
  if (typeof href === "string" && !/^\/api\//.test(href) && !/^\/(lt|en)\//.test(href) && href.startsWith("/")) {
    return `/${locale || "lt"}${href}`;
  }
  return link;
};
