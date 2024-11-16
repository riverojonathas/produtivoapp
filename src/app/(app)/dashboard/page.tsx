export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Visão Geral</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Acompanhe o desempenho dos seus produtos
      </p>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
              <span className="text-[var(--color-primary)]">$</span>
            </div>
            <div>
              <h3 className="text-sm text-[var(--color-text-secondary)]">MRR</h3>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">R$ 125.000</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500">+12.5%</span>
            <span className="text-[var(--color-text-secondary)] ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
              <span className="text-[var(--color-primary)]">👥</span>
            </div>
            <div>
              <h3 className="text-sm text-[var(--color-text-secondary)]">Usuários Ativos</h3>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">2,847</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500">+23.1%</span>
            <span className="text-[var(--color-text-secondary)] ml-2">vs. mês anterior</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
              <span className="text-[var(--color-primary)]">📈</span>
            </div>
            <div>
              <h3 className="text-sm text-[var(--color-text-secondary)]">NPS</h3>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">72</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500">+5</span>
            <span className="text-[var(--color-text-secondary)] ml-2">últimos 30 dias</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
              <span className="text-[var(--color-primary)]">↩️</span>
            </div>
            <div>
              <h3 className="text-sm text-[var(--color-text-secondary)]">Churn Rate</h3>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">2.3%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-500">-0.5%</span>
            <span className="text-[var(--color-text-secondary)] ml-2">vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Seções de entregas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Entregas Recentes</h2>
            <button className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Atualizar
            </button>
          </div>
          {/* Lista de entregas recentes aqui */}
        </div>

        <div className="p-6 rounded-xl bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Próximas Entregas</h2>
          </div>
          {/* Lista de próximas entregas aqui */}
        </div>
      </div>
    </div>
  )
} 