'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { useBuilders } from '@/contexts/BuilderContext';
import { useToast } from '@/contexts';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';
import {
  PROPERTY_CATEGORIES,
  PARKING_OPTIONS,
  WATER_OPTIONS,
  ELECTRICITY_OPTIONS,
  FACING_OPTIONS,
  PLOT_APPROVAL_OPTIONS,
  BANGALORE_AREAS,
} from '@/lib/constants/property';

interface AddPropertySlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  propertyName: string;
  category: string;
  builderId: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  // Plot details
  facing: string;
  plotLength: string;
  plotWidth: string;
  plotApprovalType: string;
  // Pricing
  price: string;
  deposit: string;
  isNegotiable: boolean;
  isFurnished: boolean;
  // Location
  addressLine1: string;
  addressLine2: string;
  zone: string;
  city: string;
  state: string;
  zipCode: string;
  // Amenities
  parking: string;
  water: string;
  electricity: string;
  // Additional
  comments: string;
  autoApprove: boolean;
}

const initialForm: FormState = {
  propertyName: '',
  category: '',
  builderId: '',
  area: '',
  bedrooms: '2',
  bathrooms: '2',
  facing: '',
  plotLength: '',
  plotWidth: '',
  plotApprovalType: '',
  price: '',
  deposit: '',
  isNegotiable: false,
  isFurnished: false,
  addressLine1: '',
  addressLine2: '',
  zone: '',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '',
  parking: 'None',
  water: 'Municipal',
  electricity: 'Grid',
  comments: '',
  autoApprove: true,
};

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export default function AddPropertySlideOver({ isOpen, onClose, onSuccess }: AddPropertySlideOverProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { activeBuilders } = useBuilders();
  const { showToast } = useToast();

  const isPlot = form.category === 'plot';

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - images.length;
    const valid = files.slice(0, remaining).filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        showToast(`${f.name}: Only JPG/PNG allowed`, 'error');
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        showToast(`${f.name}: Max 5MB`, 'error');
        return false;
      }
      return true;
    });

    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const url = previews[index];
    if (url) URL.revokeObjectURL(url);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.category) errs.category = 'Required';
    if (!form.area || Number(form.area) <= 0) errs.area = 'Must be > 0';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Must be > 0';
    if (!form.city.trim()) errs.city = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const data = {
        propertyName: form.propertyName || `${form.category} in ${form.city}`,
        category: form.category,
        builderId: form.builderId || undefined,
        area: Number(form.area),
        bedrooms: isPlot ? 0 : Number(form.bedrooms),
        bathrooms: isPlot ? 0 : Number(form.bathrooms),
        price: Number(form.price),
        deposit: Number(form.deposit) || 0,
        isNegotiable: form.isNegotiable,
        isFurnished: form.isFurnished,
        parking: form.parking,
        water: form.water,
        electricity: form.electricity,
        comments: form.comments,
        facing: form.facing || undefined,
        plotLength: form.plotLength ? Number(form.plotLength) : undefined,
        plotWidth: form.plotWidth ? Number(form.plotWidth) : undefined,
        plotApprovalType: form.plotApprovalType || undefined,
        address: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          zone: form.zone,
        },
        autoApprove: form.autoApprove,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      for (const img of images) {
        formData.append('images', img);
      }

      const res = await fetch('/api/admin/properties/create', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        showToast(result.error?.message || 'Failed to create property', 'error');
        return;
      }

      showToast('Property created successfully!', 'success');
      // Reset form
      setForm(initialForm);
      setImages([]);
      previews.forEach((p) => URL.revokeObjectURL(p));
      setPreviews([]);
      onSuccess();
      onClose();
    } catch {
      showToast('Failed to create property', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews([]);
    setImages([]);
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all';
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1.5';
  const sectionClass = 'space-y-4';
  const sectionTitleClass = 'text-sm font-semibold text-gray-900 pb-2 border-b border-gray-100';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Property</h2>
            <p className="text-xs text-gray-500 mt-0.5">Create a new property listing</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-6">
          {/* Property Details */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Property Details</h3>

            <div>
              <label className={labelClass}>Property Name</label>
              <input
                type="text"
                value={form.propertyName}
                onChange={(e) => updateField('propertyName', e.target.value)}
                placeholder="e.g. Prestige Lakeside Habitat 3BHK"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={`${inputClass} ${errors.category ? 'border-red-400' : ''}`}
              >
                <option value="">Select category</option>
                {PROPERTY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className={labelClass}>Builder</label>
              <select
                value={form.builderId}
                onChange={(e) => updateField('builderId', e.target.value)}
                className={inputClass}
              >
                <option value="">None / Individual</option>
                {activeBuilders.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Area (sq ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => updateField('area', e.target.value)}
                placeholder="1200"
                className={`${inputClass} ${errors.area ? 'border-red-400' : ''}`}
              />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
            </div>

            {!isPlot && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select
                    value={form.bedrooms}
                    onChange={(e) => updateField('bedrooms', e.target.value)}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} BHK</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Bathrooms</label>
                  <select
                    value={form.bathrooms}
                    onChange={(e) => updateField('bathrooms', e.target.value)}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Plot Details (conditional) */}
          {isPlot && (
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>Plot Details</h3>

              <div>
                <label className={labelClass}>Facing</label>
                <select
                  value={form.facing}
                  onChange={(e) => updateField('facing', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select facing</option>
                  {FACING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Plot Length (ft)</label>
                  <input
                    type="number"
                    value={form.plotLength}
                    onChange={(e) => updateField('plotLength', e.target.value)}
                    placeholder="30"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Plot Width (ft)</label>
                  <input
                    type="number"
                    value={form.plotWidth}
                    onChange={(e) => updateField('plotWidth', e.target.value)}
                    placeholder="40"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Approval Type</label>
                <select
                  value={form.plotApprovalType}
                  onChange={(e) => updateField('plotApprovalType', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select approval type</option>
                  {PLOT_APPROVAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Pricing</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Price (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="5000000"
                  className={`${inputClass} ${errors.price ? 'border-red-400' : ''}`}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className={labelClass}>Deposit (INR)</label>
                <input
                  type="number"
                  value={form.deposit}
                  onChange={(e) => updateField('deposit', e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isNegotiable}
                  onChange={(e) => updateField('isNegotiable', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
                />
                Negotiable
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFurnished}
                  onChange={(e) => updateField('isFurnished', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
                />
                Furnished
              </label>
            </div>
          </div>

          {/* Location */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Location</h3>

            <div>
              <label className={labelClass}>Address Line 1</label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                placeholder="Building name, street"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Address Line 2</label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                placeholder="Landmark, area"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Zone / Locality</label>
              <select
                value={form.zone}
                onChange={(e) => updateField('zone', e.target.value)}
                className={inputClass}
              >
                <option value="">Select area</option>
                {BANGALORE_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`${inputClass} ${errors.city ? 'border-red-400' : ''}`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  placeholder="560001"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Amenities</h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Parking</label>
                <select
                  value={form.parking}
                  onChange={(e) => updateField('parking', e.target.value)}
                  className={inputClass}
                >
                  {PARKING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Water</label>
                <select
                  value={form.water}
                  onChange={(e) => updateField('water', e.target.value)}
                  className={inputClass}
                >
                  {WATER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Electricity</label>
                <select
                  value={form.electricity}
                  onChange={(e) => updateField('electricity', e.target.value)}
                  className={inputClass}
                >
                  {ELECTRICITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Photos</h3>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={src} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload images ({images.length}/{MAX_IMAGES})
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleImageAdd}
              className="hidden"
            />
          </div>

          {/* Additional */}
          <div className={sectionClass}>
            <h3 className={sectionTitleClass}>Additional</h3>

            <div>
              <label className={labelClass}>Comments</label>
              <textarea
                value={form.comments}
                onChange={(e) => updateField('comments', e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.autoApprove}
                onChange={(e) => updateField('autoApprove', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
              />
              Auto-approve this property
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
            leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
          >
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
