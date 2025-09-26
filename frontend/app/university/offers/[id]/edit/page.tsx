'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Offer {
  _id: string;
  title: string;
  description: string;
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
}

export default function EditOffer() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fieldOfStudy: '',
    degree: '',
    numberOfSpots: '',
    requirements: '',
    deadline: '',
    startDate: '',
    duration: '',
    language: '',
    tuitionFee: '',
    scholarship: false,
  });

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
        const offer = data.offer;
        setFormData({
          title: offer.title,
          description: offer.description,
          fieldOfStudy: offer.fieldOfStudy,
          degree: offer.degree,
          numberOfSpots: offer.numberOfSpots.toString(),
          requirements: offer.requirements.join('\n'),
          deadline: new Date(offer.deadline).toISOString().split('T')[0],
          startDate: new Date(offer.startDate).toISOString().split('T')[0],
          duration: offer.duration,
          language: offer.language,
          tuitionFee: offer.tuitionFee ? offer.tuitionFee.toString() : '',
          scholarship: offer.scholarship || false,
        });
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
      toast.error('Failed to load offer details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Note: You'll need to add an update offer endpoint to your API
      const response = await fetch(`http://localhost:3001/api/university/offers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          numberOfSpots: parseInt(formData.numberOfSpots),
          tuitionFee: formData.tuitionFee ? parseFloat(formData.tuitionFee) : null,
          requirements: formData.requirements.split('\n').filter(req => req.trim()),
        }),
      });

      if (response.ok) {
        toast.success('Offer updated successfully!');
        router.push(`/university/offers/${params.id}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update offer');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>
            </div>
            <Link href={`/university/offers/${params.id}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Offer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Study Abroad Offer</CardTitle>
            <CardDescription>
              Update your study opportunity details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Program Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    placeholder="e.g., Master's in Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe the program, its objectives, and what makes it unique..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                    <Select value={formData.fieldOfStudy} onValueChange={(value) => handleChange('fieldOfStudy', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                        <SelectItem value="Information Systems">Information Systems</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree Level *</Label>
                    <Select value={formData.degree} onValueChange={(value) => handleChange('degree', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                        <SelectItem value="Master's">Master's Degree</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Certificate">Certificate Program</SelectItem>
                        <SelectItem value="Exchange">Exchange Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Program Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Program Details</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfSpots">Number of Spots *</Label>
                    <Input
                      id="numberOfSpots"
                      type="number"
                      min="1"
                      value={formData.numberOfSpots}
                      onChange={(e) => handleChange('numberOfSpots', e.target.value)}
                      required
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleChange('duration', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 semester">1 Semester</SelectItem>
                        <SelectItem value="2 semesters">2 Semesters</SelectItem>
                        <SelectItem value="1 year">1 Year</SelectItem>
                        <SelectItem value="2 years">2 Years</SelectItem>
                        <SelectItem value="3 years">3 Years</SelectItem>
                        <SelectItem value="4 years">4 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select value={formData.language} onValueChange={(value) => handleChange('language', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleChange('deadline', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Program Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuitionFee">Tuition Fee (USD/year)</Label>
                    <Input
                      id="tuitionFee"
                      type="number"
                      min="0"
                      value={formData.tuitionFee}
                      onChange={(e) => handleChange('tuitionFee', e.target.value)}
                      placeholder="e.g., 15000"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="scholarship"
                      checked={formData.scholarship}
                      onCheckedChange={(checked) => handleChange('scholarship', checked as boolean)}
                    />
                    <Label htmlFor="scholarship">Scholarship Available</Label>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Requirements</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="requirements">Application Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleChange('requirements', e.target.value)}
                    rows={6}
                    placeholder="Enter each requirement on a new line, e.g.:&#10;- Bachelor's degree in related field&#10;- Minimum GPA of 3.0&#10;- English proficiency (TOEFL/IELTS)&#10;- CV and motivation letter&#10;- Two recommendation letters"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href={`/university/offers/${params.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}