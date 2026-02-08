"use client";

import { useState } from "react";
import { updateLeadStage } from "@/actions/leads";

interface Lead {
  id: string;
  name: string;
  company: string | null;
  value: number | null;
  score: number;
  stage: string;
}

interface LeadKanbanProps {
  leads: Lead[];
  stages: string[];
}

const stageColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  CONTACTED: "bg-purple-50 text-purple-700 border-purple-200",
  QUALIFIED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PROPOSAL: "bg-yellow-50 text-yellow-700 border-yellow-200",
  NEGOTIATION: "bg-orange-50 text-orange-700 border-orange-200",
  WON: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LOST: "bg-red-50 text-red-700 border-red-200",
};

export function LeadKanban({ leads, stages }: LeadKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
    setDraggingId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    setDraggingId(null);
    setDragOverStage(null);

    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.stage !== newStage) {
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("stage", newStage);
      await updateLeadStage(formData);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-7 overflow-x-auto">
      {stages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        const isDragOver = dragOverStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
            className={`rounded-md border p-4 min-h-[400px] transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5 border-dashed border-2"
                : "border-border bg-muted/50"
            }`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
              <div className="text-xs text-muted-foreground mt-1">
                {stageLeads.length} leads
              </div>
            </div>
            <div className="space-y-3">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  className={`rounded-md border p-3 shadow-sm cursor-grab active:cursor-grabbing transition-all ${
                    stageColors[stage] || "bg-white border-border"
                  } ${
                    draggingId === lead.id
                      ? "opacity-50 scale-95"
                      : "hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {lead.name}
                  </div>
                  {lead.company && (
                    <div className="text-xs text-muted-foreground">
                      {lead.company}
                    </div>
                  )}
                  {lead.value && (
                    <div className="text-xs text-emerald-600 mt-2 font-medium">
                      ${lead.value.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <div className="text-xs text-muted-foreground">Score:</div>
                    <div className="text-xs font-semibold text-indigo-600">
                      {lead.score}/100
                    </div>
                  </div>
                </div>
              ))}
              {stageLeads.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border rounded-md">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
