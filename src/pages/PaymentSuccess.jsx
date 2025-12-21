import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/80">Your mock transaction has been completed</p>
          </div>

          <CardContent className="p-8 space-y-6 text-center">
            <p className="text-muted-foreground">
              Thank you for testing the booking flow. Since this is a demo environment, no actual payment was processed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="gold"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSuccess;
