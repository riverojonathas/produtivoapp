interface IStatsCard {
  title: string;
  value: string | number;
  description?: string;
}

function StatsCard({ title, value, description }: IStatsCard) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total de Produtos"
        value={150}
        description="↗️ 12% em relação ao mês anterior"
      />
      <StatsCard
        title="Vendas do Mês"
        value="R$ 25.000"
        description="↘️ 5% em relação ao mês anterior"
      />
      <StatsCard
        title="Clientes Ativos"
        value={48}
      />
      <StatsCard
        title="Taxa de Conversão"
        value="8.5%"
        description="↗️ 2% em relação ao mês anterior"
      />
    </div>
  );
} 