import { expect, test } from "@playwright/test";

test("faz login e visualiza o dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("marina@familiaoliveira.com.br");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText("Bom te ver, Marina")).toBeVisible();
});

test("usa agenda, planilha rapida e busca do topo", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("marina@familiaoliveira.com.br");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);

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
  await expect(page.getByText("Estruture renda e contas fixas")).toBeVisible();
});

test("abre a tela de bloqueio e permite selecionar plano", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("marina@familiaoliveira.com.br");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/billing/locked");
  await expect(
    page.getByText(/acesso está bloqueado|pagamento pendente/i),
  ).toBeVisible();
  await page.goto("/select-plan");
  await page.getByRole("button", { name: "Escolher plano" }).nth(2).click();
  await expect(page).toHaveURL(/billing\/success/);
});
