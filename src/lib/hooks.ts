import { useContext, useEffect, useState } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";
import { ActiveIdContext } from "../contexts/ActiveIdContextProvider";

// -------------------------------------------------

type JobItemApiResponse = {
  jobItem: JobItemExpanded;
  public: boolean;
};
const fetchJobItem = async (activeId: number): Promise<JobItemApiResponse> => {
  const res = await fetch(`${BASE_API_URL}/${activeId}`);

  //4xx and 5xx errors
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.description);
  }
  const data = await res.json();
  return data;
};

export function useJobItem(activeId: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["jobItem", activeId],

    () => (activeId ? fetchJobItem(activeId) : null),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(activeId),
      onError: handleError,
    }
  );

  const jobItem = data?.jobItem;
  const isLoading = isInitialLoading;
  return { jobItem, isLoading } as const;
}

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["job-item", id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      onError: handleError,
      enabled: Boolean(id),
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => Boolean(jobItem)) as JobItemExpanded[];

  const isLoading = results.some((result) => result.isLoading);

  return { jobItems, isLoading } as const;
}

//-------------------------------------------------

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeId;
}

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const res = await fetch(`${BASE_API_URL}?search=${searchText}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.description);
  }

  const data = await res.json();
  return data;
};

export function useSearchQuery(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60,
      enabled: Boolean(searchText),
      retry: false,
      onError: handleError,
      refetchOnWindowFocus: false,
    }
  );

  return { jobItems: data?.jobItems, isLoading: isInitialLoading } as const;
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

export function useOnClickOutside(
  refs: React.RefObject<HTMLElement>[],
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        refs.every((ref) => !ref.current?.contains(e.target as Node))
      )
        handler();
    };

    document.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [refs, handler]);
}

// -------------------ContextAPI Hooks------------------------------

export function useBooksmarksContext() {
  const context = useContext(BookmarksContext);

  if (context === null) {
    throw new Error(
      "useBookmarksContext must be used within a BookmarksContextProvider"
    );
  }

  return context;
}

export function useActiveIdContext() {
  const context = useContext(ActiveIdContext);

  if (context === null) {
    throw new Error(
      "useBookmarksContext must be used within a ActiveIdContextProvider"
    );
  }

  return context;
}

// -------------------------------------------------
