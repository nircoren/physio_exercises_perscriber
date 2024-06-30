"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    if (searchParams.get("lg") == "1") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  return null;
}
