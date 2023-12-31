import { fakeDeck } from "@/helpers/apimock/fakeDeck";
import CardInterface from "@/interfaces/CardInterface";
import React, { ReactNode } from "react";
import { WarningContext } from "./WarningContext";

type HeroesContextType = {
  allPages: number;
  currentPage: number;
  deck: CardInterface[];
  filteredDeck: CardInterface[];
  setFilteredDeck: (cards: CardInterface[]) => void;
  selectPage: (page: number) => void;
};

export const HeroesContext = React.createContext<HeroesContextType>(
  {} as HeroesContextType
);

export const HeroesStorage = ({ children }: { children: ReactNode }) => {
  const [deck, setDeck] = React.useState<CardInterface[]>([]);
  const [filteredDeck, setFilteredDeck] = React.useState<CardInterface[]>([]);
  const [allPages, setAllPages] = React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const { setMessage } = React.useContext(WarningContext);

  const cardsPerPage = 10;

  async function loadDeck() {
    try {
      const response = await fetch(
        "http://homologacao3.azapfy.com.br/api/ps/metahumans"
      );
      const json = await response.json();
      setAllPages(Math.ceil(json.length / cardsPerPage));
      const firstTen: CardInterface[] = json.slice(0, cardsPerPage);
      setDeck(json);
      setFilteredDeck(firstTen);
      setCurrentPage(1);
    } catch (error) {
      let message = "Erro desconhecido";
      if (error instanceof Error) message = error.message;
      else message = String(error);
      setMessage(message);
    }
  }

  function loadFakeDeck() {
    setDeck(fakeDeck);
    setFilteredDeck(fakeDeck);
  }

  function selectPage(page: number) {
    const newPage = deck.slice(
      cardsPerPage * (page - 1),
      cardsPerPage * (page - 1) + 10
    );
    setFilteredDeck(newPage);
    setCurrentPage(page);
  }

  React.useEffect(() => {
    if (!deck.length) {
      loadDeck();
      //: use o fakeDeck se não quiser ficar chamando a API
      // loadFakeDeck();
      setMessage("");
    }
  }, []);

  return (
    <HeroesContext.Provider
      value={{
        allPages,
        currentPage,
        deck,
        filteredDeck,
        setFilteredDeck,
        selectPage,
      }}
    >
      {children}
    </HeroesContext.Provider>
  );
};
