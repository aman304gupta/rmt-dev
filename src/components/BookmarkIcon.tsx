import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useBooksmarksContext } from "../lib/hooks";

type BookmarkIconProps = {
  id: number;
};

export default function BookmarkIcon({ id }: BookmarkIconProps) {
  const { bookmarkedIds, handleToggleBookmark } = useBooksmarksContext();

  return (
    <button
      className="bookmark-btn"
      onClick={(e) => {
        handleToggleBookmark(id);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <BookmarkFilledIcon
        className={`
        ${bookmarkedIds.includes(id) ? "filled" : ""}
        `}
      />
    </button>
  );
}
