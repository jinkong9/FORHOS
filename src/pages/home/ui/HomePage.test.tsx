import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "./HomePage";

vi.mock("@/features/auth/api/hospitalListApi", () => ({
  hospitalList: vi.fn(),
}));

import { hospitalList } from "@/features/auth/api/hospitalListApi";

const mockedHospitalList = vi.mocked(hospitalList);

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  it("shows a clear retry state when hospital stats fail to load", async () => {
    mockedHospitalList.mockRejectedValue(new Error("network error"));

    renderHomePage();

    expect(await screen.findByText("실시간 병원 정보를 불러오지 못했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 불러오기" })).toBeInTheDocument();
  });
});
