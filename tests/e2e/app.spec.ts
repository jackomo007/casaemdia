import { expect, test, type Page } from "@playwright/test";

const e2eEmail = process.env.E2E_EMAIL;
const e2ePassword = process.env.E2E_PASSWORD;

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(e2eEmail ?? "");
  await page.getByLabel("Senha").fill(e2ePassword ?? "");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);
}

test.describe("fluxo autenticado", () => {
  test.skip(
    !e2eEmail || !e2ePassword,
    "Defina E2E_EMAIL e E2E_PASSWORD para executar os testes end-to-end.",
  );

  test("faz login e visualiza o dashboard", async ({ page }) => {
    await signIn(page);
    await expect(page.getByText(/Bom te ver,/i)).toBeVisible();
  });

  test("usa agenda, planilha rapida e busca do topo", async ({ page }) => {
    await signIn(page);

    await page.goto("/dashboard/agenda");
    await expect(page.getByRole("button", { name: "Mes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Semana" })).toBeVisible();
    await page.getByRole("button", { name: "Semana" }).click();
    await expect(page.locator("#event-title")).toBeVisible();

    await page.goto("/dashboard/financas");
    await page
      .getByLabel("Custos que não podem travar nome 1")
      .fill("Compra de frutas");
    await page.getByLabel("Custos que não podem travar valor 1").fill("88.3");
    await expect(
      page.getByLabel("Custos que não podem travar nome 1"),
    ).toHaveValue("Compra de frutas");

    await page.getByLabel("Buscar no painel").fill("renda");
    await page.getByLabel("Buscar no painel").press("Enter");
    await expect(page).toHaveURL(/dashboard\/busca/);
    await expect(
      page.getByText("Estruture renda e contas fixas"),
    ).toBeVisible();
  });

  test("abre a tela de bloqueio e permite selecionar plano", async ({
    page,
  }) => {
    await signIn(page);

    await page.goto("/billing/locked");
    await expect(
      page.getByText(/acesso está bloqueado|pagamento pendente/i),
    ).toBeVisible();
    await page.goto("/select-plan");
    await page.getByRole("button", { name: "Escolher plano" }).nth(2).click();
    await expect(page).toHaveURL(/billing\/success/);
  });
});
