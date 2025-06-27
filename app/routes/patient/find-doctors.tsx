import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router";
import { API_BASE_URL } from "~/api";
import { requireAuthCookie } from "~/auth";
import { Modal } from "~/components/common/Modal";
import PageHeader from "~/components/common/PageHeader";
import { BookAppointment } from "~/components/provider/BookAppointment";
import { PractitionerList } from "../../components/PractitionerList";
import { User } from "../provider/complete-profile";


export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthCookie(request);
  return {
    user,
    baseUrl: API_BASE_URL
  };
}

export default function PractitionerListPage() {
  const { user, baseUrl } = useLoaderData<{ user: User, baseUrl: string }>();
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectProvider = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: Clear selected provider after modal closes with a delay
    setTimeout(() => setSelectedProviderId(null), 300);
  };

  const handleAppointmentBooked = () => {
    // Show success message or perform additional actions
    // Close modal after successful booking
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2000); // Keep modal open for 2 seconds to show the success message
  };

  return (
    <div className="min-h-screen px-10 pb-16">
      <PageHeader
        title="Find Doctors"
        description="Use the search below to find doctors who can help"
      />

      <div className="mb-8">
        <PractitionerList
          patientId={user.sub}
          baseURL={baseUrl}
          onSelectProvider={handleSelectProvider}
        />
      </div>

      <Modal
        isOpen={isModalOpen && selectedProviderId !== null}
        onClose={handleCloseModal}
        title="Schedule an Appointment"
      >
        {selectedProviderId && (
          <BookAppointment
            providerId={selectedProviderId}
            patientId={user.sub}
            baseUrl={baseUrl}
            onAppointmentBooked={handleAppointmentBooked}
          />
        )}
      </Modal>
    </div>
  );
}
