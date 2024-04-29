"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/nextui";
import useCreateCard from "@/hooks/card/useCreateCard";

interface CardCreateButtonProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}
export function CardCreateButton({
  children,
  ...props
}: CardCreateButtonProps) {
  const router = useRouter();
  const mutate = useCreateCard();

  return (
    <Button
      variant="bordered"
      {...props}
      onClick={() =>
        mutate.mutate(undefined, {
          onSuccess: (data) => {
            router.push(`/card/${data.data.card.id}`);
          },
        })
      }
    >
      {children || "Create"}
    </Button>
  );
}
