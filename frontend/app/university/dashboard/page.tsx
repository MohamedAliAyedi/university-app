'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Globe, FileText, Calendar, MapPin, GraduationCap, Eye, CreditCard as Edit } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/ui/logout-button';
import { api } from '@/lib/api';

interface UniversityProfile {
  firstName: string;
  lastName: string;
  universityName: string;
  country: string;
  offers: string[];
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  country: string;
  fieldOfStudy: string;
  degree: string;
  numberOfSpots: number;
  deadline: string;
  startDate: string;
  applications: any[];
  isActive: boolean;
}

export default function UniversityDashboard() {
  const [university, setUniversity] = useState<UniversityProfile | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversityProfile();
    fetchOffers();
  }, []);

  const fetchUniversityProfile = async () => {
    try {
      const response = await api.getUniversityProfile();
      if (response.ok) {
        const data = await response.json();
        setUniversity(data.university);
      }
    } catch (error) {
      console.error('Error fetching university profile:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await api.getUniversityOffers();
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

  const totalApplications = offers.reduce((sum, offer) => sum + offer.applications.length, 0);
  const activeOffers = offers.filter(offer => offer.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">University Dashboard</h1>
                <p className="text-gray-600">{university?.universityName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/university/offers/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {university?.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your study abroad offers and review student applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <Globe className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOffers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Country</CardTitle>
              <MapPin className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{university?.country}</div>
            </CardContent>
          </Card>
        </div>

        {/* Offers Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Study Offers</CardTitle>
                <CardDescription>
                  Manage and monitor your posted study opportunities
                </CardDescription>
              </div>
              <Link href="/university/offers/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Offer
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {offers.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first study abroad offer to start attracting students
                </p>
                <Link href="/university/offers/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Offer
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <p className="text-gray-600 text-sm">{offer.degree} in {offer.fieldOfStudy}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={offer.isActive ? "default" : "secondary"}>
                          {offer.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {offer.applications.length} applications
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {offer.numberOfSpots} spots available
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Deadline: {new Date(offer.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Starts: {new Date(offer.startDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {offer.description}
                      </p>
                      <div className="flex space-x-2 ml-4">
                        <Link href={`/university/offers/${offer._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/university/offers/${offer._id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}