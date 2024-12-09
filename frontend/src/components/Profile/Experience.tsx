import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from 'lucide-react';

interface ExperienceProps {
  experience: string;
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  return (
    <Card className="overflow-hidden shadow-none border-gray-300 border my-1">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
          <Briefcase size={20} className="mr-2" />
          <span>Experience</span>
        </h3>
        <p className="text-[12px] sm:text-sm">{experience || "No experience listed yet."}</p>
      </CardContent>
    </Card>
  );
};

export default Experience;
