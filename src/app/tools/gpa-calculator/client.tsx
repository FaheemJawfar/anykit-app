"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2, BookOpen, Trophy, CheckCircle2, Info, RotateCcw, Library, Target, Award } from "lucide-react";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: string;
  isHonors: boolean;
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "", credits: "", isHonors: false },
    { id: "2", name: "", grade: "", credits: "", isHonors: false },
    { id: "3", name: "", grade: "", credits: "", isHonors: false },
  ]);
  const [isWeighted, setIsWeighted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [gpaResult, setGpaResult] = useState<string | null>(null);

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0.0,
  };

  const addCourse = () => { setCourses([...courses, { id: Date.now().toString(), name: "", grade: "", credits: "", isHonors: false }]); };
  const removeCourse = (id: string) => { if (courses.length > 1) setCourses(courses.filter((c) => c.id !== id)); };
  const updateCourse = (id: string, field: keyof Course, value: string | boolean) => { setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))); };
  const handleReset = () => { setCourses([{ id: "1", name: "", grade: "", credits: "", isHonors: false }, { id: "2", name: "", grade: "", credits: "", isHonors: false }, { id: "3", name: "", grade: "", credits: "", isHonors: false }]); setGpaResult(null); };

  useEffect(() => {
    const hasData = courses.some((c) => c.grade && c.credits);
    if (!hasData) { setGpaResult(null); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      let totalPoints = 0; let totalCredits = 0;
      courses.forEach((c) => {
        const creds = parseFloat(c.credits);
        if (c.grade && !isNaN(creds) && creds > 0) {
          let pts = gradePoints[c.grade] || 0;
          if (isWeighted && c.isHonors && pts > 0) pts += 1.0;
          totalPoints += pts * creds; totalCredits += creds;
        }
      });
      setGpaResult(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null);
      setIsCalculating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [courses, isWeighted]);

  const getGPAStatus = (val: string) => {
    const v = parseFloat(val);
    if (v >= 3.7) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", icon: <Trophy className="w-5 h-5" /> };
    if (v >= 3.0) return { label: "Good", color: "text-primary", bg: "bg-muted", border: "border-border", icon: <CheckCircle2 className="w-5 h-5" /> };
    if (v >= 2.0) return { label: "Average", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", icon: <Info className="w-5 h-5" /> };
    return { label: "Needs Improvement", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", icon: <Info className="w-5 h-5" /> };
  };

  const status = gpaResult ? getGPAStatus(gpaResult) : null;

  return (
    <ToolLayout toolId="gpa-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All Courses
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">GPA Type</h3>
            <div className="grid grid-cols-1 gap-2">
              {[{ id: false, label: "Unweighted (4.0)", desc: "Standard" }, { id: true, label: "Weighted (5.0)", desc: "For Honors & AP classes" }].map((type) => (
                <button key={type.label} onClick={() => setIsWeighted(type.id as boolean)} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isWeighted === type.id ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-muted-foreground border-border hover:bg-accent"}`}>
                  <div className="flex flex-col items-start"><span className="text-sm font-bold">{type.label}</span><span className={`text-[10px] ${isWeighted === type.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{type.desc}</span></div>
                  {isWeighted === type.id && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Grade Scale</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {["A+ (4.0)", "A (4.0)", "A- (3.7)", "B+ (3.3)", "B (3.0)", "B- (2.7)", "C+ (2.3)", "C (2.0)"].map((g) => (
                <div key={g} className="text-[11px] font-medium text-muted-foreground flex justify-between"><span className="font-bold text-muted-foreground">{g.split(" ")[0]}</span><span className="font-mono">{g.split(" ")[1]}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-black text-foreground flex items-center gap-3"><Library className="w-6 h-6 text-primary" />Classes</h2>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-3 py-1.5 rounded-lg border border-border">{courses.length} Courses</span>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="col-span-5 md:col-span-4">Class Name</div><div className="col-span-3">Grade</div><div className="col-span-3 md:col-span-2">Credits</div><div className="col-span-1 hidden md:block"></div>
              </div>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="grid grid-cols-12 gap-3 items-center bg-muted border border-border p-3 rounded-2xl hover:shadow-sm transition-all">
                    <div className="col-span-5 md:col-span-4"><input type="text" value={course.name} onChange={(e) => updateCourse(course.id, "name", e.target.value)} placeholder="Ex: Math 101" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-base font-bold text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" /></div>
                    <div className="col-span-3">
                      <select value={course.grade} onChange={(e) => updateCourse(course.id, "grade", e.target.value)} className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer">
                        <option value="">--</option>{Object.keys(gradePoints).map((g) => (<option key={g} value={g}>{g}</option>))}
                      </select>
                    </div>
                    <div className="col-span-3 md:col-span-2"><input type="number" value={course.credits} onChange={(e) => { if (e.target.value.length <= 4) updateCourse(course.id, "credits", e.target.value); }} placeholder="Cr" min="0" max="20" className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                    <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                      {isWeighted && (
                        <button onClick={() => updateCourse(course.id, "isHonors", !course.isHonors)} className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${course.isHonors ? "bg-amber-100 text-amber-900 border-2 border-amber-400" : "bg-card text-muted-foreground border-2 border-border hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50"}`}><Award className="w-3.5 h-3.5" /><span className="hidden lg:inline">Honors</span></button>
                      )}
                      <button onClick={() => removeCourse(course.id)} disabled={courses.length === 1} className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {isWeighted && (
                      <div className="col-span-12 md:hidden pt-2 border-t border-border flex justify-start">
                        <button onClick={() => updateCourse(course.id, "isHonors", !course.isHonors)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${course.isHonors ? "bg-amber-100 text-amber-900 border-2 border-amber-400" : "bg-card text-muted-foreground border-2 border-border hover:border-amber-300 hover:text-amber-600"}`}><Award className="w-3.5 h-3.5" />Honors/AP Weighted</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <button onClick={addCourse} className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all group font-bold text-sm">
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />Add Another Course
                </button>
              </div>
            </div>
          </div>

          {gpaResult ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-16 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div><p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-1">Your Result</p><h3 className="text-xl font-bold text-foreground">{isWeighted ? "Weighted GPA" : "Unweighted GPA"}</h3></div>
                    <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100"><Target className="w-6 h-6 text-indigo-600" /></div>
                  </div>
                  <div><span className="text-5xl lg:text-6xl font-black tracking-tight text-foreground">{gpaResult}</span><p className="text-xs font-bold text-muted-foreground mt-2">Out of {isWeighted ? "5.0" : "4.0"} Scale</p></div>
                </div>
              </div>
              {status && (
                <div className={`bg-card border ${status.border} rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${status.bg} rounded-full -mr-10 -mt-10 blur-2xl opacity-50`}></div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 relative z-10">Academic Standing</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-4 rounded-2xl ${status.bg} ${status.color}`}>{status.icon}</div>
                    <div><h3 className={`text-2xl font-black ${status.color}`}>{status.label}</h3><p className="text-xs font-semibold text-muted-foreground">Keep up the work!</p></div>
                  </div>
                </div>
              )}
              <div className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col justify-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Total Credits</p>
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-muted text-muted-foreground"><BookOpen className="w-6 h-6" /></div>
                  <div><h3 className="text-4xl font-black text-foreground">{courses.reduce((acc, curr) => acc + (parseFloat(curr.credits) || 0), 0)}</h3><p className="text-xs font-semibold text-muted-foreground">Hours Earned</p></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-[2.5rem] flex items-center justify-center mb-6"><GraduationCap className="w-10 h-10 text-muted-foreground" /></div>
              <h3 className="text-lg font-bold text-foreground mb-1">Ready to Calculate</h3>
              <p className="text-muted-foreground max-w-xs text-sm">Enter your course grades and credits above to see your GPA projection.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
