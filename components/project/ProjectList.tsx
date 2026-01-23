"use client";

import { useState, useMemo } from "react";
import { useAllProjects } from "@/hooks/useProject";
import { ProjectCard } from "./ProjectCard";
import { Spinner } from "@/components/ui/Spinner";
import { type Project } from "@/types/contract";

type FilterStatus = "all" | "active" | "completed";

export interface ProjectListProps {
  searchQuery?: string;
}

/**
 * ProjectList component for displaying a list of projects
 */
export function ProjectList({ searchQuery = "" }: ProjectListProps) {
  const { projects, isLoading, isError, error } = useAllProjects();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered: Project[] = projects;

    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((p) => p.isActive && !p.isCompleted);
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((p) => p.isCompleted);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const projectId = p.id.toString();
        const ngoAddress = p.ngo.toLowerCase();
        return projectId.includes(query) || ngoAddress.includes(query);
      });
    }

    return filtered;
  }, [projects, filterStatus, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-charity-red mb-2">Failed to load projects</p>
        <p className="text-sm text-slate-grey opacity-70">
          {error?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Empty state
  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-grey mb-2">
          {projects.length === 0
            ? "No projects found"
            : "No projects match your filters"}
        </p>
        <p className="text-sm text-slate-grey opacity-70">
          {projects.length === 0
            ? "Be the first to create a project!"
            : "Try adjusting your search or filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "all"
              ? "bg-deep-blue text-white"
              : "bg-gray-100 text-slate-grey hover:bg-gray-200"
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setFilterStatus("active")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "active"
              ? "bg-emerald-green text-white"
              : "bg-gray-100 text-slate-grey hover:bg-gray-200"
          }`}
        >
          Active ({projects.filter((p) => p.isActive && !p.isCompleted).length})
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "completed"
              ? "bg-slate-grey text-white"
              : "bg-gray-100 text-slate-grey hover:bg-gray-200"
          }`}
        >
          Completed ({projects.filter((p) => p.isCompleted).length})
        </button>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id.toString()} project={project} />
        ))}
      </div>
    </div>
  );
}

