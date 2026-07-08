import { expect, test } from "@playwright/test";

const mockHospitals = [
  {
    id: 1,
    name: "FORHOS Clinic",
    addr: "Seoul",
    number: "02-1234-5678",
    openStatus: true,
    openTime: "09:00:00",
    closeTime: "18:00:00",
    lunchStartTime: "12:30:00",
    lunchEndTime: "13:30:00",
    closedDays: "SUNDAY",
    waitingPeople: 3,
    waitingTime: 12,
    rating: 4.8,
  },
];

const mockHospitalPage = {
  content: mockHospitals,
  number: 0,
  size: 9,
  totalElements: 1,
  totalPages: 1,
};

const mockReception = {
  id: 7,
  memberId: 3,
  hospitalId: 1,
  hospitalName: "FORHOS Clinic",
  patientName: "Alex Kim",
  visitType: "FIRST",
  symptom: "Headache",
  queueNumber: 2,
  queueStatus: "WAITING",
  queueDate: "2026-05-23",
  queueTime: "2026-05-23T09:30:00",
  calledTime: null,
  doneTime: null,
  canceledTime: null,
};

function createAccessToken(authority: string) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "");
  const payload = btoa(JSON.stringify({ sub: "admin@example.com", auth: authority })).replace(/=/g, "");

  return `${header}.${payload}.signature`;
}

test.beforeEach(async ({ page }) => {
  await page.route("**/api/hospital", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockHospitals),
    });
  });

  await page.route("**/api/hospital?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockHospitalPage),
    });
  });

  await page.route("**/api/members/myinfo", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        name: "Admin",
        age: 35,
        gender: "none",
        phone: "010-1234-5678",
        region: "seoul",
        extra: "",
      }),
    });
  });
});

test("renders the home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /FORHOS/i })).toBeVisible();
  await expect(page.getByText("Hospital Wait Service")).toBeVisible();
});

test("renders the hospital list with API data", async ({ page }) => {
  await page.goto("/hospital/list");

  await expect(page.getByText("Hospital List")).toBeVisible();
  await expect(page.getByText("FORHOS Clinic")).toBeVisible();
});

test("redirects protected pages to login when signed out", async ({ page }) => {
  await page.goto("/info");

  await expect(page).toHaveURL(/\/login$/);
});

test("lets hospital admins call a waiting reception", async ({ context, page }) => {
  let callRequested = false;

  await context.addCookies([
    {
      name: "access_token",
      value: createAccessToken("ROLE_HOSPITAL_ADMIN"),
      url: "http://127.0.0.1:4173",
    },
  ]);
  await page.route("**/api/admin/receptions?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        content: [mockReception],
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      }),
    });
  });
  await page.route("**/api/reception/7/call", async (route) => {
    callRequested = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...mockReception, queueStatus: "CALLED", calledTime: "2026-05-23T09:35:00" }),
    });
  });

  await page.goto("/admin/receptions");
  await expect(page.getByRole("heading", { name: "접수 관리" })).toBeVisible();
  await expect(page.getByText("Alex Kim")).toBeVisible();

  await page.getByRole("button", { name: "호출" }).click();

  await expect.poll(() => callRequested).toBe(true);
});
