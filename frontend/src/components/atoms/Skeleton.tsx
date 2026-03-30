import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Skeleton presets para casos comunes
export const SkeletonCard: React.FC = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-3">
        <Skeleton width="40%" height={12} />
        <Skeleton width="60%" height={32} />
      </div>
      <Skeleton variant="rounded" width={64} height={64} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6">
    <Skeleton width="30%" height={24} className="mb-6" />
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton width="15%" height={20} />
          <Skeleton width="25%" height={20} />
          <Skeleton width="20%" height={20} />
          <Skeleton width="30%" height={20} />
          <Skeleton width="10%" height={20} />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6">
    <div className="flex items-center justify-between mb-6">
      <Skeleton width="40%" height={24} />
      <Skeleton variant="circular" width={24} height={24} />
    </div>
    <Skeleton variant="rounded" width="100%" height={300} />
  </div>
);

export default Skeleton;
