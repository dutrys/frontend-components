import React from "react";
import LinkNext from "next/link";
import { useParams } from "next/navigation";

export const Link = (props: Parameters<typeof LinkNext>[0]) => {
  const params = useParams();
  return (
    <LinkNext {...props} href={props.href === "string" ? addLocale(props.href, params.locale as string) : props.href} />
  );
};

export const addLocale = (link: string, locale?: string) => {
  if (typeof link === "string" && !/^\/(lt|en)\//.test(link) && link.startsWith("/")) {
    return `/${locale || "lt"}${link}`;
  }
  return link;
};
