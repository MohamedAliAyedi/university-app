'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Calendar, Users, GraduationCap, MapPin, Award, Clock, DollarSign, FileText, CircleCheck as CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Offer {
  _id: string;
  title: string;
  description: string;
  universityName: string;
  country: string;
  fieldOfStudy: string;
  degree: string;
  numberOfSpots: number;
  requirements: string[];
  deadline: string;
  startDate: string;
  duration: string;
  language: string;
  tuitionFee?: number;
  scholarship?: boolean;
  applications: any[];
}

interface StudentProfile {
  applications: string[];
}

export default function StudentOfferDetail() {
  const params = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOffer();
      fetchStudentProfile();
    }
  }, [params.id]);

  const fetchOffer = async () => {
    try {
      const response = await api.getOffer(params.id as string);
      if (response.ok) {
        const data = await response.json();
        setOffer(data.offer);
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const response = await api.getStudentProfile();
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await api.submitApplication({ offerId: params.id });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        fetchOffer();
        fetchStudentProfile();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to apply');
      }
    } catch (error) {
      toast.error('An error occurred while applying');
    } finally {
      setApplying(false);
    }
  };

  const isApplied = () => {
    return student?.applications?.includes(params.id as string) || false;
  };

  const isDeadlinePassed = () => {
    return offer ? new Date() > new Date(offer.deadline) : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer not found</h2>
          <p className="text-gray-600 mb-4">The offer you're looking for doesn't exist.</p>
          <Link href="/student/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
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
              <h1 className="text-2xl font-bold text-gray-900">Offer Details</h1>
            </div>
            <Link href="/student/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Main Offer Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-2xl mb-2">{offer.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {offer.universityName}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {offer.country}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge variant="secondary">{offer.degree}</Badge>
                  {offer.scholarship && (
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Scholarship
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{offer.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Field of Study</p>
                        <p className="text-gray-600">{offer.fieldOfStudy}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium">Available Spots</p>
                        <p className="text-gray-600">{offer.numberOfSpots}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-600 mr-3" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-gray-600">{offer.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-purple-600 mr-3" />
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-gray-600">{offer.language}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium">Application Deadline</p>
                        <p className="text-gray-600">{new Date(offer.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p className="text-gray-600">{new Date(offer.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {offer.tuitionFee && (
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Tuition Fee</p>
                          <p className="text-gray-600">${offer.tuitionFee.toLocaleString()}/year</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium">Applications</p>
                        <p className="text-gray-600">{offer.applications.length} submitted</p>
                      </div>
                    </div>
                  </div>
                </div>

                {offer.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {offer.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Section */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isApplied() ? (
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Application Submitted</p>
                    <p className="text-sm text-green-700">
                      You have successfully applied to this program. Check your applications page for updates.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isDeadlinePassed() ? (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-900">Application Deadline Passed</p>
                      <p className="text-sm text-red-700">
                        The application deadline for this program has passed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">Ready to Apply?</p>
                        <p className="text-sm text-blue-700">
                          Make sure you meet all requirements before submitting your application.
                        </p>
                      </div>
                      <Button 
                        onClick={handleApply} 
                        disabled={applying}
                        className="w-full"
                        size="lg"
                      >
                        {applying ? 'Submitting Application...' : 'Apply Now'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}