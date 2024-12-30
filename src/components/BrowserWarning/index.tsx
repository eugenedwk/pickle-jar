"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

export function BrowserWarning({ isOpen }: { isOpen: boolean }) {
  const handleOpenBrowser = () => {
    // Try to open in default browser
    if (window.location) {
      window.location.href = `googlechrome://navigate?url=${window.location.href}`;
      // Fallback to normal link after a short delay
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Please Open in a Secure Browser</DialogTitle>
          <DialogDescription>
            For secure authentication, please open this application in Chrome,
            Safari, or another standard browser instead of an in-app browser.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button onClick={handleOpenBrowser}>Open in Default Browser</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
