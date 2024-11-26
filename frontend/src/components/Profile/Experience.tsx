import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from 'lucide-react';

interface ExperienceProps {
  work_history: { role: string; company: string; duration: string }[];
}

const Experience: React.FC<ExperienceProps> = ({ work_history }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Experience</h3>
        {work_history.map((job, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center">
              <Briefcase size={20} className="mr-2" />
              <div>
                <h4 className="font-semibold">{job.role}</h4>
                <p className="text-muted-foreground">{job.company} • {job.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Experience;

