import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import Home from "../pages/index";

const server = setupServer(
  rest.get("/api/tasks", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, text: "Sample test", done: false },
        { id: 2, text: "Learning how to remove items", done: false },
      ])
    );
  }),
  rest.post("/api/tasks", (req, res, ctx) => {
    return res(ctx.json([{ id: 3, text: req.body.text, done: false }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Wait for items on page load", async () => {
  render(<Home />);

  // Check the initial http request to get the items to be completed
  await waitFor(() => screen.getAllByTestId("item"));
  expect(screen.getByText("Sample test")).toBeInTheDocument();
});

test("Items can be added", async () => {
  const text = "Learning react testing";

  const { getByTestId, getAllByTestId } = render(<Home />);

  // Wait for the initial http request to get the items to be completed
  await waitFor(() => screen.getAllByTestId("item"));

  // Check the length of the items before mutating them
  expect(getAllByTestId("item")).toHaveLength(2);

  const input = getByTestId("input-task");
  const button = getByTestId("submit");

  // Setting up the value on the input
  fireEvent.change(input, {
    target: { value: text },
  });
  // Submitting the form
  fireEvent.click(button);

  // Wait for the new item to be added on the screen after completing the HTTP request
  await waitFor(() => expect(screen.queryByText(text)).toBeInTheDocument());

  // Check the input has been cleared after submitting the form
  expect(input).toHaveValue("");

  const items = getAllByTestId("item");
  // Check the new item exist in the list.
  expect(items.find((i) => i.textContent === text)).toBeTruthy();
  expect(getAllByTestId("item")).toHaveLength(3);
});

test("Item is deleted when clicking the trash icon", async () => {
  const { getByTestId, getAllByTestId } = render(<Home />);

  // Wait for the initial http request to get the items to be completed
  await waitFor(() => screen.getAllByTestId("item"));

  const items = getAllByTestId("item");
  expect(items).toHaveLength(2);

  // Get the first delele button on the screen
  const trash = getAllByTestId("remove-item")[0];
  fireEvent.click(trash);

  // Make sure it deletes an item after clicking the trash icon
  expect(screen.getAllByTestId("item")).toHaveLength(1);
});
