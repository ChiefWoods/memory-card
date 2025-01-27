import { Button } from "./ui/button";

export function Card({
  imgSrc,
  onClick,
}: {
  imgSrc: string;
  onClick: () => void;
}) {
  return (
    <Button
      className="size-fit cursor-pointer rounded-md bg-gray-200 px-2 py-6 hover:scale-105 hover:bg-gray-400 focus-visible:scale-105 focus-visible:bg-gray-400"
      onClick={onClick}
    >
      <div className="rounded-full bg-white">
        <img src={imgSrc} className="aspect-square w-20 object-cover" />
      </div>
    </Button>
  );
}
