import React from "react";
import Button from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

interface ReviewModalProps {
  doctorName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ doctorName, onClose, onSubmit }) => {
  return (
    <dialog id="review_modal" className="modal">

      <div className="modal-box">
        <form method="dialog">
          <Button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </form>
        <h3 className="text-lg font-semibold mb-4">Add Review for {doctorName}</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as typeof e.target & {
              rating: { value: string };
              comment: { value: string };
            };
            await onSubmit(Number(form.rating.value), form.comment.value);
          }}
        >
          <Select
            name="rating"
            label="Rating"
            options={["1", "2", "3", "4", "5"].map(n => ({ label: n, value: n }))}
          />

          <Input
            name="comment"
            label="Comment"
            textarea
          />
          <Button
            buttonType="accent"
            type="submit"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </dialog>
  );
};
