import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function UserLayout(props: PropsWithChildren) {
  const cookie = cookies();
  if (!cookie.get("authorization")) {
    redirect("/login");
  }

  return props.children;
}

export default UserLayout;
