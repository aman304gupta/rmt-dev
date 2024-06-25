import { useJobItemsContextContext } from "../lib/hooks";

export default function ResultsCount() {
  const { totalNumberOfResults } = useJobItemsContextContext();

  return (
    <p className="count">
      {" "}
      <span className="u-bold">{totalNumberOfResults}</span> results
    </p>
  );
}
