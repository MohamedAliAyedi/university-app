'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Globe, 
  Calendar, 
  Users, 
  GraduationCap,
  MapPin,
  Award,
  Clock,
  DollarSign,
  FileText,
  Star,
  Download,
  Shield
} from 'lucide-react';
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
  applications: Application[];
  isActive: boolean;
  createdAt: string;
}

interface Application {
  _id: string;
  studentId: string;
  status: string;
  appliedAt: string;
  studentInfo: {
    firstName: string;
    lastName: string;
    email: string;
    espritId: string;
    fieldOfStudy?: string;
    degreeNote?: number;
  };
  recommendations: Recommendation[];
}

interface Recommendation {
  _id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  message: string;
  rating: number;
  createdAt: string;
}

export default function AdminOfferDetail() {
  const params = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOffer();
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

  const exportOfferData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/export-offer/${params.id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offer-${offer?.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Offer data exported successfully');
      } else {
        toast.error('Failed to export offer data');
      }
    } catch (error) {
      toast.error('An error occurred during export');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'contract_sent':
        return 'bg-blue-100 text-blue-800';
      case 'contract_signed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
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
          <Link href="/admin/offers">
            <Button>Back to Offers</Button>
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
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Offer Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportOfferData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Link href="/admin/offers">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Offers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Offer Details */}
          <div className="lg:col-span-2 space-y-6">
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
                    <Badge variant={offer.isActive ? "default" : "secondary"}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </Badge>
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
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-gray-600">{new Date(offer.createdAt).toLocaleDateString()}</p>
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

            {/* Student Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Student Applications ({offer.applications.length})
                </CardTitle>
                <CardDescription>
                  Students who have applied for this program
                </CardDescription>
              </CardHeader>
              <CardContent>
                {offer.applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {offer.applications.map((application) => (
                      <div key={application._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">
                              {application.studentInfo.firstName} {application.studentInfo.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ID: {application.studentInfo.espritId} • {application.studentInfo.email}
                            </p>
                            {application.studentInfo.fieldOfStudy && (
                              <p className="text-sm text-gray-600">
                                Field: {application.studentInfo.fieldOfStudy}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.replace('_', ' ')}
                            </Badge>
                            {application.studentInfo.degreeNote && (
                              <Badge variant="outline">
                                <Star className="h-3 w-3 mr-1" />
                                {application.studentInfo.degreeNote}/20
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                          <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                          <span>Recommendations: {application.recommendations.length}</span>
                        </div>

                        {application.recommendations.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Recommendations:</h5>
                            {application.recommendations.map((rec) => (
                              <div key={rec._id} className="bg-gray-50 rounded p-3 text-sm">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium">{rec.teacherName}</span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < rec.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-600 text-xs mb-1">{rec.department} Department</p>
                                <p className="text-gray-700">{rec.message}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {new Date(rec.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Applications</span>
                    <span className="font-semibold">{offer.applications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Recommendations</span>
                    <span className="font-semibold">
                      {offer.applications.reduce((sum, app) => sum + app.recommendations.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Applications</span>
                    <span className="font-semibold">
                      {offer.applications.filter(app => app.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accepted Applications</span>
                    <span className="font-semibold text-green-600">
                      {offer.applications.filter(app => app.status === 'accepted').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Spots</span>
                    <span className="font-semibold">{offer.numberOfSpots}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" onClick={exportOfferData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Offer Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}