import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("@/shared/api/apiClient", () => ({
  hasAuthTokens: vi.fn(),
}));

import { hasAuthTokens } from "@/shared/api/apiClient";

const mockedHasAuthTokens = vi.mocked(hasAuthTokens);

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/info"]}>
      <Routes>
        <Route
          path="/info"
          element={
            <ProtectedRoute>
              <p>private page</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>login page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    mockedHasAuthTokens.mockReturnValue(false);

    renderProtectedRoute();

    expect(screen.getByText("login page")).toBeInTheDocument();
    expect(screen.queryByText("private page")).not.toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    mockedHasAuthTokens.mockReturnValue(true);

    renderProtectedRoute();

    expect(screen.getByText("private page")).toBeInTheDocument();
  });
});
