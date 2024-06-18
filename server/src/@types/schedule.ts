// Interface for the input medication data
export interface MedicationInput {
  name: string;
  frequency: string;
  timesPerDay?: string;
  specificDays?: string[];
  prescriber?: string;
  notes?: string;
  date: Date;
  photo?: {
    url: string;
    publicId: string;
  };
}
