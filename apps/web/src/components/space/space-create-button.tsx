"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/nextui";
import useCreateSpace from "@/hooks/space/useCreateSpace";

interface SpaceCreateButtonProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}
export function SpaceCreateButton({
  children,
  ...props
}: SpaceCreateButtonProps) {
  const mutate = useCreateSpace();
  const router = useRouter();
  return (
    <Button
      variant="bordered"
      {...props}
      onClick={() =>
        mutate.mutate(undefined, {
          onSuccess: (data) => {
            router.push(`/space/${data.data.space.id}`);
          },
        })
      }
    >
      {children || "Create"}
    </Button>
  );
}
