export const countries = [
  { value: 'BR', label: 'Brasil' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'CA', label: 'Canadá' },
  { value: 'PT', label: 'Portugal' },
  { value: 'ES', label: 'Espanha' },
  { value: 'FR', label: 'França' },
  { value: 'DE', label: 'Alemanha' },
  { value: 'IT', label: 'Itália' },
  { value: 'GB', label: 'Reino Unido' },
  { value: 'JP', label: 'Japão' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'Índia' },
  { value: 'AU', label: 'Austrália' },
  { value: 'NZ', label: 'Nova Zelândia' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colômbia' },
  { value: 'PE', label: 'Peru' }
].sort((a, b) => a.label.localeCompare(b.label))

export const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
].sort((a, b) => a.label.localeCompare(b.label))

export const productRoles = [
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'product_owner', label: 'Product Owner' },
  { value: 'product_designer', label: 'Product Designer' },
  { value: 'product_analyst', label: 'Product Analyst' },
  { value: 'product_marketing', label: 'Product Marketing Manager' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'cto', label: 'CTO' },
  { value: 'founder', label: 'Founder' },
  { value: 'other', label: 'Outro' }
].sort((a, b) => a.label.localeCompare(b.label))

export const productTypes = [
  { value: 'saas', label: 'SaaS' },
  { value: 'mobile_app', label: 'Aplicativo Mobile' },
  { value: 'e_commerce', label: 'E-commerce' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'enterprise', label: 'Enterprise Software' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
  { value: 'other', label: 'Outro' }
].sort((a, b) => a.label.localeCompare(b.label))