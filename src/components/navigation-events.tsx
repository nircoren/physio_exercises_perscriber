"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    if (searchParams.get("lg") == "1") {
      window.history.replaceState(null, "", "/");
      toast.success("Successfuly logged in.");
    }
  }, []);

  return null;
}
