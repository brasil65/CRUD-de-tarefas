# Contexto de Autenticação

## Responsável por
- Gerenciar sessão do usuário
- Fornecer hooks de autenticação (`useAuth`)
- Proteger rotas que requerem autenticação

## Tabelas utilizadas
- `auth.users` (gerenciado pelo Supabase Auth)

## Componentes
- `AuthProvider` - Provider que envolve a aplicação e fornece o contexto de auth
- `ProtectedRoute` - Componente que protege rotas autenticadas

## Páginas
- `Login.tsx` - Página de login
- `Register.tsx` - Página de cadastro

## Hooks
- `useAuth` - Hook para acessar o estado de autenticação

## Fluxo de autenticação
1. Usuário acessa `/login` ou `/register`
2. Após login bem-sucedido, é redirecionado para `/`
3. `ProtectedRoute` verifica se o usuário está autenticado
4. Se não estiver, redireciona para `/login`