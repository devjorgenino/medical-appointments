import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  IconComponent: LucideIcon;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ IconComponent, className = 'h-5 w-5' }) => (
  <IconComponent className={className} />
);

export default Icon;