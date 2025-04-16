'use client';

import { motion } from 'framer-motion';
import { Check, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BgImage from '@/components/BgImage';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Subtitles Pro',
      monthlyPrice: 15,
      yearlyPrice: 19,
      description: 'Add professional quality subtitles to your shorts, very quickly',
      features: [
        '100 subtitled shorts / month',
        'Cropping from long videos',
        '1 min 30 max per video',
        '300 MB/video',
        'Import music and sound effects',
        'B-rolls',
        'Import your own images',
        'Faceless video: 4 per week',
      ],
    },
    {
      name: 'Advanced',
      monthlyPrice: 23,
      yearlyPrice: 29,
      description: 'Turn your long-form videos into multiple shorts with a few clicks',
      features: [
        'Everything included in Subtitles Pro, plus...',
        '2 min max',
        '30 shorts from long videos per month',
        'Auto-Crop to vertical format (9:16)',
        '1GB and 2 hours / long video',
        'Import long video by local file or YouTube link',
        'Faceless video: 10 per week',
      ],
    },
    {
      name: 'Expert',
      monthlyPrice: 47,
      yearlyPrice: 59,
      description: 'Create, plan, publish and save incredible amounts of time',
      features: [
        'Everything included in Advanced, plus...',
        '3 min max',
        '100 shorts from long videos / month',
        'Program & Publish to all platforms (YouTube, TikTok, Instagram, etc)',
        'Analyze content performance',
        'Faceless video: 30 per week',
      ],
    },
  ];

  const competitorComparison = [
    { feature: 'Create unlimited clips', ourProduct: true, opusClip: false, submagic: false, klapApp: false, autoShorts: false, invideo: false },
    { feature: 'AI faceless video generator', ourProduct: true, opusClip: false, submagic: false, klapApp: false, autoShorts: false, invideo: false },
    { feature: 'Export subtitles', ourProduct: true, opusClip: true, submagic: true, klapApp: true, autoShorts: false, invideo: true },
    { feature: 'Custom thumbnail', ourProduct: true, opusClip: true, submagic: false, klapApp: true, autoShorts: false, invideo: true },
    { feature: 'Schedule videos', ourProduct: true, opusClip: false, submagic: false, klapApp: false, autoShorts: false, invideo: false },
    { feature: 'Social media video analytics', ourProduct: true, opusClip: false, submagic: false, klapApp: false, autoShorts: false, invideo: false },
    { feature: 'Translate in +50 languages', ourProduct: true, opusClip: false, submagic: false, klapApp: false, autoShorts: false, invideo: false },
  ];

  return (
    <div className='relative h-screen bg-[#010C0A] pt-6 px-2 sm:px-4 md:px-6 overflow-x-hidden'>
      <BgImage />
      <div className='relative items-center z-10'>
        <Navbar />
      </div>
      
      <div className="container relative z-10 mx-auto py-16 px-4 text-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trod starts paying for itself from day 1</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Before it earns you more money, Trod already pays for itself by saving you time, since you create 10x more content
          </p>
          
          <div className="flex flex-wrap justify-center mt-8 gap-6">
            <div className="bg-blue-900/30 px-6 py-3 rounded-lg border border-blue-500/30">
              <p className="font-semibold">Helps you earn more $$</p>
            </div>
            <div className="bg-green-900/30 px-6 py-3 rounded-lg border border-green-500/30">
              <p className="font-semibold">You create 10x more content</p>
            </div>
            <div className="bg-purple-900/30 px-6 py-3 rounded-lg border border-purple-500/30">
              <p className="font-semibold">Saves you time</p>
            </div>
            <div className="bg-yellow-900/30 px-6 py-3 rounded-lg border border-yellow-500/30">
              <p className="font-semibold">Makes you more productive</p>
            </div>
          </div>
          
          <p className="text-gray-400 mt-10">trusted by</p>
          <p className="font-bold text-2xl">1,000+ paying customers</p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 p-1 rounded-full inline-flex border border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300'
              }`}
            >
              Yearly (-20%)
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-900/40 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-700"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="ml-1 text-gray-400">/ Per Month</span>
                </div>
                
                <Link href="/sign-up">
                  <button className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition">
                    Get Started
                  </button>
                </Link>
                <p className="text-center text-sm text-gray-400 mt-2">No credit card required</p>
              </div>
              
              <div className="bg-gray-800/30 px-8 py-6">
                <p className="font-medium mb-4 text-gray-300">Features:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check size={18} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Comparison Table */}
        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare to similar products</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900/40 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden border border-gray-700">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">Feature</th>
                  <th className="px-6 py-4 text-center text-purple-400 font-bold">Trod</th>
                  <th className="px-6 py-4 text-center text-gray-300">Opus Clip</th>
                  <th className="px-6 py-4 text-center text-gray-300">Submagic</th>
                  <th className="px-6 py-4 text-center text-gray-300">Klap App</th>
                  <th className="px-6 py-4 text-center text-gray-300">AutoShorts</th>
                  <th className="px-6 py-4 text-center text-gray-300">Invideo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {competitorComparison.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-900/40'}>
                    <td className="px-6 py-4 text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.ourProduct ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.opusClip ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.submagic ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.klapApp ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.autoShorts ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.invideo ? <Check size={20} className="mx-auto text-green-400" /> : <X size={20} className="mx-auto text-red-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 text-center max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">Are You Ready to Become The Next Big Video Creator?</h2>
          <p className="text-lg text-gray-300 mb-8">Try Today for Free & Get Access to everything you need to start Multiplying Your Revenue.</p>
          
          <Link href="/sign-up">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-purple-700 transition">
              Try for free
            </button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage; 