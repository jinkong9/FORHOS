import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppHeader } from "./AppHeader";

vi.mock("@/features/auth/api/memberApi", () => ({
  logoutMember: vi.fn(),
}));

vi.mock("@/features/auth/api/myinfoApi", () => ({
  getMyName: vi.fn(),
}));

vi.mock("@/shared/api/apiClient", () => ({
  clearAuthTokens: vi.fn(),
  hasAuthTokens: vi.fn(() => false),
  setLogoutHandler: vi.fn(),
}));

function renderAppHeader() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AppHeader", () => {
  it("opens mobile navigation from the menu button", async () => {
    const user = userEvent.setup();

    renderAppHeader();

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));

    const mobileNav = screen.getByRole("navigation", { name: "모바일 메뉴" });

    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: "내 접수" })).toBeInTheDocument();
  });
});
