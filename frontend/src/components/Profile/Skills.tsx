import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SkillsProps {
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills;

