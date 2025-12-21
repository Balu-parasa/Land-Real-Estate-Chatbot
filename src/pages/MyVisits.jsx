import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyVisits = () => {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center flex-col bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">My Visits Coming Soon</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          We are enhancing the visit scheduling experience. You will soon be able to book and manage property visits directly here.
        </p>
        <Button variant="gold" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default MyVisits;
