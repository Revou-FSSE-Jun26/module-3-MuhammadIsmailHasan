import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProfileView } from "@/components/dashboard/ProfileView";

export const metadata: Metadata = { title: "Profile" };

export default function BuyerProfilePage() {
  return (
    <>
      <PageHeader title="Profile" description="Your details and shipping addresses." />
      <ProfileView />
    </>
  );
}
