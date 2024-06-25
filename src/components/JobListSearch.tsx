import { useJobItemsContextContext } from "../lib/hooks";
import JobList from "./JobList";

export default function JobListSearch() {
  const { jobItemsSortedAndSliced, isLoading } = useJobItemsContextContext();

  return <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} />;
}
