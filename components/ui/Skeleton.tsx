"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  shape?: "text" | "circle" | "rectangle";
  width?: string | number;
  height?: string | number;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
  className,
  shape = "rectangle",
  width,
  height,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-slate-grey bg-opacity-20";
  
  const shapeStyles = {
    text: "rounded",
    circle: "rounded-full",
    rectangle: "rounded-lg",
  };

  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <div
      className={cn(
        baseStyles,
        shapeStyles[shape],
        className
      )}
      style={style}
    />
  );
}

/**
 * Skeleton for text lines
 */
export interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lineHeight?: string;
}

export function TextSkeleton({
  lines = 1,
  className,
  lineHeight = "1rem",
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          height={lineHeight}
          className={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for ProjectCard
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-grey border-opacity-20">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton shape="text" height="1.5rem" width="60%" />
        
        {/* Description */}
        <TextSkeleton lines={2} lineHeight="0.875rem" />
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton shape="text" height="0.75rem" width="40%" />
            <Skeleton shape="text" height="1rem" width="70%" />
          </div>
          <div className="space-y-2">
            <Skeleton shape="text" height="0.75rem" width="40%" />
            <Skeleton shape="text" height="1rem" width="70%" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <Skeleton shape="text" height="0.75rem" width="30%" />
          <Skeleton shape="rectangle" height="0.5rem" width="100%" />
        </div>
        
        {/* Status badge */}
        <Skeleton shape="rectangle" height="1.5rem" width="80px" />
      </div>
    </div>
  );
}

/**
 * Skeleton for ProjectList
 */
export interface ProjectListSkeletonProps {
  count?: number;
}

export function ProjectListSkeleton({ count = 6 }: ProjectListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for MilestoneCard
 */
export function MilestoneCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-slate-grey border-opacity-20">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton shape="text" height="1.25rem" width="40%" />
          <Skeleton shape="rectangle" height="1.5rem" width="100px" />
        </div>
        
        {/* Description */}
        <TextSkeleton lines={2} lineHeight="0.875rem" />
        
        {/* Amount */}
        <Skeleton shape="text" height="1rem" width="50%" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Card content
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-grey border-opacity-20">
      <div className="space-y-4">
        <Skeleton shape="text" height="1.5rem" width="40%" />
        <TextSkeleton lines={3} lineHeight="0.875rem" />
      </div>
    </div>
  );
}

