'use client';

import { useState, useCallback, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/layout';
import { Button, Input, Select, TextArea, Checkbox, Card } from '@/components/ui';
import { useCreateProperty } from '@/hooks';
import { useAuth } from '@/contexts';
import {
  PROPERTY_CATEGORIES,
  FURNISHING_OPTIONS,
  INDIAN_STATES,
  PARKING_OPTIONS,
  WATER_OPTIONS,
  ELECTRICITY_OPTIONS,
} from '@/lib/constants';
import {
  Upload,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  MapPin,
  Settings,
  Camera,
  FileCheck,
} from 'lucide-react';

// Form step configuration
const FORM_STEPS = [
  { id: 1, title: 'Basic Info', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Amenities', icon: Settings },
  { id: 4, title: 'Photos', icon: Camera },
  { id: 5, title: 'Review', icon: FileCheck },
];

// Validation limits matching the React Native app
const VALIDATION = {
  propertyName: { min: 0, max: 100 },
  area: { min: 1, max: 1000000 },
  bedrooms: { min: 0, max: 20 },
  bathrooms: { min: 1, max: 20 },
  price: { min: 1, max: 1000000000 },
  address: { min: 5, max: 50 },
  city: { min: 2, max: 50 },
  pincode: { length: 6 },
  state: { min: 2, max: 50 },
  comments: { max: 1000 },
  images: { max: 5, maxSizeMB: 5 },
};

interface FormData {
  // Step 1: Basic Info
  propertyName: string;
  category: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  isNegotiable: boolean;
  isFurnished: boolean;
  // Step 2: Location
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  zone: string;
  // Step 3: Amenities
  parking: string;
  water: string;
  electricity: string;
  comments: string;
  // Step 4: Photos
  images: File[];
  // Terms
  acceptTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface ImagePreview {
  file: File;
  url: string;
}

const initialFormData: FormData = {
  propertyName: '',
  category: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  price: '',
  isNegotiable: false,
  isFurnished: false,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  zone: '',
  parking: 'None',
  water: 'Municipal',
  electricity: 'Grid',
  comments: '',
  images: [],
  acceptTerms: false,
};

export default function ListPropertyClient() {
  const router = useRouter();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { createProperty, isCreating, error: apiError, reset } = useCreateProperty();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [success, setSuccess] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<number | null>(null);

  // Handle input changes
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error when field is modified
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle image upload
  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const previews: ImagePreview[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        return;
      }

      // Check file size (5MB max)
      if (file.size > VALIDATION.images.maxSizeMB * 1024 * 1024) {
        return;
      }

      // Check max images
      if (validFiles.length + imagePreviews.length >= VALIDATION.images.max) {
        return;
      }

      validFiles.push(file);
      previews.push({
        file,
        url: URL.createObjectURL(file),
      });
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
    setImagePreviews((prev) => [...prev, ...previews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imagePreviews.length]);

  // Remove image
  const removeImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      // Revoke object URL to prevent memory leaks
      const imageToRemove = prev[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  // Validate step
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = 'Property type is required';
      }
      if (!formData.area || parseInt(formData.area) < VALIDATION.area.min) {
        newErrors.area = 'Valid area is required (min 1 sq.ft.)';
      }
      if (parseInt(formData.area) > VALIDATION.area.max) {
        newErrors.area = `Area cannot exceed ${VALIDATION.area.max.toLocaleString()} sq.ft.`;
      }
      if (!formData.bedrooms || parseInt(formData.bedrooms) < VALIDATION.bedrooms.min) {
        newErrors.bedrooms = 'Number of bedrooms is required';
      }
      if (parseInt(formData.bedrooms) > VALIDATION.bedrooms.max) {
        newErrors.bedrooms = `Bedrooms cannot exceed ${VALIDATION.bedrooms.max}`;
      }
      if (!formData.bathrooms || parseInt(formData.bathrooms) < VALIDATION.bathrooms.min) {
        newErrors.bathrooms = 'At least 1 bathroom is required';
      }
      if (parseInt(formData.bathrooms) > VALIDATION.bathrooms.max) {
        newErrors.bathrooms = `Bathrooms cannot exceed ${VALIDATION.bathrooms.max}`;
      }
      if (!formData.price || parseInt(formData.price) < VALIDATION.price.min) {
        newErrors.price = 'Valid price is required';
      }
      if (parseInt(formData.price) > VALIDATION.price.max) {
        newErrors.price = `Price cannot exceed ${VALIDATION.price.max.toLocaleString()}`;
      }
    }

    if (step === 2) {
      if (!formData.addressLine1 || formData.addressLine1.length < VALIDATION.address.min) {
        newErrors.addressLine1 = `Address must be at least ${VALIDATION.address.min} characters`;
      }
      if (formData.addressLine1.length > VALIDATION.address.max) {
        newErrors.addressLine1 = `Address cannot exceed ${VALIDATION.address.max} characters`;
      }
      if (!formData.city || formData.city.length < VALIDATION.city.min) {
        newErrors.city = 'City is required';
      }
      if (!formData.state) {
        newErrors.state = 'State is required';
      }
      if (!formData.pincode || formData.pincode.length !== VALIDATION.pincode.length) {
        newErrors.pincode = `Pincode must be ${VALIDATION.pincode.length} digits`;
      }
      if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must contain only digits';
      }
    }

    if (step === 3) {
      if (formData.comments.length > VALIDATION.comments.max) {
        newErrors.comments = `Comments cannot exceed ${VALIDATION.comments.max} characters`;
      }
    }

    if (step === 4) {
      if (imagePreviews.length === 0) {
        newErrors.images = 'At least 1 photo is required';
      }
    }

    if (step === 5) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imagePreviews.length]);

  // Navigate steps
  const goToNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length));
    }
  }, [currentStep, validateStep]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    // Only allow going back or to completed steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  }, [currentStep]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    reset();

    // Validate final step
    if (!validateStep(5)) {
      return;
    }

    if (!isAuthenticated || isGuest || !user?.email) {
      router.push(`/sign-in`);
      return;
    }

    const userEmail = user.email;

    const result = await createProperty(
      {
        userEmail,
        propertyName: formData.propertyName || `${formData.bedrooms} BHK ${formData.category}`,
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        price: parseInt(formData.price, 10),
        area: parseInt(formData.area, 10),
        isNegotiable: formData.isNegotiable,
        isFurnished: formData.isFurnished,
        comments: formData.comments,
        parking: formData.parking,
        water: formData.water,
        electricity: formData.electricity,
        category: formData.category,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          country: 'India',
          zipCode: formData.pincode,
          zone: formData.zone || undefined,
        },
      },
      formData.images.length > 0 ? formData.images : undefined
    );

    if (result.success) {
      // Cleanup image previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setSuccess(true);
      setCreatedPropertyId(result.propertyId || null);
    }
  };

  // Gate: require login before showing the form
  if (!isAuthenticated || isGuest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
            <Home className="h-10 w-10 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign in to List Your Property</h1>
          <p className="text-gray-500 mb-8">
            Create an account or sign in to list your property for free on Bharat Bhoomi 99.
          </p>
          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              className="rounded-xl"
              onClick={() => router.push('/sign-up')}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push('/sign-in')}
            >
              Login
            </Button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <Container>
          <Card padding="lg" className="max-w-lg mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Listed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your property has been submitted and will be reviewed shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {createdPropertyId && (
                <Button onClick={() => router.push(`/properties/${createdPropertyId}`)}>
                  View Property
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setCreatedPropertyId(null);
                  setFormData(initialFormData);
                  setCurrentStep(1);
                  setImagePreviews([]);
                }}
              >
                List Another Property
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            List Your Property
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reach thousands of potential buyers. Free listing, no brokerage.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {FORM_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex flex-col items-center gap-2 transition-colors ${
                    step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      step.id === currentStep ? 'text-brand-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Failed to list property</p>
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        <Card padding="lg" className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Property Information</h2>

                <Input
                  label="Property Name (Optional)"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g., Sunrise Apartments"
                  hint="Give your property a nickname for easy identification"
                  maxLength={VALIDATION.propertyName.max}
                />

                <Select
                  label="Property Type"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select property type"
                  options={PROPERTY_CATEGORIES}
                  required
                  error={errors.category}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Built-up Area (sq.ft.)"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    min={VALIDATION.area.min}
                    max={VALIDATION.area.max}
                    required
                    error={errors.area}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="e.g., 2"
                      min={VALIDATION.bedrooms.min}
                      max={VALIDATION.bedrooms.max}
                      required
                      error={errors.bedrooms}
                    />
                    <Input
                      label="Bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="e.g., 2"
                      min={VALIDATION.bathrooms.min}
                      max={VALIDATION.bathrooms.max}
                      required
                      error={errors.bathrooms}
                    />
                  </div>
                </div>

                <Input
                  label="Expected Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 5000000"
                  min={VALIDATION.price.min}
                  max={VALIDATION.price.max}
                  required
                  hint="In Indian Rupees"
                  error={errors.price}
                />

                <div className="flex flex-wrap gap-6">
                  <Checkbox
                    name="isNegotiable"
                    label="Price is Negotiable"
                    checked={formData.isNegotiable}
                    onChange={handleChange}
                  />
                  <Checkbox
                    name="isFurnished"
                    label="Property is Furnished"
                    checked={formData.isFurnished}
                    onChange={handleChange}
                  />
                </div>

                {formData.isFurnished && (
                  <Select
                    label="Furnishing Level"
                    name="furnishing"
                    value={formData.isFurnished ? 'furnished' : 'unfurnished'}
                    onChange={handleChange}
                    options={FURNISHING_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
                  />
                )}
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Property Location</h2>

                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="e.g., 123, ABC Apartments, 5th Floor"
                  required
                  error={errors.addressLine1}
                />

                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="e.g., Near XYZ Mall, Main Road"
                />

                <Input
                  label="Area/Locality"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder="e.g., Koramangala 5th Block"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore"
                    required
                    error={errors.city}
                  />
                  <Select
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Select state"
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    required
                    error={errors.state}
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g., 560095"
                    maxLength={6}
                    required
                    error={errors.pincode}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Amenities & Additional Info</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Parking"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    options={PARKING_OPTIONS}
                  />
                  <Select
                    label="Water Supply"
                    name="water"
                    value={formData.water}
                    onChange={handleChange}
                    options={WATER_OPTIONS}
                  />
                  <Select
                    label="Electricity"
                    name="electricity"
                    value={formData.electricity}
                    onChange={handleChange}
                    options={ELECTRICITY_OPTIONS}
                  />
                </div>

                <TextArea
                  label="Additional Comments (Optional)"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Describe any special features, nearby landmarks, transportation options, etc."
                  maxLength={VALIDATION.comments.max}
                  showCount
                  hint={`Max ${VALIDATION.comments.max} characters`}
                  error={errors.comments}
                />
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Property Photos</h2>
                <p className="text-gray-600">
                  Upload clear photos of your property. Good photos attract more inquiries.
                </p>

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={preview.url}
                          alt={`Property photo ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-brand-primary text-white rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                {imagePreviews.length < VALIDATION.images.max && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-primary transition-colors cursor-pointer"
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG or PNG, max {VALIDATION.images.maxSizeMB}MB each
                      ({imagePreviews.length}/{VALIDATION.images.max} uploaded)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {errors.images && (
                  <p className="text-sm text-red-500">{errors.images}</p>
                )}
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Review Your Listing</h2>

                {/* Property Summary */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {formData.propertyName || `${formData.bedrooms} BHK ${formData.category}`}
                      </h3>
                      <p className="text-gray-600">
                        {formData.addressLine1}, {formData.city}, {formData.state} - {formData.pincode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-brand-primary text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">₹{parseInt(formData.price).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-semibold">{parseInt(formData.area).toLocaleString('en-IN')} sq.ft.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Configuration</p>
                      <p className="font-semibold">{formData.bedrooms} BHK, {formData.bathrooms} Bath</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500">Furnishing</p>
                      <p className="font-medium">{formData.isFurnished ? 'Furnished' : 'Unfurnished'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Negotiable</p>
                      <p className="font-medium">{formData.isNegotiable ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Parking</p>
                      <p className="font-medium">{formData.parking}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Water</p>
                      <p className="font-medium">{formData.water}</p>
                    </div>
                  </div>

                  {formData.comments && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="text-gray-700">{formData.comments}</p>
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Photos ({imagePreviews.length})</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={preview.url}
                              alt={`Photo ${index + 1}`}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="pt-4 border-t border-gray-200">
                  <Checkbox
                    name="acceptTerms"
                    label="I agree to the Terms of Service and Privacy Policy"
                    description="By listing your property, you confirm that all information provided is accurate and you are authorized to list this property."
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={isCreating}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < FORM_STEPS.length ? (
                <Button type="button" onClick={goToNextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isCreating || !formData.acceptTerms}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      List Property
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
}
