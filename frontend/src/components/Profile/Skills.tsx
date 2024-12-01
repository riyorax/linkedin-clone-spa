import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from 'lucide-react';

interface SkillsProps {
  skills: string;
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
          <Settings size={20} className="mr-2" />
          <span>Skills</span>
        </h3>
        <p className="text-[12px] sm:text-sm">{skills || "No skills listed yet."}</p> 
      </CardContent>
    </Card>
  );
};

export default Skills;
