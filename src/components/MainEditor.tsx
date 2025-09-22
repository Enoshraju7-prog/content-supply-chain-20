import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./MessageCard";
import { ChatInput } from "./ChatInput";
import { ProgressStep, ProgressStatus } from "./ProgressTracker";

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: string;
}

interface MainEditorProps {
  campaignId?: string;
  onProgressUpdate?: (steps: ProgressStep[]) => void;
  onCampaignComplete?: (campaignId: string) => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    type: "agent",
    content: "Welcome to your Pharma Q1 Launch Campaign! I'm here to help you create compelling, compliant content for your pharmaceutical launch. What type of content would you like to develop first?",
    timestamp: "10:30 AM"
  },
  {
    id: "2", 
    type: "user",
    content: "I need to create a medical education series for healthcare professionals about our new diabetes medication. The content should be evidence-based and suitable for both endocrinologists and primary care physicians.",
    timestamp: "10:32 AM"
  },
  {
    id: "3",
    type: "agent", 
    content: "Excellent! I'll help you develop a comprehensive medical education series. Based on your requirements, I suggest we create:\n\n1. Clinical efficacy overview with trial data\n2. Safety profile and contraindications\n3. Patient selection criteria\n4. Practical prescribing guidelines\n\nWould you like me to start with the clinical efficacy content? I'll ensure all materials meet regulatory requirements and include proper references.",
    timestamp: "10:33 AM"
  }
];

