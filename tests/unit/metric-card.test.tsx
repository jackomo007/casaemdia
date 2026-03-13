import { render, screen } from "@testing-library/react";

import { MetricCard } from "@/components/shared/metric-card";

describe("MetricCard", () => {
  it("renderiza titulo, valor e helper", () => {
    render(
      <MetricCard
        metric={{
          id: "balance",
          label: "Saldo do mes",
          value: "R$ 3.854,70",
          helper: "Previsao positiva",
          trend: "up",
        }}
      />,
    );

    expect(screen.getByText("Saldo do mes")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.854,70")).toBeInTheDocument();
    expect(screen.getByText("Previsao positiva")).toBeInTheDocument();
  });
});
