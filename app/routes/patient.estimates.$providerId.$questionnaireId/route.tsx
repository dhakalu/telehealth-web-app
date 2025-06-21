import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { API_BASE_URL } from "~/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  
  const { providerId, questionnaireId } = params;

  const payload = {
    providerId,
    questionnaireId
  };

  try {
    const res = await axios.post(
      `${API_BASE_URL}/cost-estimation`,
      payload
    );
    return Response.json({ cost: res.data.estimated_cost, providerId });
  } catch (error) {
    let message = "Failed to fetch estimate.";
    let status = 500
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
      status = error.response.status
    }
    return Response.json({ error: message }, { status });
  }
};

export default function EstimatePage() {
  const { cost, error, providerId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState<{x: number, y: number} | null>(null);
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);


  const handleAccept = () => {
    if (acceptBtnRef.current) {
      const rect = acceptBtnRef.current.getBoundingClientRect();
      setConfettiOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setShowConfetti(true);
    confettiTimeout.current = setTimeout(() => {
      setShowConfetti(false);
      navigate(`/patient/chat/${providerId}`);
    }, 1800);
  };
  const handleReject = () => {
    navigate(`/patient/find-doctors`);
  };

  useEffect(() => {
    return () => {
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {showConfetti && <Confetti 
        width={window.innerWidth} 
        height={window.innerHeight} 
        numberOfPieces={200}
          recycle={false}
          initialVelocityY={15}
          initialVelocityX={10}
          confettiSource={{
            x: confettiOrigin?.x || 0,
            y: confettiOrigin?.y || 0,
            w: 0,
            h: 0,
          }}
      />}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl text-center">
        {error && <div className="text-red-500">{error}</div>}
        {cost !== undefined && !error && (
          <>
            <div className="text-2xl font-bold text-blue-700 mb-8">
              Based on your questions and the doctor you selected, your cost of estimate is ${cost}.<br />
              <span className="text-base font-normal text-gray-600">The actual cost could change based on the actual visit.</span>
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <button
                className="btn btn-success bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={handleAccept}
                ref={acceptBtnRef}
                disabled={showConfetti}
              >
                Accept
              </button>
              <button
                className="btn btn-danger bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                onClick={handleReject}
                disabled={showConfetti}
              >
                Reject
              </button>
            </div>
          </>
        )}
        {cost === undefined && !error && (
          <div className="text-lg">Loading estimate...</div>
        )}
      </div>
    </div>
  );
}