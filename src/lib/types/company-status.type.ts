export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  established: string;
  specialties: string[];
  services: string[];
  features: string[];
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
    salesEmail: string;
    supportEmail: string;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  licenses: {
    dealerLicense: string;
    businessLicense: string;
  };
  certifications: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  timestamp: string;
}

export interface DealershipStats {
  inventory: {
    totalVehicles: number;
    availableVehicles: number;
    soldVehicles: number;
  };
  customers: {
    totalLeads: number;
    totalCustomers: number;
  };
  business: {
    inventoryValue: number;
    averagePrice: number;
  };
}
