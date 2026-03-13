import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("auth validation", () => {
  it("aceita login com credenciais em formato valido", () => {
    const result = loginSchema.safeParse({
      email: "usuario@exemplo.com",
      password: "Senha123",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita cadastro com senha fraca", () => {
    const result = registerSchema.safeParse({
      fullName: "Nova Pessoa",
      email: "nova@exemplo.com",
      password: "12345678",
    });

    expect(result.success).toBe(false);
  });

  it("aceita cadastro com senha forte minima", () => {
    const result = registerSchema.safeParse({
      fullName: "Nova Pessoa",
      email: "nova@exemplo.com",
      password: "Casa1234",
    });

    expect(result.success).toBe(true);
  });
});
