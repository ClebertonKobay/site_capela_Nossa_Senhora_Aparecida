import type { UserRole } from "@/lib/session-token";

export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
};

export const ADMIN_NAV_BY_ROLE: Record<UserRole, AdminNavItem[]> = {
  admin: [
    { href: "/admin/celebrants", label: "Celebrantes", description: "Quem celebra cada missa do mês" },
    { href: "/admin/events", label: "Eventos", description: "Festas e venda de cartela" },
    { href: "/admin/orders", label: "Pedidos", description: "Quem pediu cartela" },
    { href: "/admin/pastorals/manage", label: "Pastorais", description: "Gerenciar as pastorais e seus membros" },
    { href: "/admin/catechesis", label: "Catequese", description: "Turmas, catequistas e catequizandos" },
    { href: "/admin/my-classes", label: "Minhas Turmas", description: "Ver turmas e marcar presença" },
    { href: "/admin/users", label: "Usuários", description: "Contas e papéis de acesso" },
  ],
  chapel_coordinator: [
    { href: "/admin/celebrants", label: "Celebrantes", description: "Quem celebra cada missa do mês" },
    { href: "/admin/events", label: "Eventos", description: "Festas e venda de cartela" },
    { href: "/admin/orders", label: "Pedidos", description: "Quem pediu cartela" },
  ],
  pastoral_coordinator: [
    { href: "/admin/pastorals", label: "Pastorais", description: "Cadastro de membros da sua pastoral" },
  ],
  catechesis_coordinator: [
    { href: "/admin/catechesis", label: "Catequese", description: "Turmas, catequistas e catequizandos" },
  ],
  catechist: [
    { href: "/admin/my-classes", label: "Minhas Turmas", description: "Ver turmas e marcar presença" },
  ],
};
