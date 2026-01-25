"use client";

import { useProject } from "@/hooks/useProject";
import { useUIStore } from "@/stores/uiStore";
import { Modal } from "@/components/ui/Modal";
import { DonateForm } from "./DonateForm";
import { Spinner } from "@/components/ui/Spinner";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * DonateModal component that wraps DonateForm in a modal
 * Uses Zustand store for state management
 */
export function DonateModal() {
  const { isDonateModalOpen, selectedProjectId, closeDonateModal } = useUIStore();

  // Fetch project data if we have a selected project ID
  const projectId = selectedProjectId !== null ? BigInt(selectedProjectId) : BigInt(0);
  const { project, isLoading, isError } = useProject(projectId);

  // Close modal on successful donation
  // Note: DonateForm handles success internally, but we can close modal after a delay
  // For now, user will close manually or we can add auto-close logic later

  if (!isDonateModalOpen || !selectedProjectId) {
    return null;
  }

  return (
    <Modal
      isOpen={isDonateModalOpen}
      onClose={closeDonateModal}
      title="Make a Donation"
      size="md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : isError || !project ? (
        <Card variant="outlined">
          <CardBody>
            <p className="text-center text-charity-red">
              Failed to load project information
            </p>
          </CardBody>
        </Card>
      ) : (
        <DonateForm
          projectId={selectedProjectId}
          donationToken={project.donationToken}
          onSuccess={closeDonateModal}
        />
      )}
    </Modal>
  );
}

