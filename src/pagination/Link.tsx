import React from "react";
import LinkNext from "next/link";
import { useParams } from "next/navigation";

export const Link = (props: Parameters<typeof LinkNext>[0]) => {
  const params = useParams();
  let href = props.href;
  if (typeof href === "string" && !/^\/(lt|en)\//.test(href) && href.startsWith("/")) {
    href = `/${params.locale || "lt"}${props.href}`;
  }
  return <LinkNext {...props} href={href} />;
};
