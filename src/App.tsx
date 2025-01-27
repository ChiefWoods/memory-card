import { useCallback, useEffect, useState } from "react";
import { Card } from "./components/Card";
import Footer from "./components/Footer";
import { Slider } from "./components/ui/slider";
import { SliderSpan } from "./components/SliderSpan";
import { shuffleArray } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";

const ingredients = Object.keys(
  import.meta.glob("@/assets/game/*", { eager: true }),
);

export default function App() {
  const defaultCardAmount = ingredients.length < 10 ? ingredients.length : 10;
  const [cardAmount, setCardAmount] = useState<number>(defaultCardAmount);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(
    parseInt(localStorage.getItem("bestScore") ?? "0"),
  );
  const [cardsInPlay, setCardsInPlay] = useState<string[]>(
    shuffleArray(ingredients).slice(0, defaultCardAmount),
  );
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();

  function pickCard(card: string) {
    if (selectedCards.includes(card)) {
      toast({
        variant: "destructive",
        title: "Game Over",
        description: `Your score: ${currentScore}`,
      });
      resetGame();
    } else {
      setCurrentScore((prev) => prev + 1);
      setSelectedCards([...selectedCards, card]);
      setCardsInPlay((prev) => shuffleArray(prev));
    }
  }

  const resetGame = useCallback(() => {
    setCurrentScore(0);
    setCardsInPlay(shuffleArray(ingredients).slice(0, cardAmount));
    setSelectedCards([]);
  }, [cardAmount]);

  useEffect(() => {
    if (currentScore > bestScore) {
      setBestScore(currentScore);
      localStorage.setItem("bestScore", currentScore.toString());
    }
  }, [currentScore, bestScore]);

  useEffect(() => {
    if (currentScore === cardAmount) {
      toast({
        variant: "success",
        title: "You won!",
        description: `You managed to pick all ${cardAmount} cards!`,
      });
      resetGame();
    }
  }, [currentScore, cardAmount, toast, resetGame]);

  return (
    <>
      <main className="relative flex flex-1 flex-col">
        <section className="sticky top-0 flex flex-col items-start justify-between gap-2 bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex gap-x-4 gap-y-2 sm:flex-col">
            <p>Score: {currentScore}</p>
            <p>Best Score: {bestScore}</p>
          </div>
          <div className="flex w-full flex-col items-start justify-between gap-2 xs:flex-row xs:items-center sm:w-auto sm:flex-col sm:items-end">
            <p>Playing {cardsInPlay.length} Cards</p>
            <div className="flex w-full items-center justify-between gap-4 xs:w-auto">
              <div className="flex items-center gap-2">
                <SliderSpan>5</SliderSpan>
                <Slider
                  defaultValue={[cardAmount]}
                  min={5}
                  max={ingredients.length}
                  step={1}
                  value={[cardAmount]}
                  onValueChange={(value) => setCardAmount(value[0])}
                  className="w-[100px] cursor-pointer sm:w-[200px]"
                />
                <SliderSpan>{ingredients.length}</SliderSpan>
              </div>
              <Button size="sm" onClick={resetGame}>
                Reset With {cardAmount} Cards
              </Button>
            </div>
          </div>
        </section>
        <section className="grid h-fit grid-cols-[repeat(auto-fit,minmax(80px,1fr))] justify-items-center gap-6 p-4">
          {cardsInPlay.map((ing) => {
            return (
              <Card key={ing} imgSrc={ing} onClick={() => pickCard(ing)} />
            );
          })}
        </section>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
