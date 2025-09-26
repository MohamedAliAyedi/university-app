'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Globe, 
  Calendar, 
  Users, 
  GraduationCap,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Award
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
  deadline: string;
  startDate: string;
  duration: string;
  language: string;
  tuitionFee?: number;
  scholarship?: boolean;
  applications: any[];
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  espritId: string;
  applications: string[];
}

export default function StudentDashboard() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
    fetchStudentProfile();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, countryFilter, fieldFilter]);

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

  const filterOffers = () => {
    let filtered = offers;

    if (searchTerm) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (countryFilter) {
      filtered = filtered.filter(offer => offer.country === countryFilter);
    }

    if (fieldFilter) {
      filtered = filtered.filter(offer => offer.fieldOfStudy === fieldFilter);
    }

    setFilteredOffers(filtered);
  };

  const applyToOffer = async (offerId: string) => {
    try {
      const response = await api.submitApplication({ offerId });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        fetchOffers();
        fetchStudentProfile();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to apply');
      }
    } catch (error) {
      toast.error('An error occurred while applying');
    }
  };

  const isApplied = (offerId: string) => {
    return student?.applications?.includes(offerId) || false;
  };
  //@ts-ignore
  const countries = [...new Set(offers.map(offer => offer.country))];
  //@ts-ignore
  const fields = [...new Set(offers.map(offer => offer.fieldOfStudy))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/student/profile">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>
              <Link href="/student/applications">
                <Button variant="outline">
                  My Applications
                </Button>
              </Link>
              <Avatar>
                <AvatarFallback>
                  {student?.firstName?.[0]}{student?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {student?.firstName}!
          </h2>
          <p className="text-gray-600">
            Discover international study opportunities and build your future
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Globe className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Applications</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student?.applications?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <MapPin className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countries.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Scholarships</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {offers.filter(offer => offer.scholarship).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Find Study Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search offers, universities, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fieldFilter} onValueChange={setFieldFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {offer.country}
                  </Badge>
                  {offer.scholarship && (
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="h-3 w-3 mr-1" />
                      Scholarship
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {offer.universityName} • {offer.degree}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {offer.fieldOfStudy}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {offer.numberOfSpots} spots available
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Deadline: {new Date(offer.deadline).toLocaleDateString()}
                  </div>
                  {offer.tuitionFee && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${offer.tuitionFee.toLocaleString()} / year
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <Link href={`/student/offers/${offer._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {isApplied(offer._id) ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Applied
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => applyToOffer(offer._id)}
                      disabled={new Date() > new Date(offer.deadline)}
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-gray-600 mb-2">No offers found</CardTitle>
              <CardDescription>
                Try adjusting your search criteria or check back later for new opportunities.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}