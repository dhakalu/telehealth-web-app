import Button from "./Button";
import { Modal } from "./Modal";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName?: string;
    description?: string;
    isDeleting?: boolean;
    deleteButtonText?: string;
    cancelButtonText?: string;
}

/**
 * Generic delete confirmation modal component that can be reused throughout the application.
 * 
 * @example
 * // Basic usage for deleting an organization
 * <DeleteConfirmationModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={() => setIsDeleteModalOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Organization"
 *   itemName={organization.name}
 *   isDeleting={isDeleting}
 * />
 * 
 * @example
 * // Custom usage with custom text
 * <DeleteConfirmationModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={() => setIsDeleteModalOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Remove User"
 *   itemName={user.email}
 *   description="This user will be permanently removed from the system."
 *   deleteButtonText="Remove User"
 *   cancelButtonText="Keep User"
 *   isDeleting={isRemoving}
 * />
 */
export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemName,
    description = "This action cannot be undone. All related data will be permanently deleted.",
    isDeleting = false,
    deleteButtonText = "Delete",
    cancelButtonText = "Cancel"
}: DeleteConfirmationModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="p-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Are you sure you want to delete this {title.toLowerCase().replace('delete ', '')}?
                    </h3>
                    {itemName && (
                        <p className="text-sm text-gray-500 mb-2">
                            <strong>{itemName}</strong>
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mb-6">
                        {description}
                    </p>
                    <div className="flex justify-center space-x-3">
                        <Button
                            buttonType="neutral"
                            onClick={onClose}
                        >
                            {cancelButtonText}
                        </Button>
                        <Button
                            buttonType="error"
                            onClick={onConfirm}
                            isLoading={isDeleting}
                            disabled={isDeleting}
                        >
                            {isDeleting ? `${deleteButtonText.replace('Delete', 'Deleting')}...` : deleteButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
