import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { AlertTriangle, Clock, LogOut, RefreshCcw } from "lucide-react";

interface SessionExpiryModalProps {
  isOpen: boolean;
  timeRemaining: string;
  onExtendSession: () => void;
  onLogout: () => void;
  isExtending?: boolean;
}

export function SessionExpiryModal({
  isOpen,
  timeRemaining,
  onExtendSession,
  onLogout,
  isExtending = false,
}: SessionExpiryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
              <Clock className="h-5 w-5" />
            </div>
            <DialogTitle className="text-left">Sesión por expirar</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left text-base">
            Tu sesión está por expirar en{" "}
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              {timeRemaining}
            </span>
            . ¿Deseas extender tu sesión para continuar trabajando?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/10">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Si no extiendes tu sesión, serás redirigido automáticamente a la
            página de inicio de sesión.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="sm:min-w-[100px]"
            disabled={isExtending}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onExtendSession}
            className="sm:min-w-[100px] bg-blue-600 hover:bg-blue-700"
            disabled={isExtending}
          >
            <RefreshCcw className="w-4 h-4" />
            {isExtending ? "Extendiendo..." : "Extender sesión"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
