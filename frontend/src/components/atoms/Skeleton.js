import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Skeleton = ({ className = "", variant = "text", width, height, }) => {
    const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
    const variantClasses = {
        text: "rounded h-4",
        circular: "rounded-full",
        rectangular: "rounded-none",
        rounded: "rounded-xl",
    };
    const style = {};
    if (width)
        style.width = typeof width === "number" ? `${width}px` : width;
    if (height)
        style.height = typeof height === "number" ? `${height}px` : height;
    return (_jsx("div", { className: `${baseClasses} ${variantClasses[variant]} ${className}`, style: style }));
};
// Skeleton presets para casos comunes
export const SkeletonCard = () => (_jsx("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6 space-y-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1 space-y-3", children: [_jsx(Skeleton, { width: "40%", height: 12 }), _jsx(Skeleton, { width: "60%", height: 32 })] }), _jsx(Skeleton, { variant: "rounded", width: 64, height: 64 })] }) }));
export const SkeletonTable = ({ rows = 5 }) => (_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6", children: [_jsx(Skeleton, { width: "30%", height: 24, className: "mb-6" }), _jsx("div", { className: "space-y-3", children: Array.from({ length: rows }).map((_, index) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Skeleton, { width: "15%", height: 20 }), _jsx(Skeleton, { width: "25%", height: 20 }), _jsx(Skeleton, { width: "20%", height: 20 }), _jsx(Skeleton, { width: "30%", height: 20 }), _jsx(Skeleton, { width: "10%", height: 20 })] }, index))) })] }));
export const SkeletonChart = () => (_jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Skeleton, { width: "40%", height: 24 }), _jsx(Skeleton, { variant: "circular", width: 24, height: 24 })] }), _jsx(Skeleton, { variant: "rounded", width: "100%", height: 300 })] }));
export default Skeleton;
