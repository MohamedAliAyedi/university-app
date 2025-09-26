'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  FileText, 
  Award,
  GraduationCap,
  MessageSquare,
  Star,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/ui/logout-button';
import { api } from '@/lib/api';

interface TeacherProfile {
  firstName: string;
  lastName: string;
  department: string;
  isDepartmentHead: boolean;
  recommendations: string[];
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  espritId: string;
  fieldOfStudy?: string;
  degreeNote?: number;
  applications: string[];
}

interface Offer {
  _id: string;
  title: string;
  universityName: string;
  country: string;
  applications: any[];
}

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherProfile();
    fetchStudents();
    fetchOffers();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      const response = await api.getTeacherProfile();
      if (response.ok) {
        const data = await response.json();
        setTeacher(data.teacher);
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.getStudents();
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await api.getOffers();
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.espritId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">{teacher?.department} Department</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {teacher?.isDepartmentHead && (
                <Badge className="bg-purple-100 text-purple-800">
                  Department Head
                </Badge>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Prof. {teacher?.firstName} {teacher?.lastName}!
          </h2>
          <p className="text-gray-600">
            Support your students by providing recommendations and validating contracts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Recommendations</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teacher?.recommendations?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.reduce((sum, student) => sum + student.applications.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Search and Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Students Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Student Directory
              </CardTitle>
              <CardDescription>
                Search and recommend students for study abroad opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">ID: {student.espritId}</p>
                        </div>
                        <Badge variant="outline">
                          {student.applications.length} applications
                        </Badge>
                      </div>
                      
                      {student.fieldOfStudy && (
                        <p className="text-sm text-gray-600 mb-2">
                          Field: {student.fieldOfStudy}
                        </p>
                      )}
                      
                      {student.degreeNote && (
                        <div className="flex items-center mb-3">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">GPA: {student.degreeNote}/20</span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Link href={`/teacher/students/${student._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/teacher/recommend/${student._id}`}>
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Recommend
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No students found</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Offers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Study Offers
              </CardTitle>
              <CardDescription>
                Latest opportunities for student recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {offers.slice(0, 10).map((offer) => (
                  <div key={offer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-sm mb-1">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {offer.universityName} • {offer.country}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {offer.applications.length} applications
                      </Badge>
                      <Link href={`/teacher/offers/${offer._id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                
                {offers.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No offers available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Head Section */}
        {teacher?.isDepartmentHead && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Department Head Actions
              </CardTitle>
              <CardDescription>
                Additional responsibilities as department head
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/teacher/contracts">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Review Contracts
                  </Button>
                </Link>
                <Link href="/teacher/offers">
                  <Button variant="outline" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Browse Offers
                  </Button>
                </Link>
                <Link href="/teacher/reports">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Student Reports
                  </Button>
                </Link>
                <Link href="/teacher/approvals">
                  <Button variant="outline" className="w-full">
                    <Award className="h-4 w-4 mr-2" />
                    Pending Approvals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}