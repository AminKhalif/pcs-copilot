"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
}

export function StubDialog({ open, onOpenChange, title, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-[var(--border)] sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-muted-foreground leading-relaxed pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
