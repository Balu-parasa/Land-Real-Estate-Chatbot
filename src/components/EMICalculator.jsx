import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, IndianRupee } from 'lucide-react';
import { formatPrice } from '@/lib/utils';



const EMICalculator = ({ defaultPrice = 1000000 }) => {
  const [landPrice, setLandPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);

  React.useEffect(() => {
    setLandPrice(defaultPrice);
  }, [defaultPrice]);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const principal = landPrice - (landPrice * downPayment / 100);
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;

    if (monthlyRate === 0) {
      const emi = principal / months;
      return { emi, totalInterest: 0, totalAmount: principal };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return { emi, totalInterest, totalAmount };
  }, [landPrice, downPayment, interestRate, tenureYears]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-secondary" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm">Land Price</Label>
          <Input
            type="number"
            value={landPrice}
            onChange={(e) => setLandPrice(Number(e.target.value))}
            className="text-lg font-semibold"
          />
          <Slider
            value={[landPrice]}
            onValueChange={([v]) => setLandPrice(v)}
            min={100000}
            max={defaultPrice}
            step={100000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(100000)}</span>
            <span>{formatPrice(defaultPrice)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm">Down Payment: {downPayment}%</Label>
          <Slider
            value={[downPayment]}
            onValueChange={([v]) => setDownPayment(v)}
            min={0}
            max={90}
            step={5}
          />
          <p className="text-xs text-muted-foreground">
            Amount: {formatPrice(landPrice * downPayment / 100)}
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm">Interest Rate: {interestRate}%</Label>
          <Slider
            value={[interestRate]}
            onValueChange={([v]) => setInterestRate(v)}
            min={5}
            max={20}
            step={0.5}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm">Loan Tenure: {tenureYears} years</Label>
          <Slider
            value={[tenureYears]}
            onValueChange={([v]) => setTenureYears(v)}
            min={1}
            max={30}
            step={1}
          />
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Monthly EMI</span>
            <span className="text-2xl font-bold text-secondary">
              {formatPrice(Math.round(emi))}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Loan Amount</span>
            <span className="font-medium">{formatPrice(landPrice - (landPrice * downPayment / 100))}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-medium text-amber-500">{formatPrice(Math.round(totalInterest))}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Payment</span>
            <span className="font-medium">{formatPrice(Math.round(totalAmount))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMICalculator;
