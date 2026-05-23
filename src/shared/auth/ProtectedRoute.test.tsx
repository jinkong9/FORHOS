import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("@/shared/api/apiClient", () => ({
  hasAnyRole: vi.fn(),
  hasAuthTokens: vi.fn(),
}));

import { hasAnyRole, hasAuthTokens } from "@/shared/api/apiClient";

const mockedHasAuthTokens = vi.mocked(hasAuthTokens);
const mockedHasAnyRole = vi.mocked(hasAnyRole);

function renderProtectedRoute(allowedRoles?: Array<"USER" | "HOSPITAL_ADMIN" | "ADMIN">) {
  return render(
    <MemoryRouter initialEntries={["/info"]}>
      <Routes>
        <Route
          path="/info"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <p>private page</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>login page</p>} />
        <Route path="/" element={<p>home page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockedHasAnyRole.mockReturnValue(true);
  });

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

  it("redirects authenticated users without an allowed role to home", () => {
    mockedHasAuthTokens.mockReturnValue(true);
    mockedHasAnyRole.mockReturnValue(false);

    renderProtectedRoute(["HOSPITAL_ADMIN", "ADMIN"]);

    expect(screen.getByText("home page")).toBeInTheDocument();
    expect(screen.queryByText("private page")).not.toBeInTheDocument();
  });
});
