import { expect, test } from "@playwright/test";

const mockHospitals = [
  {
    id: 1,
    name: "FORHOS Clinic",
    addr: "Seoul",
    number: "02-1234-5678",
    subject: "Internal Medicine",
    waitingPeople: 3,
    waitingTime: 12,
    rating: 4.8,
    openStatus: true,
  },
];

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
  await page.route("**/api/reception/hospital/1/today", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockReception]),
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

  await page.goto("/admin/receptions?hospitalId=1");
  await expect(page.getByText("Reception Management")).toBeVisible();
  await expect(page.getByText("Alex Kim")).toBeVisible();

  await page.getByRole("button", { name: "Call" }).click();

  await expect.poll(() => callRequested).toBe(true);
});
