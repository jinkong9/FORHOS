import { expect, test, type Page } from "@playwright/test";

const password = "password1234";

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(password);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/hospital\/list$/);
}

test("회원 접수부터 병원 관리자 완료 처리까지 실제 API로 동작한다", async ({ context, page }) => {
  await login(page, "user@forhos.test");

  await page.goto("/hospital/input?hospitalId=1");
  await expect(page.getByRole("heading", { name: "대기 접수" })).toBeVisible();
  await page.getByLabel("환자 이름").fill("통합환자");
  await page.getByLabel("증상 메모").fill("실제 API 통합 테스트 증상");

  const createResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith("/api/reception") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "접수 완료하기" }).click();
  const createResponse = await createResponsePromise;
  expect(createResponse.status()).toBe(201);
  const createdReception = (await createResponse.json()) as { id: number; queueStatus: string };
  expect(createdReception.queueStatus).toBe("WAITING");
  await expect(page.getByRole("heading", { name: "접수가 완료되었습니다" })).toBeVisible();

  await context.clearCookies();
  await login(page, "admin@forhos.test");
  await page.goto("/admin/receptions");
  await expect(page.getByRole("heading", { name: "접수 관리" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "통합환자" })).toBeVisible();

  const callResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith(`/api/reception/${createdReception.id}/call`) && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "호출", exact: true }).click();
  const callResponse = await callResponsePromise;
  expect(callResponse.status()).toBe(200);
  expect((await callResponse.json()).queueStatus).toBe("CALLED");

  const completeResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith(`/api/reception/${createdReception.id}/complete`) && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "완료", exact: true }).click();
  const completeResponse = await completeResponsePromise;
  expect(completeResponse.status()).toBe(200);
  expect((await completeResponse.json()).queueStatus).toBe("COMPLETED");
});
