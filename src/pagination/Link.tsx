import React from "react";
import LinkNext from "next/link";
import { useParams } from "next/navigation";

export const Link = (props: Parameters<typeof LinkNext>[0]) => {
  const params = useParams();
  return <LinkNext {...props} href={props.href === "string" ? makeLink(props.href, params.locale) : props.href} />;
};

export const makeLink = (link: string, locale?: string | Array<string> | undefined) => {
  if (typeof link === "string" && !/^\/(lt|en)\//.test(link) && link.startsWith("/")) {
    return `/${locale}${link}`;
  }
  return link;
};
