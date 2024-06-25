import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { PageDirection } from "../lib/types";
import { useJobItemsContextContext } from "../lib/hooks";

export default function PaginationControls() {
  const {
    currentPage,
    totalNumberOfPages,
    handleChangePage: onClick,
  } = useJobItemsContextContext();

  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          direction={"prev"}
          currentPage={currentPage}
          onClick={() => onClick("prev")}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          direction={"next"}
          currentPage={currentPage}
          onClick={() => onClick("next")}
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: PageDirection;
  onClick: () => void;
  currentPage: number;
};

function PaginationButton({
  direction,
  onClick,
  currentPage,
}: PaginationButtonProps) {
  return (
    <button
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
      className={`pagination__button pagination__button--${direction}`}
    >
      {direction === "prev" && (
        <>
          <ArrowLeftIcon />
          Page {currentPage - 1}
        </>
      )}
      {direction === "next" && (
        <>
          <ArrowRightIcon />
          Page {currentPage + 1}
        </>
      )}
    </button>
  );
}
