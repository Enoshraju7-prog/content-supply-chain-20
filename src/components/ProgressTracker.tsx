import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type ProgressStatus = "pending" | "in-progress" | "completed";

export interface ProgressStep {
  id: string;
  title: string;
  status: ProgressStatus;
}

interface ProgressTrackerProps {
  steps?: ProgressStep[];
}

const defaultSteps: ProgressStep[] = [
  {
    id: "theme",
    title: "Theme Creation", 
    status: "completed"
  },
  {
    id: "content",
    title: "Content Generation and Editing",
    status: "completed"
  },
  {
    id: "mlr",
    title: "MLR Checks",
    status: "in-progress"
  },
  {
    id: "veeva",
    title: "Veeva Vault Approval",
    status: "pending"
  },
  {
    id: "salesforce",
    title: "Salesforce Activation",
    status: "pending"
  },
  {
    id: "launch",
    title: "Campaign Launch",
    status: "pending"
  }
];

export function ProgressTracker({ steps = defaultSteps }: ProgressTrackerProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Check if campaign is completed (all steps are completed)
  const isCompleted = steps.every(step => step.status === "completed");
  
  useEffect(() => {
    if (isCompleted && steps.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // Show for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isCompleted, steps.length]);

  return (
    <aside className="w-80 bg-card border-l border-border shadow-soft h-[calc(100vh-4rem)]">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Campaign Progress</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track your Campaign lifecycle
        </p>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {/* Completed Progress Line */}
          <div 
            className="absolute left-6 top-0 w-0.5 bg-success transition-all duration-500"
            style={{ 
              height: `${(steps.filter(step => step.status === "completed").length / steps.length) * 100}%` 
            }}
          ></div>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Progress Node */}
                <div className={cn(
                  "relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-soft transition-all duration-300",
                  step.status === "completed" && "bg-success border-success",
                  step.status === "in-progress" && "bg-warning border-warning animate-pulse-orange",
                  step.status === "pending" && "bg-card border-pending"
                )}>
                  {step.status === "completed" ? (
                    <Check className="h-5 w-5 text-success-foreground" />
                  ) : (
                    <span className={cn(
                      "text-sm font-semibold",
                      step.status === "in-progress" && "text-warning-foreground",
                      step.status === "pending" && "text-pending-foreground"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                 {/* Step Content */}
                <div className="flex-1 pt-2 relative">
                  <h3 className={cn(
                    "font-medium text-sm leading-tight",
                    step.status === "completed" && "text-foreground",
                    step.status === "in-progress" && "text-foreground",
                    step.status === "pending" && "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-xs mt-1 capitalize",
                    step.status === "completed" && "text-success",
                    step.status === "in-progress" && "text-warning",
                    step.status === "pending" && "text-pending"
                  )}>
                    {step.status === "in-progress" ? "In Progress" : step.status}
                  </p>
                  
                  {/* Confetti Animation for Campaign Launch */}
                  {showConfetti && step.id === "launch" && (
                    <div className="absolute -right-4 -top-2 pointer-events-none">
                      <div className="confetti-container">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "absolute w-2 h-2 rounded-full animate-confetti",
                              i % 4 === 0 && "bg-success",
                              i % 4 === 1 && "bg-primary", 
                              i % 4 === 2 && "bg-warning",
                              i % 4 === 3 && "bg-accent"
                            )}
                            style={{
                              left: `${Math.random() * 40}px`,
                              animationDelay: `${i * 100}ms`,
                              animationDuration: `${1000 + Math.random() * 1000}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}