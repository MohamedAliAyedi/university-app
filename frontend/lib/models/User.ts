export interface BaseUser {
  _id?: string;
  email: string;
  password: string;
  role: 'admin' | 'student' | 'teacher' | 'university';
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends BaseUser {
  role: 'student';
  espritId: string;
  emailEsprit: string;
  fieldOfStudy?: string;
  degreeNote?: number;
  expectedGraduation?: Date;
  files?: {
    cv?: string;
    certifications?: string[];
    diplomas?: string[];
    experiences?: string[];
    stages?: string[];
  };
  applications?: string[]; // Offer IDs
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  department: string;
  isDepartmentHead: boolean;
  recommendations?: string[]; // Student IDs
}

export interface University extends BaseUser {
  role: 'university';
  universityName: string;
  country: string;
  website?: string;
  description?: string;
  offers?: string[]; // Offer IDs
}

export interface Admin extends BaseUser {
  role: 'admin';
  permissions: string[];
}

export type User = Student | Teacher | University | Admin;