import { expect, test } from "@playwright/test";

test("faz login e visualiza o dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("marina@familiaoliveira.com.br");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText("Bom te ver, Marina")).toBeVisible();
});

test("cria lancamento, evento e tarefa no modo demo", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("marina@familiaoliveira.com.br");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();

  await page.goto("/dashboard/financas");
  await page.getByLabel("Título").fill("Compra de frutas");
  await page.getByLabel("Valor").fill("88.3");
  await page.getByRole("button", { name: "Criar lançamento" }).click();
  await expect(page.getByText("Compra de frutas")).toBeVisible();

  await page.goto("/dashboard/agenda");
  await page.getByLabel("Título").fill("Levar bolo para a escola");
  await page.getByRole("button", { name: "Criar evento" }).click();
  await expect(page.getByText("Levar bolo para a escola")).toBeVisible();

  await page.goto("/dashboard/tarefas");
  await page.getByLabel("Título").fill("Separar material de artes");
  await page.getByRole("button", { name: "Criar tarefa" }).click();
  await expect(page.getByText("Separar material de artes")).toBeVisible();
});

test("abre a tela de bloqueio e permite selecionar plano", async ({ page }) => {
  await page.goto("/billing/locked");
  await expect(
    page.getByText(/acesso está bloqueado|pagamento pendente/i),
  ).toBeVisible();
  await page.goto("/select-plan");
  await page.getByRole("button", { name: "Escolher plano" }).nth(2).click();
  await expect(page).toHaveURL(/billing\/success/);
});
