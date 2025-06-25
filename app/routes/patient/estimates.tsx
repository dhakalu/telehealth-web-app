import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import Button from "~/components/common/Button";
import { User } from "../provider/complete-profile";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const user = await requireAuthCookie(request);

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
    return Response.json({ user, cost: res.data.estimated_cost, providerId, baseUrl: API_BASE_URL });
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
  const { user, cost, error, providerId, baseUrl } = useLoaderData<{
    cost: string;
    user: User,
    error: string;
    providerId: string;
    baseUrl: string;
  }>();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState<{ x: number, y: number } | null>(null);
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);


  const handleAccept = async () => {
    if (acceptBtnRef.current) {
      const rect = acceptBtnRef.current.getBoundingClientRect();
      setConfettiOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setShowConfetti(true);
    try {
      await axios.put(`${baseUrl}/establishment`, {
        patientId: user.sub,
        practitionerId: providerId,
        status: "pending"
      });
      confettiTimeout.current = setTimeout(() => {
        setShowConfetti(false);
        navigate(`/patient/chat/${providerId}`);
      }, 1800);
    } catch {
      setShowConfetti(false);
    }
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
    <div className="flex flex-col items-center justify-center min-h-screen ">
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
      <div className=" p-8 rounded shadow-md w-full max-w-xl text-center">
        {error && <div className="text-red-500">{error}</div>}
        {cost !== undefined && !error && (
          <>
            <div className="text-2xl font-bold mb-8">
              Based on your questions and the doctor you selected, your cost of estimate is ${cost}.<br />
              <span className="text-base font-normal opacity-60">The actual cost could change based on the actual visit.</span>
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <Button
                buttonType="primary"
                onClick={handleAccept}
                ref={acceptBtnRef}
                disabled={showConfetti}
              >
                Accept
              </Button>
              <Button
                buttonType="error"
                onClick={handleReject}
                disabled={showConfetti}
              >
                Reject
              </Button>
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