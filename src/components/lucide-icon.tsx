import { 
  Code2, 
  FileText, 
  RefreshCw, 
  Calculator, 
  Image, 
  Palette, 
  Sparkles, 
  ShieldCheck,
  Braces,
  Lock,
  Link,
  Hash,
  Type,
  Diff,
  Clock,
  Ruler,
  Percent,
  Key,
  Fingerprint,
  QrCode,
  Maximize,
  LucideProps
} from "lucide-react";

const icons = {
  Code2,
  FileText,
  RefreshCw,
  Calculator,
  Image,
  Palette,
  Sparkles,
  ShieldCheck,
  Braces,
  Lock,
  Link,
  Hash,
  Type,
  Diff,
  Clock,
  Ruler,
  Percent,
  Key,
  Fingerprint,
  QrCode,
  Maximize
};

export type IconName = keyof typeof icons;

interface LucideIconProps extends LucideProps {
  name: string;
}

export function LucideIcon({ name, ...props }: LucideIconProps) {
  const Icon = icons[name as IconName];
  if (!Icon) return null;
  return <Icon {...props} />;
}
