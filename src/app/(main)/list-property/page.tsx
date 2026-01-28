import type { Metadata } from 'next';
import { Container } from '@/components/layout';
import { Button, Input, Select, TextArea, Checkbox, Card } from '@/components/ui';
import { PROPERTY_TYPES, LISTING_TYPES, FURNISHING_OPTIONS, INDIAN_STATES, AMENITIES } from '@/lib/constants';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/constants/seo';
import { Upload, Plus, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: PAGE_TITLES.listProperty,
  description: PAGE_DESCRIPTIONS.listProperty,
};

export default function ListPropertyPage() {
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
            List Your Property
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Reach thousands of potential tenants by listing your property on Bharat Bhoomi-99.
            It's free and takes just a few minutes.
          </p>
        </div>

        <Card padding="lg" className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  1
                </span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Property Title"
                    name="title"
                    placeholder="e.g., Spacious 2BHK Apartment in Koramangala"
                    required
                    hint="Create an attractive title (10-100 characters)"
                  />
                </div>
                <Select
                  label="Property Type"
                  name="type"
                  placeholder="Select type"
                  options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                  required
                />
                <Select
                  label="Listing Type"
                  name="listingType"
                  placeholder="Select listing type"
                  options={LISTING_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                  required
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Description"
                    name="description"
                    placeholder="Describe your property in detail..."
                    required
                    maxLength={2000}
                    showCount
                    hint="Include key features, nearby landmarks, and why it's a great choice (min 50 characters)"
                  />
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  2
                </span>
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="e.g., 2"
                  min={0}
                  max={20}
                  required
                />
                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="e.g., 2"
                  min={1}
                  max={20}
                  required
                />
                <Input
                  label="Built-up Area (sq.ft.)"
                  name="area"
                  type="number"
                  placeholder="e.g., 1200"
                  min={1}
                  required
                />
                <Select
                  label="Furnishing"
                  name="furnishing"
                  placeholder="Select furnishing"
                  options={FURNISHING_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
                  required
                />
                <Input
                  label="Floor Number"
                  name="floor"
                  type="number"
                  placeholder="e.g., 5"
                  min={-2}
                  max={100}
                />
                <Input
                  label="Total Floors"
                  name="totalFloors"
                  type="number"
                  placeholder="e.g., 12"
                  min={1}
                  max={100}
                />
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  3
                </span>
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Monthly Rent"
                  name="price"
                  type="number"
                  placeholder="e.g., 25000"
                  min={0}
                  required
                  hint="In Indian Rupees"
                />
                <Input
                  label="Security Deposit"
                  name="securityDeposit"
                  type="number"
                  placeholder="e.g., 50000"
                  min={0}
                  hint="Usually 2-3 months rent"
                />
                <Input
                  label="Available From"
                  name="availableFrom"
                  type="date"
                  required
                />
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  4
                </span>
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    name="street"
                    placeholder="e.g., 123 Main Street"
                    required
                  />
                </div>
                <Input
                  label="Locality/Area"
                  name="locality"
                  placeholder="e.g., Koramangala 5th Block"
                  required
                />
                <Input
                  label="Landmark"
                  name="landmark"
                  placeholder="e.g., Near Forum Mall"
                />
                <Input
                  label="City"
                  name="city"
                  placeholder="e.g., Bangalore"
                  required
                />
                <Select
                  label="State"
                  name="state"
                  placeholder="Select state"
                  options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                  required
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  placeholder="e.g., 560095"
                  maxLength={6}
                  required
                />
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  5
                </span>
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AMENITIES.map((amenity) => (
                  <Checkbox
                    key={amenity.id}
                    name={`amenity-${amenity.id}`}
                    label={amenity.name}
                    value={amenity.id}
                  />
                ))}
              </div>
            </section>

            {/* Photos */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white text-sm">
                  6
                </span>
                Photos
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop your photos here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Upload at least 3 photos (Max 10 photos, 5MB each)
                </p>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Quality photos attract more inquiries
              </p>
            </section>

            {/* Terms */}
            <section className="pt-6 border-t border-gray-200">
              <Checkbox
                name="acceptTerms"
                label="I agree to the Terms of Service and Privacy Policy"
                description="By listing your property, you confirm that all information provided is accurate."
                required
              />
            </section>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="submit" size="lg" fullWidth>
                <Plus className="h-5 w-5" />
                List Property
              </Button>
              <Button type="button" variant="outline" size="lg" fullWidth>
                Save as Draft
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
}
