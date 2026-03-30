import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                variant === "destructive"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 space-x-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="sm:min-w-[100px]"
          >
            <X className="h-4 w-4" />
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            className="sm:min-w-[100px]"
          >
            <Trash2 className="h-4 w-4" />
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
