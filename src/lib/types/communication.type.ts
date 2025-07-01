export type CommunicationType =
  | "EMAIL"
  | "PHONE_CALL"
  | "SMS"
  | "CHAT"
  | "IN_PERSON"
  | "VOICEMAIL"
  | "SOCIAL_MEDIA"
  | "WEBSITE_FORM";

export interface Communication {
  id: string;
  customerId?: string;
  leadId?: string;
  vehicleId?: string;
  salesRepId?: string;
  type: CommunicationType;
  direction: "INBOUND" | "OUTBOUND";
  subject?: string;
  content: string;
  phoneNumber?: string;
  emailAddress?: string;
  platform?: string;
  isRead: boolean;
  readAt?: string;
  responseTime?: number;
  attachments?: string[];
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}
