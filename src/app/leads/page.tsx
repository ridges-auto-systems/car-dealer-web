import { Metadata } from "next";
import LeadsPage from "./leads-page";

export const metadata: Metadata = {
  title: "Leads Management | Ridges Automotors",
  description: "Manage customer leads and inquiries",
};

export default function Page() {
  return <LeadsPage />;
}
