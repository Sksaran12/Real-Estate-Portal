import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Anupam Barua',
      role: 'Home Buyer • GS Road, Guwahati',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment:
        'Finding a verified 3BHK flat on GS Road was so easy on EstateHub. The AI chat widget helped us filter properties under ₹90 Lakhs instantly!',
      rating: 5,
    },
    {
      name: 'Priyanka Gogoi',
      role: 'Property Owner • Zoo Road, Guwahati',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      comment:
        'As a landlord listing flats in Beltola and Zoo Road, the AI description generator saved me hours while bringing genuine buyer inquiries.',
      rating: 5,
    },
    {
      name: 'Rahul Sarma',
      role: 'Commercial Tenant • Christian Basti, Guwahati',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment:
        'Direct owner communication without broker commissions made renting our tech office in Guwahati seamless and completely transparent.',
      rating: 5,
    },
  ];

  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Client Experiences</span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trusted By Home Buyers & Owners in Assam</h2>
        <p className="text-sm text-slate-500">Over 5,000+ satisfied clients bought, sold, or rented properties on EstateHub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <Quote className="w-12 h-12 text-brand-100 absolute top-4 right-4 pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic font-normal">"{t.comment}"</p>
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-slate-100 relative z-10">
              <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1">
                  <span>{t.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </h4>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
