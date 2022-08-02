import {
  render,
  fireEvent,
  waitFor,
  screen,
  within,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

import Home from "../pages/index";

const server = setupServer(
  rest.get("/api/tasks", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, text: "Sample test", done: false },
        { id: 2, text: "Learning how to remove items", done: false },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Wait for items on page load", async () => {
  render(<Home />);

  await waitFor(() => screen.getAllByTestId("item"));
  expect(screen.getByText("Sample test")).toBeInTheDocument();
});

test("Items can be added", async () => {
  const text = "Learning react testing";

  const { getByTestId, getAllByTestId } = render(<Home />);

  await waitFor(() => screen.getAllByTestId("item"));

  expect(getAllByTestId("item")).toHaveLength(2);

  const input = getByTestId("input-task");
  const button = getByTestId("submit");

  fireEvent.change(input, {
    target: { value: text },
  });
  fireEvent.click(button);

  expect(input).toHaveValue("");

  const items = getAllByTestId("item");
  expect(items.find((i) => i.textContent === text)).toBeTruthy();
  expect(getAllByTestId("item")).toHaveLength(3);
});

test("Item is deleted when clicking the trash icon", async () => {
  const { getByTestId, getAllByTestId } = render(<Home />);

  await waitFor(() => screen.getAllByTestId("item"));

  const items = getAllByTestId("item");
  expect(items).toHaveLength(2);

  const trash = getAllByTestId("remove-item")[0];
  fireEvent.click(trash);

  expect(screen.getAllByTestId("item")).toHaveLength(1);
});
