import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Home from "../pages/index";

test("Items can be added", async () => {
  const text = "Learning react testing";

  const { getByTestId, getAllByTestId } = render(<Home />);
  const input = getByTestId("input-task");
  const button = getByTestId("submit");

  fireEvent.change(input, {
    target: { value: text },
  });
  fireEvent.click(button);

  expect(input).toHaveValue("");

  const items = getAllByTestId("item");
  expect(items.find((i) => i.textContent === text)).toBeTruthy();
  expect(items).toHaveLength(3);
});
