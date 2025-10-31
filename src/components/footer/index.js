import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-slate-800 rounded-t-3xl">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12">
            
          <div className="max-w-sm">
            <Link href="/" className="text-2xl font-bold text-white">
              HireHub
            </Link>
            <p className="mt-4 text-slate-400">
              A comprehensive web dashboard bridging the gap between students, companies, and placement departments.
            </p>
          </div>

          {/* Navigation Links Group (Right Side) */}
          <div className="flex flex-wrap gap-12">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">For Job Seekers</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="/jobs" className="text-slate-400 hover:text-white transition-colors">Find a Job</Link></li>
                <li><Link href="/companies" className="text-slate-400 hover:text-white transition-colors">Browse Companies</Link></li>
                <li><Link href="/activity" className="text-slate-400 hover:text-white transition-colors">Your Activity</Link></li>
                <li><Link href="/account" className="text-slate-400 hover:text-white transition-colors">Account Settings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">For Employers</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="/jobs" className="text-slate-400 hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="/account" className="text-slate-400 hover:text-white transition-colors">Manage Applicants</Link></li>
                <li><Link href="/membership" className="text-slate-400 hover:text-white transition-colors">Membership</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
              <ul role="list" className="mt-4 space-y-2">
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Socials */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm leading-5 text-slate-400 md:order-1 order-2 mt-4 md:mt-0">
            &copy; 2025 HireHub. All rights reserved.
          </p>
          <div className="flex space-x-6 md:order-2 order-1">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}