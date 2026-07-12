import { expect, test, type BrowserContext } from "@playwright/test";

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

function createAccessToken(authority = "ROLE_USER") {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" })).replace(/=/g, "");
  const payload = btoa(JSON.stringify({ sub: "forhos@example.com", auth: authority })).replace(/=/g, "");

  return `${header}.${payload}.signature`;
}

async function signIn(context: BrowserContext, authority = "ROLE_USER") {
  await context.addCookies([
    {
      name: "access_token",
      value: createAccessToken(authority),
      url: "http://127.0.0.1:4173",
    },
    {
      name: "refresh_token",
      value: "refresh-token",
      url: "http://127.0.0.1:4173",
    },
    {
      name: "grant_type",
      value: "Bearer",
      url: "http://127.0.0.1:4173",
    },
  ]);
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

test("registers a new member and moves to login", async ({ page }) => {
  let registerRequested = false;

  await page.route("**/api/members/register", async (route) => {
    registerRequested = true;
    await expect(route.request().postDataJSON()).toMatchObject({
      email: "new@forhos.test",
      name: "김포호",
      age: 28,
      phone: "010-1234-5678",
      gender: "none",
      region: "seoul",
    });
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: 11,
        email: "new@forhos.test",
        name: "김포호",
        phone: "010-1234-5678",
        age: 28,
        gender: "none",
        region: "seoul",
      }),
    });
  });

  await page.goto("/signup");
  await page.getByLabel("이름").fill("김포호");
  await page.getByLabel("나이").fill("28");
  await page.getByLabel("이메일").fill("new@forhos.test");
  await page.getByLabel("휴대폰 번호").fill("010-1234-5678");
  await page.getByLabel("성별").selectOption("none");
  await page.getByLabel("주 이용 지역").selectOption("seoul");
  await page.getByLabel("비밀번호", { exact: true }).fill("password123");
  await page.getByLabel("비밀번호 확인").fill("password123");
  await page.getByLabel("특이사항").fill("고혈압 약 복용 중");
  await page.getByRole("button", { name: "가입하기" }).click();

  await expect.poll(() => registerRequested).toBe(true);
  await expect(page).toHaveURL(/\/login$/);
});

test("creates a reception and checks queue status", async ({ context, page }) => {
  await signIn(context);

  let createRequested = false;

  await page.route("**/api/reception", async (route) => {
    createRequested = true;
    await expect(route.request().postDataJSON()).toMatchObject({
      hospitalId: 1,
      patientName: "Alex Kim",
      visitType: "FIRST",
      symptom: "Headache",
    });
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify(mockReception),
    });
  });
  await page.route("**/api/reception/hospital/7/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        receptionId: 7,
        hospitalId: 1,
        hospitalName: "FORHOS Clinic",
        status: "WAITING",
        queueNumber: 2,
        waitingCount: 1,
      }),
    });
  });

  await page.goto("/hospital/input?hospitalId=1");
  await expect(page.getByText("대기 접수")).toBeVisible();
  await page.getByLabel("방문 병원").selectOption("1");
  await page.getByLabel("환자 이름").fill("Alex Kim");
  await page.getByLabel("증상 메모").fill("Headache");
  await page.getByRole("button", { name: "접수 완료하기" }).click();

  await expect.poll(() => createRequested).toBe(true);
  await expect(page).toHaveURL(/\/hospital\/done$/);
  await expect(page.getByRole("heading", { name: "접수가 완료되었습니다" })).toBeVisible();
  await expect(page.getByText("2번")).toBeVisible();

  await page.getByRole("button", { name: "대기 현황 보기" }).click();

  await expect(page).toHaveURL(/\/hospital\/status$/);
  await expect(page.getByText("내 접수 상태")).toBeVisible();
  await expect(page.getByText("진료 대기").first()).toBeVisible();
  await expect(page.getByText("1명")).toBeVisible();
});

test("shows my receptions and cancels a waiting reception", async ({ context, page }) => {
  await signIn(context);

  let cancelRequested = false;

  await page.route("**/api/reception/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockReception]),
    });
  });
  await page.route("**/api/reception/7/cancel", async (route) => {
    cancelRequested = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...mockReception,
        queueStatus: "CANCELED",
        canceledTime: "2026-05-23T09:40:00",
      }),
    });
  });

  await page.goto("/reception/me");
  await expect(page.getByText("내 접수 내역")).toBeVisible();
  await expect(page.getByText("FORHOS Clinic")).toBeVisible();

  await page.getByRole("button", { name: "접수 취소" }).click();

  await expect.poll(() => cancelRequested).toBe(true);
});

test("lets hospital admins call a waiting reception", async ({ context, page }) => {
  let callRequested = false;

  await signIn(context, "ROLE_HOSPITAL_ADMIN");
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
