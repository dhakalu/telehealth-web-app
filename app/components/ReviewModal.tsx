import React from "react";

interface ReviewModalProps {
  doctorName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ doctorName, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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

          <label className="block mb-2">
            <span className="text-sm">Rating</span>
            <select name="rating" className="block w-full mt-1 border rounded p-2" required>
              <option value="">Select</option>
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-sm">Comment</span>
            <textarea name="comment" className="block w-full mt-1 border rounded p-2" rows={3} required />
          </label>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};
