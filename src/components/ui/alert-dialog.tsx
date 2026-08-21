import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface p-7 text-center shadow-[var(--shadow-float)]",
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn("mt-2 text-[15px] text-muted", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-6 flex justify-center gap-2", className)} {...props} />;
}

export const AlertDialogCancel = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button variant="secondary" className={className} {...props} />
  </AlertDialogPrimitive.Cancel>
);

export const AlertDialogAction = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) => (
  <AlertDialogPrimitive.Action asChild>
    <Button variant="danger" className={className} {...props} />
  </AlertDialogPrimitive.Action>
);
