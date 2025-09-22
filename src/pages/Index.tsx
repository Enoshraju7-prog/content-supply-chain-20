import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { MainEditor } from "@/components/MainEditor";
import { ProgressTracker, ProgressStep } from "@/components/ProgressTracker";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string>("1");
  const [campaignCounter, setCampaignCounter] = useState(4);
  const [completedCampaigns, setCompletedCampaigns] = useState<Set<string>>(new Set());
  const [currentProgress, setCurrentProgress] = useState<ProgressStep[]>([
    { id: "theme", title: "Theme Creation", status: "pending" },
    { id: "content", title: "Content Generation and Editing", status: "pending" },
    { id: "mlr", title: "MLR Checks", status: "pending" },
    { id: "veeva", title: "Veeva Vault Approval", status: "pending" },
    { id: "salesforce", title: "Salesforce Activation", status: "pending" },
    { id: "launch", title: "Campaign Launch", status: "pending" }
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectCampaign = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateCampaign = () => {
    const newCampaignId = (campaignCounter + 1).toString();
    setCampaignCounter(prev => prev + 1);
    setActiveCampaignId(newCampaignId);
    // Reset progress for new campaign
    setCurrentProgress([
      { id: "theme", title: "Theme Creation", status: "pending" },
      { id: "content", title: "Content Generation and Editing", status: "pending" },
      { id: "mlr", title: "MLR Checks", status: "pending" },
      { id: "veeva", title: "Veeva Vault Approval", status: "pending" },
      { id: "salesforce", title: "Salesforce Activation", status: "pending" },
      { id: "launch", title: "Campaign Launch", status: "pending" }
    ]);
    // Close sidebar on mobile after creation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleProgressUpdate = (steps: ProgressStep[]) => {
    setCurrentProgress(steps);
  };

  const handleCampaignComplete = (campaignId: string) => {
    setCompletedCampaigns(prev => new Set([...prev, campaignId]));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopBar onToggleSidebar={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Campaigns Sidebar */}
        <CampaignSidebar
          isOpen={isSidebarOpen}
          activeCampaignId={activeCampaignId}
          onSelectCampaign={handleSelectCampaign}
          onCreateCampaign={handleCreateCampaign}
          campaignCounter={campaignCounter}
          completedCampaigns={completedCampaigns}
        />
        
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex transition-all duration-300",
          isSidebarOpen && "lg:ml-80"
        )}>
          {/* Chat Interface */}
          <MainEditor 
            campaignId={activeCampaignId} 
            onProgressUpdate={handleProgressUpdate}
            onCampaignComplete={handleCampaignComplete}
          />
          
          {/* Progress Tracker */}
          <ProgressTracker steps={currentProgress} />
        </div>
      </div>
    </div>
  );
};

export default Index;
