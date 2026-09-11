import type { ToolContent } from "./types";

const content: ToolContent = {
  seoTitle: "Salary Calculator – Convert Hourly, Daily, Weekly, Monthly & Annual Pay",
  seoDescription:
    "Convert your pay between hourly, daily, weekly, monthly and annual figures instantly. Set your hours per week and weeks per year for an accurate comparison of job offers. Free, no sign-up.",
  intro:
    "Enter what you earn — per hour, day, week, month or year — along with the hours you work each week and weeks per year, and see the equivalent in every other period at once. Compare an hourly contract with a salaried offer, work out what a monthly figure means per hour, or check what a raise adds up to over a year. Figures are pre-tax; the calculation runs instantly on your device.",
  sections: [
    {
      heading: "How the conversion works",
      paragraphs: [
        "Everything is anchored to annual pay. Hourly × hours per week × weeks per year gives the annual figure; annual ÷ 12 gives monthly; annual ÷ weeks per year gives weekly; weekly ÷ 5 gives daily (assuming a five-day week). The defaults — 40 hours and 52 weeks — match a standard full-time year of 2,080 hours. Adjust them to reflect a 37.5-hour week, part-time hours, or a contracting year with unpaid leave (contractors often use 46–48 weeks to allow for holidays and gaps).",
      ],
    },
    {
      heading: "Quick reference (40 h/week, 52 weeks)",
      bullets: [
        "$15/hour ≈ $31,200/year ≈ $2,600/month",
        "$25/hour ≈ $52,000/year ≈ $4,333/month",
        "$40/hour ≈ $83,200/year ≈ $6,933/month",
        "$50,000/year ≈ $24.04/hour ≈ $961/week",
        "$75,000/year ≈ $36.06/hour ≈ $1,442/week",
        "$100,000/year ≈ $48.08/hour ≈ $1,923/week",
      ],
    },
    {
      heading: "Comparing job offers fairly",
      bullets: [
        "Convert both offers to the same period — annual is usually clearest.",
        "Contractors: reduce weeks per year to account for unpaid holidays, sick days and time between contracts, and remember you may fund your own pension, insurance and equipment.",
        "Employees: add the value of employer pension contributions, health insurance, bonuses and paid leave, which the headline salary omits.",
        "Compare take-home, not gross: tax bands, national insurance or social security and local taxes can differ significantly between structures and locations.",
        "Factor in commute costs and hours — a shorter commute is a real raise in hourly terms.",
      ],
    },
  ],
  howTo: [
    { name: "Enter your pay", text: "Type the amount and choose whether it is hourly, daily, weekly, monthly or annual." },
    { name: "Set your schedule", text: "Adjust hours per week (default 40) and weeks per year (default 52) to match your situation." },
    { name: "Read the breakdown", text: "Every other period is calculated instantly." },
  ],
  faqs: [
    {
      question: "Is the result before or after tax?",
      answer: "Before tax. Take-home pay depends on your country, tax bands, deductions and benefits, so use a local tax calculator for net figures.",
    },
    {
      question: "How many working hours are in a year?",
      answer: "40 hours × 52 weeks = 2,080 hours. With four weeks of holiday it is 1,920; a 37.5-hour week over 52 weeks is 1,950.",
    },
    {
      question: "How do I convert an annual salary to hourly?",
      answer: "Divide by your annual hours: $60,000 ÷ 2,080 ≈ $28.85/hour for a standard full-time schedule.",
    },
    {
      question: "How should contractors set weeks per year?",
      answer: "Most use 46–48 weeks to allow for holidays, illness and gaps between contracts; a rate that only breaks even at 52 weeks is too low.",
    },
  ],
  related: ["percentage-calculator", "tip-calculator", "calculator", "date-calculator", "time-duration-converter", "gpa-calculator"],
};

export default content;
