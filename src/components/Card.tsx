import { BattleContext } from "@/contexts/BattleContext";
import CardInterface from "@/interfaces/CardInterface";
import Image from "next/image";
import React from "react";
import Switch from "@mui/material/Switch";
import { WarningContext } from "@/contexts/WarningContext";
import { HeroesContext } from "@/contexts/HeroesContext";

interface Card {
  card: CardInterface;
}

export default function Card({ card }: Card) {
  const { selectedHeroesIds, setSelectedHeroesIds } =
    React.useContext(BattleContext);
  const { setMessage } = React.useContext(WarningContext);
  const { deck } = React.useContext(HeroesContext);

  function selectHeroes(hero: CardInterface) {
    const wasCardSelected = !!selectedHeroesIds.includes(hero.id);
    if (selectedHeroesIds.length < 2 && !wasCardSelected) {
      const heroesToBattle = [...selectedHeroesIds, hero.id];
      setSelectedHeroesIds(heroesToBattle);
    } else if (wasCardSelected) {
      const remainingHeroes = selectedHeroesIds.filter(
        (selHero) => selHero !== hero.id
      );
      setSelectedHeroesIds(remainingHeroes);
      setMessage("");
    } else {
      const selectedHeroesNames = deck.filter((card) =>
        selectedHeroesIds.includes(card.id)
      );
      setMessage(
        `Já existem 2 personagens selecionados. ${selectedHeroesNames[0].name} e ${selectedHeroesNames[1].name}`
      );
    }
  }

  const shadowHoverColor =
    card.biography.alignment === "good"
      ? "hover:shadow-blue-dark"
      : "hover:shadow-red-dark";
  const cardDetail =
    card.biography.alignment === "good" ? "shadow-blue" : "shadow-red";

  return (
    <div
      className={`flex flex-col rounded-lg border-4 border-black-dark shadow-md w-[220px] relative hover:scale-105 hover:shadow-card-highlight ${shadowHoverColor}`}
    >
      <Image
        src={card.images.lg}
        alt={card.slug}
        height="0"
        width="0"
        sizes="100vw"
        priority
        className="w-[220px] h-auto rounded-t-md cursor-pointer"
        onClick={() => selectHeroes(card)}
      />
      <Switch
        checked={!!selectedHeroesIds.includes(card.id)}
        sx={{
          "&.MuiSwitch-root .Mui-checked + .MuiSwitch-track": {
            backgroundColor: "green",
          },
          "&.MuiSwitch-root .Mui-checked": {
            color: "green",
          },
          "&.MuiSwitch-root .MuiSwitch-track": {
            backgroundColor: "rgb(220, 220, 226)",
          },
        }}
        className="absolute top-1 left-1 text-white bg-black rounded-full"
        onClick={() => selectHeroes(card)}
      />
      <div
        className={`bg-black-light shadow-card-inner ${cardDetail} h-full rounded-b-md border-t-4 border-black-dark px-2 py-2`}
      >
        <h1 className="text-3xl text-center text-grey capitalize font-semibold">
          {card.name}
        </h1>
        <p className="text-xl text-center text-grey capitalize py-4">
          {card.appearance.race ? card.appearance.race : "unknown"} -{" "}
          {card.biography.alignment}
        </p>
      </div>
    </div>
  );
}
