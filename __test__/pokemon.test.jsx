import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Pokemon from "../pages/pokemon";

const server = setupServer(
  rest.get("https://bp-pokemons.herokuapp.com", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: "Bulbasaur" },
        { id: 2, name: "Victoria" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("It should print pokemon response api", async () => {
  const { getByTestId } = render(<Pokemon />);

  await waitFor(() => getByTestId("pokemon-table"));

  expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
  expect(screen.getByText("Victoria")).toBeInTheDocument();
});
