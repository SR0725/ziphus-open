"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const PROJECT_ENV = process.env.NEXT_PUBLIC_PROJECT_ENV;

function ReactQueryProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            const errorData = JSON.parse(JSON.stringify(error));
            console.error(errorData);
            if (
              errorData.message.includes("Unauthorized") ||
              errorData.status === 401
            ) {
              toast.error("請先登入");
              router.push("/login");
              return;
            }
            if (errorData.message.includes("Permission denied")) {
              toast.error("權限不足或帳號登入已過期");
              router.push("/login");
              return;
            }
            console.error(errorData.status);
            toast.error("檢測到一個錯誤，請檢查控制台");
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {PROJECT_ENV === "DEV" ||
        (PROJECT_ENV === "LOCAL" && (
          <ReactQueryDevtools initialIsOpen={false} />
        ))}
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
