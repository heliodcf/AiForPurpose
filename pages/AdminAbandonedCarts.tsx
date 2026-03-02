import React, { useEffect, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { db } from "../services/db";
import { Alert } from "../components/Alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const AdminAbandonedCarts: React.FC = () => {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const fetchCarts = (currentPage: number) => {
    setLoading(true);
    db.getAbandonedCarts(currentPage, limit)
      .then((response) => {
        setCarts(response.data);
        setTotalCount(response.totalCount);
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao buscar carrinhos abandonados:", err);
        setError("Não foi possível carregar a lista de carrinhos abandonados.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCarts(page);
  }, [page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Carrinhos Abandonados
          </h2>
          <p className="text-slate-500 mt-1">
            Leads que iniciaram o atendimento mas não concluíram.
          </p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <svg
              className="w-12 h-12 text-slate-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>Nenhum carrinho abandonado encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nome</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Telefone</th>
                  <th className="px-6 py-4 font-semibold">Data de Criação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {carts.map((cart) => (
                  <tr
                    key={cart.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {cart.lead?.name || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {cart.lead?.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {cart.lead?.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {format(
                        new Date(cart.created_at),
                        "dd 'de' MMMM, yyyy 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && carts.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            de <span className="font-medium">{totalCount}</span> carrinhos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <div className="text-sm text-slate-600 font-medium px-2">
              Página {page} de {totalPages || 1}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
