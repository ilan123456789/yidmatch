"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Job, DailyJob } from "@/types";
import { JobCard } from "@/components/JobCard";
import { DailyJobCard } from "@/components/DailyJobCard";
import { NEIGHBORHOOD_OPTIONS, HEIMISH_PERK_OPTIONS } from "@/lib/seed-data";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  PlusCircle,
  Building,
  ShieldCheck,
  Check
} from "lucide-react";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dailyJobs, setDailyJobs] = useState<DailyJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All Locations");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedPerk, setSelectedPerk] = useState<string | null>(null);

  // Fetch jobs
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.set("search", searchQuery);
        if (selectedNeighborhood !== "All Locations") queryParams.set("neighborhood", selectedNeighborhood);
        if (selectedJobType !== "All Types") queryParams.set("jobType", selectedJobType);
        if (selectedPerk) queryParams.set("perk", selectedPerk);

        const [jobsRes, dailyRes] = await Promise.all([
          fetch(`/api/jobs?${queryParams.toString()}`),
          fetch("/api/daily-jobs")
        ]);

        const jobsData = await jobsRes.json();
        const dailyData = await dailyRes.json();

        if (jobsData.jobs) setJobs(jobsData.jobs);
        if (dailyData.dailyJobs) setDailyJobs(dailyData.dailyJobs.slice(0, 3)); // spotlight top 3
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchQuery, selectedNeighborhood, selectedJobType, selectedPerk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-navyLight relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-brand-navyLight/80 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>The Premier Job Board for the Heimish Community</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connecting Heimish Talent with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
              Trusted Jewish Employers
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover career opportunities with Shomer Shabbos flexibility, Minyan on-site, kosher environments, or pick up same-day urgent daily gigs.
          </p>

          {/* Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white p-2 sm:p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2 border border-slate-200 text-slate-800"
          >
            {/* Job title / keyword */}
            <div className="flex items-center space-x-2 px-3 py-2 w-full md:flex-1 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-5 h-5 text-brand-blue shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Neighborhood Dropdown */}
            <div className="flex items-center space-x-2 px-3 py-2 w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200">
              <MapPin className="w-5 h-5 text-brand-blue shrink-0" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full text-sm outline-none bg-transparent font-medium text-slate-700 cursor-pointer"
              >
                {NEIGHBORHOOD_OPTIONS.map((loc) => (
                  <option key={loc} value={loc} className="text-slate-900">{loc}</option>
                ))}
              </select>
            </div>

            {/* Job Type Dropdown */}
            <div className="flex items-center space-x-2 px-3 py-2 w-full md:w-44">
              <Briefcase className="w-5 h-5 text-brand-blue shrink-0" />
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full text-sm outline-none bg-transparent font-medium text-slate-700 cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              className="w-full md:w-auto bg-brand-navy hover:bg-brand-blue text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Perk Filters Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs text-slate-400 font-medium flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Heimish Filters:
            </span>
            {HEIMISH_PERK_OPTIONS.slice(0, 5).map((perk) => {
              const active = selectedPerk === perk;
              return (
                <button
                  key={perk}
                  onClick={() => setSelectedPerk(active ? null : perk)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition flex items-center space-x-1 ${
                    active 
                      ? "bg-brand-gold text-slate-950 font-bold" 
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  <span>{perk}</span>
                </button>
              );
            })}
            {selectedPerk && (
              <button
                onClick={() => setSelectedPerk(null)}
                className="text-xs text-rose-400 hover:underline px-2 py-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Urgent Daily Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-2 border-amber-300/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>URGENT</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Daily Jobs & Same-Day Gigs
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Quick cash gigs needed today or tonight (Bar Mitzvah/Wedding staff, drivers, emergency packing & temp help).
              </p>
            </div>

            <Link
              href="/daily-jobs"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-4 py-2 rounded-xl transition shadow-sm shrink-0 self-start sm:self-auto"
            >
              <span>View All Same-Day Gigs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Spotlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dailyJobs.map((dj) => (
              <DailyJobCard key={dj.id} job={dj} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Standard Jobs Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Latest Heimish Career Listings
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Showing {jobs.length} open position{jobs.length === 1 ? "" : "s"} across Orthodox Jewish communities
            </p>
          </div>

          {/* Quick CTA to post */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500 hidden sm:inline">Are you hiring?</span>
            <Link
              href="/post-job"
              className="inline-flex items-center space-x-2 bg-brand-blue hover:bg-brand-blueHover text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job for $25</span>
            </Link>
          </div>
        </div>

        {/* Listings Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-6 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No jobs match your current search</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords, clearing your location filters, or checking back soon.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedNeighborhood("All Locations");
                setSelectedJobType("All Types");
                setSelectedPerk(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Employer Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyLight rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Employer Solution
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Hire Reliable Heimish Candidates with <span className="text-brand-blue">YID MATCH</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Post your job opening for just <strong>$25</strong> with secure Stripe payment. Get direct candidate resume submissions, track applicants in your dashboard, and fill your vacancy fast.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>30-Day Active Listing</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Candidate Resume Management</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>No Hidden Fees</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/post-job"
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-blue to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post a Job Listing — $25</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
