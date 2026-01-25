import { renderHook, waitFor } from "@testing-library/react";
import { useProject, useAllProjects } from "@/hooks/useProject";
import * as wagmi from "wagmi";
import { type Project } from "@/types/contract";
import { type Address } from "viem";

describe("useProject Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially", () => {
    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useProject(BigInt(1)));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.project).toBeUndefined();
  });

  it("returns project data when loaded", async () => {
    const mockProjectData: unknown[] = [
      BigInt(1),
      "0x1111111111111111111111111111111111111111" as Address,
      "0x0000000000000000000000000000000000000000" as Address,
      BigInt("1000000000000000000"),
      BigInt("500000000000000000"),
      BigInt("500000000000000000"),
      BigInt(0),
      true,
      false,
    ];

    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: mockProjectData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useProject(BigInt(1)));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.project).toBeDefined();
    expect(result.current.project?.id).toBe(BigInt(1));
    expect(result.current.isError).toBe(false);
  });

  it("returns error state on error", () => {
    const mockError = new Error("Contract read failed");

    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: mockError,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useProject(BigInt(1)));

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.project).toBeUndefined();
  });
});

describe("useAllProjects Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially", () => {
    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });
    (wagmi.useReadContracts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useAllProjects());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.projects).toEqual([]);
  });

  it("returns projects array when loaded", async () => {
    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: BigInt(2),
      isLoading: false,
    });

    const mockProject1: unknown[] = [
      BigInt(1),
      "0x1111111111111111111111111111111111111111" as Address,
      "0x0000000000000000000000000000000000000000" as Address,
      BigInt("1000000000000000000"),
      BigInt("500000000000000000"),
      BigInt("500000000000000000"),
      BigInt(0),
      true,
      false,
    ];

    const mockProject2: unknown[] = [
      BigInt(2),
      "0x2222222222222222222222222222222222222222" as Address,
      "0x0000000000000000000000000000000000000000" as Address,
      BigInt("2000000000000000000"),
      BigInt("1000000000000000000"),
      BigInt("1000000000000000000"),
      BigInt(0),
      true,
      false,
    ];

    (wagmi.useReadContracts as jest.Mock).mockReturnValue({
      data: [
        { status: "success" as const, result: mockProject1 },
        { status: "success" as const, result: mockProject2 },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useAllProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toHaveLength(2);
    expect(result.current.projects[0]?.id).toBe(BigInt(1));
    expect(result.current.projects[1]?.id).toBe(BigInt(2));
  });
});

