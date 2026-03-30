import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { ConfirmModal } from "@components/molecules/ConfirmModal";
export function useConfirmModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState({
        message: "",
    });
    const [resolvePromise, setResolvePromise] = useState(null);
    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setOptions(options);
            setIsOpen(true);
            setResolvePromise(() => resolve);
        });
    }, []);
    const handleConfirm = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(true);
            setResolvePromise(null);
        }
        setIsOpen(false);
    }, [resolvePromise]);
    const handleCancel = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(false);
            setResolvePromise(null);
        }
        setIsOpen(false);
    }, [resolvePromise]);
    const ConfirmDialog = useCallback(() => (_jsx(ConfirmModal, { isOpen: isOpen, onClose: handleCancel, onConfirm: handleConfirm, title: options.title, message: options.message, confirmText: options.confirmText, cancelText: options.cancelText, variant: options.variant })), [isOpen, options, handleConfirm, handleCancel]);
    return {
        confirm,
        ConfirmDialog,
    };
}
