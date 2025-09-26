export interface Offer {
  _id?: string;
  title: string;
  description: string;
  universityId: string;
  universityName: string;
  country: string;
  fieldOfStudy: string;
  degree: string;
  numberOfSpots: number;
  requirements: string[];
  deadline: Date;
  startDate: Date;
  duration: string;
  language: string;
  tuitionFee?: number;
  scholarship?: boolean;
  applications: Application[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Application {
  _id?: string;
  studentId: string;
  offerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'contract_sent' | 'contract_signed';
  appliedAt: Date;
  studentInfo: {
    firstName: string;
    lastName: string;
    email: string;
    espritId: string;
    fieldOfStudy?: string;
    degreeNote?: number;
  };
  recommendations: Recommendation[];
  contractFile?: string;
}

export interface Recommendation {
  _id?: string;
  teacherId: string;
  teacherName: string;
  department: string;
  message: string;
  rating: number;
  createdAt: Date;
}