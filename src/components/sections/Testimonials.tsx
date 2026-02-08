import { Container } from '@/components/layout';
import { Card } from '@/components/ui';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    initials: 'PS',
    color: 'bg-rose-500',
    role: 'Software Engineer',
    location: 'Bangalore',
    rating: 5,
    text: 'Found my dream apartment within a week! The verified listings gave me confidence, and the owner was exactly as described. Highly recommend Bharat Bhoomi-99.',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    initials: 'RV',
    color: 'bg-blue-500',
    role: 'Business Owner',
    location: 'Mumbai',
    rating: 5,
    text: 'As a property owner, listing my properties here has been incredibly easy. The tenant inquiries are genuine, and the process is completely transparent.',
  },
  {
    id: 3,
    name: 'Anita Reddy',
    initials: 'AR',
    color: 'bg-emerald-500',
    role: 'Marketing Manager',
    location: 'Hyderabad',
    rating: 5,
    text: 'The filter options made it so easy to find exactly what I was looking for. Moved into my new home in just two weeks. Amazing experience!',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy tenants and property owners who found their perfect match.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} padding="lg" className="relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`${testimonial.color} h-12 w-12 rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
