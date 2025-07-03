import { Metadata } from "next";
import LeadsView from "../admin/views/leadsView";

export const metadata: Metadata = {
  title: "Leads Management | Ridges Automotors",
  description: "Manage customer leads and inquiries",
};

export default function Page() {
  return <LeadsView userRole="ADMIN" />;
}
