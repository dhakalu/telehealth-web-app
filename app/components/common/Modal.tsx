import React, { ReactNode, useEffect, useRef } from "react";
import Button from "./Button";
import PageHeader from "./PageHeader";

interface ModalProps {
    isOpen: boolean;
    children: ReactNode;
    title?: string;
    onClose: () => void
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, isOpen = false }) => {

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef?.current) {
            if (isOpen) {
                dialogRef.current.showModal()
            } else {
                dialogRef.current.close()
            }
        }
    }, [isOpen])

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        dialogRef?.current?.close()
    }

    return (
        <>
            {/* <Button onClick={handleButtonClick} {...restButtonProps} /> */}
            <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-full max-w-5xl display-flex flex-col h-full">
                    <div className="modal-action flex">
                        <form method="dialog">
                            <Button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                                onClick={handleClose}
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </form>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {title && <PageHeader title={title} />}
                        {children}
                    </div>
                </div>
            </dialog>
        </>
    );
};
