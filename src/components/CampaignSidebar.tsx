import { useState } from "react";
import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  status: "active" | "completed";
  lastUpdated: string;
}

interface CampaignSidebarProps {
  isOpen: boolean;
  activeCampaignId?: string;
  onSelectCampaign: (campaignId: string) => void;
  onCreateCampaign: () => void;
  campaignCounter: number;
  completedCampaigns?: Set<string>;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Pharma Q1 Launch Campaign",
    status: "active",
    lastUpdated: "2 hours ago"
  },
  {
    id: "2", 
    title: "Medical Device Awareness",
    status: "completed",
    lastUpdated: "1 day ago"
  },
  {
    id: "3",
    title: "Digital Health Initiative",
    status: "active",
    lastUpdated: "3 days ago"
  },
  {
    id: "4",
    title: "Patient Education Series",
    status: "completed",
    lastUpdated: "1 week ago"
  }
];

export function CampaignSidebar({ isOpen, activeCampaignId, onSelectCampaign, onCreateCampaign, campaignCounter, completedCampaigns }: CampaignSidebarProps) {
  // Add new campaigns to the list dynamically (new campaigns at the top)
  const newCampaigns = campaignCounter > 4 ? Array.from({ length: campaignCounter - 4 }, (_, i) => ({
    id: (campaignCounter - i).toString(),
    title: "New Campaign",
    status: "active" as const,
    lastUpdated: "Just now"
  })) : [];
  
  const allCampaigns = [
    ...newCampaigns,
    ...mockCampaigns
  ];
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-secondary border-r border-border shadow-medium transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-80"
      )}
    >
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-foreground">Campaigns</h2>
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-2">
          {allCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign.id)}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-colors duration-200",
                "hover:bg-secondary-muted/20",
                activeCampaignId === campaign.id 
                  ? "bg-primary/10 border border-primary/20" 
                  : "bg-transparent"
              )}
            >
              <div className="flex items-start gap-3">
                <Folder className="h-5 w-5 text-secondary-foreground/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-secondary-foreground truncate">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        (completedCampaigns?.has(campaign.id) || campaign.status === "completed") && "bg-muted text-muted-foreground",
                        (!completedCampaigns?.has(campaign.id) && campaign.status === "active") && "bg-success/20 text-success-foreground"
                      )}
                    >
                      {completedCampaigns?.has(campaign.id) ? "completed" : campaign.status}
                    </span>
                    <span className="text-xs text-secondary-foreground/60">
                      {campaign.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}