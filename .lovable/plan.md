## Plano: NovaBank 100% Funcional

### 1. Banco de Dados (Migrations)
- Tabela `profiles` — nome, CPF, telefone, agência, conta
- Tabela `transactions` — valor, tipo, categoria, método, destinatário, código único, timestamp
- Tabela `cofrinhos` — nome, meta, guardado, ícone
- RLS em todas as tabelas (cada usuário vê só seus dados)

### 2. Autenticação
- Página de Login/Cadastro com e-mail e senha
- Auto-criação de perfil ao registrar (trigger)
- Proteção de rotas (só logado acessa o app)
- Botão "Sair" funcional no Perfil

### 3. Funcionalidades Reais
- **Transferir**: Salva transação no banco, atualiza saldo
- **Extrato**: Busca transações reais do banco com código único
- **Cofrinhos**: CRUD real (criar, depositar, retirar, excluir)
- **Perfil**: Dados reais do usuário, editar nome
- **Saldo**: Calculado em tempo real a partir das transações
- **Home**: Tudo conectado ao backend

### 4. Ordem de Execução
1. Criar tabelas e RLS
2. Criar páginas de auth
3. Conectar todas as páginas ao Supabase
