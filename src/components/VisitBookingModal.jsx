import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';



const VisitBookingModal = ({ property, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Book Site Visit
          </DialogTitle>
          <DialogDescription>
            Visit booking is currently unavailable upgrade our systems.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="gold">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitBookingModal;
