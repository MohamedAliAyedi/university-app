import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Globe, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Esprit University</h1>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Gateway to 
            <span className="text-blue-600"> International Education</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with universities worldwide and discover study abroad opportunities 
            tailored for Esprit University students. Build your future with global education.
          </p>
          <div className="space-x-4">
            <Link href="/register?role=student">
              <Button size="lg" className="px-8 py-3">
                Get Started as Student
              </Button>
            </Link>
            <Link href="/register?role=university">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Join as University
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access to universities from over 50 countries worldwide
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Teacher Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get endorsed by your professors to strengthen applications
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Scholarship Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover funded programs and financial aid options
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Complete Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From application to contract signing, we guide you through
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Join as Different User Types
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit">Students</Badge>
                <CardTitle className="text-lg">Find Your Dream University</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Browse international offers</li>
                  <li>• Upload CV and documents</li>
                  <li>• Track application status</li>
                  <li>• Get teacher recommendations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit bg-green-100 text-green-800">Universities</Badge>
                <CardTitle className="text-lg">Post Study Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create study programs</li>
                  <li>• Manage applications</li>
                  <li>• Review student profiles</li>
                  <li>• Send contracts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">Teachers</Badge>
                <CardTitle className="text-lg">Recommend Students</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search student profiles</li>
                  <li>• Write recommendations</li>
                  <li>• Validate contracts</li>
                  <li>• Support student success</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:scale-105">
              <CardHeader className="pb-3">
                <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-800">Administrators</Badge>
                <CardTitle className="text-lg">Manage Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• User account management</li>
                  <li>• Send activation emails</li>
                  <li>• Export reports</li>
                  <li>• Oversee all activities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-semibold">Esprit University Platform</span>
            </div>
            <p className="text-gray-400">© 2024 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}