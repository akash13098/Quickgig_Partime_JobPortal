import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { JobCard } from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobsPage() {
  const { jobs } = useApp();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState('all');
  const [shift, setShift] = useState('all');
  const [category, setCategory] = useState('all');
  const [payRange, setPayRange] = useState([0, 2000]);
  const [urgentOnly, setUrgentOnly] = useState(searchParams.get('urgent') === 'true');

  const cities = [...new Set(jobs.map(j => j.city))];
  const categories = [...new Set(jobs.map(j => j.category))];
  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible'];

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      if (j.status !== 'active') return false;
      if (query && !j.title.toLowerCase().includes(query.toLowerCase()) && !j.location.toLowerCase().includes(query.toLowerCase()) && !j.category.toLowerCase().includes(query.toLowerCase())) return false;
      if (city !== 'all' && j.city !== city) return false;
      if (shift !== 'all' && j.shift !== shift) return false;
      if (category !== 'all' && j.category !== category) return false;
      if (j.pay < payRange[0] || j.pay > payRange[1]) return false;
      if (urgentOnly && !j.urgent) return false;
      return true;
    });
  }, [jobs, query, city, shift, category, payRange, urgentOnly]);

  const clearFilters = () => {
    setCity('all'); setShift('all'); setCategory('all'); setPayRange([0, 2000]); setUrgentOnly(false);
  };

  const hasFilters = city !== 'all' || shift !== 'all' || category !== 'all' || urgentOnly || payRange[0] > 0 || payRange[1] < 2000;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, location, or category..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-[10px]">!</Badge>}
          </Button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-card border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Shift</label>
                  <Select value={shift} onValueChange={setShift}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shifts</SelectItem>
                      {shifts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Pay Range: ₹{payRange[0]} - ₹{payRange[1]}</label>
                  <Slider value={payRange} onValueChange={setPayRange} min={0} max={2000} step={50} className="mt-3" />
                </div>
                <div className="flex items-center gap-4 sm:col-span-2 md:col-span-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={urgentOnly} onChange={e => setUrgentOnly(e.target.checked)} className="rounded" />
                    <span className="text-sm text-foreground">Urgent hiring only</span>
                  </label>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-sm text-primary flex items-center gap-1 hover:underline">
                      <X className="w-3 h-3" /> Clear filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} jobs found</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-muted-foreground">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