export function MainEditor({ campaignId, onProgressUpdate, onCampaignComplete }: MainEditorProps) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: "theme", title: "Theme Creation", status: "pending" },
    { id: "content", title: "Content Generation and Editing", status: "pending" },
    { id: "mlr", title: "MLR Checks", status: "pending" },
    { id: "veeva", title: "Veeva Vault Approval", status: "pending" },
    { id: "salesforce", title: "Salesforce Activation", status: "pending" },
    { id: "launch", title: "Campaign Launch", status: "pending" }
  ]);

  // Initialize messages for campaigns
  const currentMessages = messages[campaignId || "1"] || (campaignId === "1" ? mockMessages : [
    {
      id: "welcome",
      type: "agent",
      content: "Welcome to your new campaign! I'm here to help you create compelling, compliant content. What type of content would you like to develop? Please share your campaign objectives, target audience, and any specific requirements.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const updateProgress = (message: string, isAIResponse: boolean = false) => {
    const lowerMessage = message.toLowerCase().trim();
    
    setProgressSteps(prev => {
      const newSteps = [...prev];
      
      if (lowerMessage.includes("what new content should i create for oncologists for product x")) {
        // 1st node yellow
        newSteps[0] = { ...newSteps[0], status: "in-progress" };
      } else if (lowerMessage.includes("generate email content for 4th moa concept")) {
        // 2nd node yellow, 1st green
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "in-progress" };
      } else if (lowerMessage.includes("okay now it looks fine. proceed with mlr checks")) {
        // 3rd node yellow, 1st-2nd green
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "completed" };
        newSteps[2] = { ...newSteps[2], status: "in-progress" };
      } else if (lowerMessage.includes("is my content approved on the veeva vault")) {
        // 4th node yellow, 1st-3rd green
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "completed" };
        newSteps[2] = { ...newSteps[2], status: "completed" };
        newSteps[3] = { ...newSteps[3], status: "in-progress" };
      } else if (lowerMessage.includes("target hcp's who engaged with moa content")) {
        // 5th node yellow, 1st-4th green
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "completed" };
        newSteps[2] = { ...newSteps[2], status: "completed" };
        newSteps[3] = { ...newSteps[3], status: "completed" };
        newSteps[4] = { ...newSteps[4], status: "in-progress" };
      } else if (lowerMessage.includes("ok i have used above data and prepared campaign, please provide approval to launch the campaign")) {
        // 6th node yellow, 1st-5th green
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "completed" };
        newSteps[2] = { ...newSteps[2], status: "completed" };
        newSteps[3] = { ...newSteps[3], status: "completed" };
        newSteps[4] = { ...newSteps[4], status: "completed" };
        newSteps[5] = { ...newSteps[5], status: "in-progress" };
      } else if (isAIResponse && lowerMessage.includes("yes, the content uploaded on the veeva vault has been approved")) {
        // 4th node green when AI confirms approval
        newSteps[0] = { ...newSteps[0], status: "completed" };
        newSteps[1] = { ...newSteps[1], status: "completed" };
        newSteps[2] = { ...newSteps[2], status: "completed" };
        newSteps[3] = { ...newSteps[3], status: "completed" };
      } else if (isAIResponse && lowerMessage.includes("campaign launched")) {
        // All nodes green
        newSteps.forEach((step, index) => {
          newSteps[index] = { ...step, status: "completed" };
        });
        // Mark campaign as complete
        if (campaignId && onCampaignComplete) {
          onCampaignComplete(campaignId);
        }
      }
      
      return newSteps;
    });
  };

  const getHardcodedResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase().trim();
    
    if (message.includes("what new content should i create for oncologists for product x")) {
      return "1. Safety First, Always – Confident prescribing with clear safety guidance.\n2. Simple Dosing Rules – Clear steps for missed doses, no guesswork.\n3. Flexibility in Care – Adjust dosing when liver enzymes rise.\n4. Personalized Therapy – Tailor treatment to each patient's needs.\n5. Confidence Through Clarity – Straightforward, evidence-based guidance.\n6. Keep Patients on Track – Minimize interruptions, maximize continuity.";
    }
    
    if (message.includes("generate email content for 4th moa concept")) {
      return "Subject: Personalized Therapy using Product X\nBrand: Product X\nBody: Dear Healthcare Professional,Every patient is unique. ProductX empowers you to tailor therapy based on individual patient needs and biomarkers. Our clinical evidence demonstrates improved outcomes when therapy is personalized. With ProductX, you can:\n• Reduce side effects through personalization\n• Improve adherence and outcomes\nTake the next step in patient-centered care with ProductX.";
    }
    
    if (message.includes("can you please include thank you at the last")) {
      return "Subject: Personalized Therapy using Product X\nBrand: Product X\nBody: Dear Healthcare Professional,Every patient is unique. ProductX empowers you to tailor therapy based on individual patient needs and biomarkers. Our clinical evidence demonstrates improved outcomes when therapy is personalized. With ProductX, you can:\n• Reduce side effects through personalization\n• Improve adherence and outcomes\nTake the next step in patient-centered care with ProductX.\n \nThank you.";
    }
    
    if (message.includes("okay now it looks fine. proceed with mlr checks")) {
      return "Medical Review:\n- Compliant\n\nRegulatory Review:\n- Approved\n\nLegal Review:\n- Approved";
    }
    
    if (message.includes("is my content approved on the veeva vault")) {
      return "Yes, the content uploaded on the Veeva Vault has been approved manually by an MLR approver.";
    }
    
    if (message.includes("target hcp's who engaged with moa content")) {
      return "List of appropriate HCPs for MoA content prepared";
    }
    
    if (message.includes("use the approved moa email and hcp audience to create a campaign")) {
      return "Ok i have used above data and prepared campaign, Please provide approval to launch the campaign";
    }
    
    if (message.includes("approved")) {
      return "Campaign Launched";
    }
    
    return null;
  };

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [campaignId || "1"]: [...currentMessages, newUserMessage]
    }));
    setIsLoading(true);

    // Update progress based on user message
    updateProgress(content);

    // Check for hardcoded responses first
    const hardcodedResponse = getHardcodedResponse(content);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: hardcodedResponse || "Thank you for your input! I'm processing your request and will generate the appropriate content while ensuring compliance with all regulatory guidelines. This may take a moment while I review the latest clinical data and regulatory requirements.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Check if AI response should trigger progress update
      updateProgress(agentResponse.content, true);

      setMessages(prev => ({
        ...prev,
        [campaignId || "1"]: [...(prev[campaignId || "1"] || currentMessages), agentResponse]
      }));
      setIsLoading(false);
    }, 1500);
  };

  // Update parent component with progress changes
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(progressSteps);
    }
  }, [progressSteps, onProgressUpdate]);

  // Auto-scroll to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto">
          {currentMessages.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start a New Campaign
                </h3>
                <p className="text-muted-foreground">
                  Describe your content requirements to begin the supply chain process.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {currentMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <MessageCard
                  type="agent"
                  content="Processing your request..."
                  timestamp="..."
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Status Message */}
      {isLoading && (
        <div className="px-4 py-2 text-sm text-muted-foreground text-center">
          ✓ Message sent successfully - AI is processing your request...
        </div>
      )}

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="Describe your content requirements..."
      />
    </div>
  );
}