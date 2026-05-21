import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueueDonePage } from "./QueueDonePage";

describe("QueueDonePage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("does not show mock queue values when reception data is missing", () => {
    render(
      <MemoryRouter>
        <QueueDonePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("접수 정보를 찾을 수 없습니다")).toBeInTheDocument();
    expect(screen.queryByText("A-102")).not.toBeInTheDocument();
  });
});
