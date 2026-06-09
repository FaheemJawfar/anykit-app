"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Mail, Copy, CheckCircle2, RotateCcw, Send, Briefcase, UserPlus, MessageSquare, LogOut, Sparkles } from "lucide-react";

type EmailTemplate = "resignation" | "salary_increase" | "job_application" | "meeting" | "follow_up" | "project_proposal" | "networking" | "recommendation" | "out_of_office" | "formal_apology" | "payment_reminder";

interface TemplateConfig { label: string; icon: React.ReactNode; subject: string; body: string; fields: string[]; }

const TEMPLATES: Record<EmailTemplate, TemplateConfig> = {
  resignation: { label: "Resignation", icon: <LogOut className="w-4 h-4" />, subject: "Resignation - [Your Name]", body: "Dear [Manager Name],\n\nPlease accept this email as formal notification that I am resigning from my position as [Job Title] at [Company Name]. My last day will be [Last Day].\n\nI want to thank you for the opportunity to have worked in the position for the past [Duration]. I've enjoyed my time here and appreciate the support provided during my tenure.\n\nDuring my final weeks, I am committed to ensuring a smooth transition of my responsibilities. Please let me know how I can best assist with this process.\n\nSincerely,\n[Your Name]", fields: ["Your Name", "Manager Name", "Job Title", "Company Name", "Last Day", "Duration"] },
  salary_increase: { label: "Salary Increase", icon: <Send className="w-4 h-4" />, subject: "Salary Review Request - [Your Name]", body: "Dear [Manager Name],\n\nI am writing to formally request a review of my current salary as [Job Title]. Since my last review, I have successfully [Achievement 1] and [Achievement 2].\n\nGiven these contributions and my commitment to the team's success, I would appreciate the opportunity to discuss a salary adjustment that reflects my current responsibilities and market value.\n\nI look forward to discussing this further with you.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Manager Name", "Job Title", "Achievement 1", "Achievement 2"] },
  job_application: { label: "Job Application", icon: <Briefcase className="w-4 h-4" />, subject: "Application for [Job Title] - [Your Name]", body: "Dear [Hiring Manager Name],\n\nI am writing to express my strong interest in the [Job Title] position at [Company Name] as advertised on [Platform].\n\nWith my background in [Primary Skill] and experience in [Specific Industry], I am confident that I can contribute significantly to your team. My key achievements include [Major Achievement].\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my skills align with your needs.\n\nBest regards,\n[Your Name]\n[Phone Number]", fields: ["Your Name", "Hiring Manager Name", "Job Title", "Company Name", "Platform", "Primary Skill", "Specific Industry", "Major Achievement", "Phone Number"] },
  meeting: { label: "Meeting Request", icon: <MessageSquare className="w-4 h-4" />, subject: "Meeting Request: [Topic]", body: "Dear [Recipient Name],\n\nI would like to request a meeting to discuss [Topic]. I am available on [Date] at [Time], or alternatively [Alternative Date/Time].\n\nPlease let me know if any of these times work for you, or feel free to suggest another time that is more convenient.\n\nI look forward to our discussion.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Recipient Name", "Topic", "Date", "Time", "Alternative Date/Time"] },
  follow_up: { label: "Follow-up", icon: <UserPlus className="w-4 h-4" />, subject: "Follow-up: [Previous Topic]", body: "Dear [Recipient Name],\n\nI hope this email finds you well. I am following up on our previous discussion regarding [Previous Topic].\n\nI wanted to check if there are any updates or if there's anything else you need from my side to move forward.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Recipient Name", "Previous Topic"] },
  project_proposal: { label: "Project Proposal", icon: <Briefcase className="w-4 h-4" />, subject: "Proposal: [Project Name] - [Your Company/Team]", body: "Dear [Decision Maker Name],\n\nI am pleased to submit this proposal for [Project Name]. Having analyzed the requirements for [Business Need], we believe that our approach to [Specific Solution] will deliver significant value.\n\nKey benefits of this proposal include:\n- [Benefit 1]\n- [Benefit 2]\n\nI have attached the full project brief and timeline for your review. I would appreciate the opportunity to discuss this proposal in more detail.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Decision Maker Name", "Project Name", "Business Need", "Specific Solution", "Benefit 1", "Benefit 2"] },
  networking: { label: "Networking", icon: <UserPlus className="w-4 h-4" />, subject: "Inquiry from [Your Name] regarding [Common Interest]", body: "Dear [Recipient Name],\n\nI hope you're having a great week. I've been following your work in [Industry/Field] and was particularly impressed by [Specific Project/Article].\n\nAs someone also working in [Your Field], I would love to connect and perhaps pick your brain about [Specific Topic] sometime. If you're open to it, I'd love to buy you a coffee or jump on a quick 15-minute call.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Recipient Name", "Industry/Field", "Specific Project/Article", "Your Field", "Specific Topic"] },
  recommendation: { label: "Recommendation", icon: <CheckCircle2 className="w-4 h-4" />, subject: "Letter of Recommendation - [Candidate Name]", body: "To Whom It May Concern,\n\nIt is my pleasure to recommend [Candidate Name] for [Position/Program]. I have had the opportunity to work with [Candidate Name] for [Duration] in my capacity as [Your Title] at [Company Name].\n\n[Candidate Name] consistently demonstrated [Key Quality] and was responsible for [Key Achievement]. I am confident that they will be a valuable asset to your organization.\n\nSincerely,\n[Your Name]", fields: ["Your Name", "Candidate Name", "Position/Program", "Duration", "Your Title", "Company Name", "Key Quality", "Key Achievement"] },
  out_of_office: { label: "Out of Office", icon: <LogOut className="w-4 h-4" />, subject: "Out of Office: [Your Name] until [Return Date]", body: "Hi there,\n\nThank you for your email. I am currently out of the office starting from [Start Date] and will be returning on [Return Date].\n\nI will have limited access to email during this time. For urgent matters, please contact [Alternative Contact Name] at [Alternative Contact Email]. Otherwise, I will respond to your message as soon as possible upon my return.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Start Date", "Return Date", "Alternative Contact Name", "Alternative Contact Email"] },
  formal_apology: { label: "Formal Apology", icon: <MessageSquare className="w-4 h-4" />, subject: "Formal Apology: [Incident/Issue]", body: "Dear [Recipient Name],\n\nPlease accept my sincere apologies for [Incident/Issue] that occurred on [Date]. I understand that this has caused [Impact/Inconvenience].\n\nI take full responsibility for this situation and have taken the following steps to ensure it doesn't happen again: [Corrective Action].\n\nThank you for your patience and understanding.\n\nSincerely,\n[Your Name]", fields: ["Your Name", "Recipient Name", "Incident/Issue", "Date", "Impact/Inconvenience", "Corrective Action"] },
  payment_reminder: { label: "Payment Reminder", icon: <Send className="w-4 h-4" />, subject: "Payment Reminder: Invoice [Invoice #]", body: "Dear [Client Name],\n\nI hope you're well. This is a friendly reminder that payment for Invoice [Invoice #], which was due on [Due Date], has not yet been received.\n\nThe total amount due is [Amount]. For your convenience, I have attached a copy of the invoice to this email.\n\nPlease let me know if you have already sent the payment or if there is anything I can assist you with regarding this invoice.\n\nBest regards,\n[Your Name]", fields: ["Your Name", "Client Name", "Invoice #", "Due Date", "Amount"] },
};

export default function FormalEmailGenerator() {
  const [template, setTemplate] = useState<EmailTemplate>("job_application");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => { const initialFields: Record<string, string> = {}; TEMPLATES[template].fields.forEach((field) => { initialFields[field] = ""; }); setFieldValues(initialFields); }, [template]);

  const handleInputChange = (field: string, value: string) => { setFieldValues((prev) => ({ ...prev, [field]: value })); };

  const getGeneratedEmail = () => {
    let subject = TEMPLATES[template].subject; let body = TEMPLATES[template].body;
    Object.entries(fieldValues).forEach(([field, value]) => { const placeholder = `[${field}]`; const replacement = value || placeholder; subject = subject.replace(placeholder, replacement); body = body.replaceAll(placeholder, replacement); });
    return { subject, body };
  };

  const { subject, body } = getGeneratedEmail();

  const handleCopy = () => { const fullText = `Subject: ${subject}\n\n${body}`; navigator.clipboard.writeText(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const resetFields = () => { const initialFields: Record<string, string> = {}; TEMPLATES[template].fields.forEach((field) => { initialFields[field] = ""; }); setFieldValues(initialFields); };

  return (
    <ToolLayout toolId="formal-email-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleCopy} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Full Email"}
            </Button>
            <Button onClick={resetFields} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Fields
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Choose a Template</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(TEMPLATES) as EmailTemplate[]).map((t) => (
                <button key={t} onClick={() => setTemplate(t)} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${template === t ? "border-primary bg-primary/5 text-primary font-bold shadow-sm" : "border-border hover:border-border text-muted-foreground hover:bg-muted"}`}>
                  <div className={`transition-colors ${template === t ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>{TEMPLATES[t].icon}</div>
                  <span className="text-sm">{TEMPLATES[t].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="p-2 bg-primary/5 rounded-lg"><UserPlus className="w-5 h-5 text-primary" /></div>
                  <div><h3 className="text-lg font-black text-foreground">Email Details</h3><p className="text-xs text-muted-foreground font-medium">Add your information</p></div>
                </div>
                <div className="space-y-4">
                  {TEMPLATES[template].fields.map((field) => (
                    <div key={field} className="relative group">
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-primary">{field}</label>
                      <input type="text" placeholder={`e.g. ${field === "Your Name" ? "John Doe" : field}`} value={fieldValues[field] || ""} onChange={(e) => handleInputChange(field, e.target.value)} className="w-full px-4 py-3 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground font-medium" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-card rounded-3xl border border-border shadow-xl shadow-primary/5 overflow-hidden sticky top-8">
                <div className="p-6 bg-muted/50 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-card rounded-lg shadow-sm"><Sparkles className="w-5 h-5 text-primary" /></div>
                    <div><h3 className="text-lg font-black text-foreground">Live Preview</h3><div className="flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Updating...</span></div></div>
                  </div>
                  <Button onClick={handleCopy} size="sm" variant="ghost" className="text-primary hover:bg-primary/5 rounded-xl font-bold text-xs">{copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}{copied ? "Copied" : "Copy"}</Button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-3"><span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Subject</span><div className="px-5 py-4 bg-muted rounded-2xl border border-border text-foreground font-bold text-sm">{subject}</div></div>
                  <div className="space-y-3"><span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">The Email</span><div className="p-5 bg-muted/50 rounded-2xl border border-border relative"><div className="absolute top-4 right-4 text-[10px] font-black text-muted-foreground uppercase tracking-tighter pointer-events-none select-none">{TEMPLATES[template].label.split(" ")[0]}</div><pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed font-medium">{body}</pre></div></div>
                </div>
                <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-between"><p className="text-[11px] text-muted-foreground font-medium">Tip: Copy and paste into your email client.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
