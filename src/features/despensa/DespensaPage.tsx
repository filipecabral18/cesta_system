import { Link } from 'react-router-dom';
import { CATEGORIAS, CATEGORIA_LABELS } from '@/types';
import { useDespensa } from './useDespensa';
import ProdutoRow from './ProdutoRow';

export default function DespensaPage() {
  const { data: produtos, isLoading, isError } = useDespensa();

  return (
    <section className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Minha Despensa</h1>
        <p className="text-sm text-gray-500">
          Ajuste a quantidade de referência de cada item.
        </p>
      </header>

      {isLoading && (
        <p className="text-sm text-gray-400">Carregando despensa…</p>
      )}

      {isError && (
        <p className="text-sm text-red-600">
          Não foi possível carregar a despensa.
        </p>
      )}

      {produtos && produtos.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          Nenhum item ainda. Cadastre itens na aba{' '}
          <Link to="/itens" className="font-medium text-green-600">
            Itens
          </Link>{' '}
          para montar sua despensa.
        </div>
      )}

      {produtos && produtos.length > 0 && (
        <div className="space-y-4">
          {CATEGORIAS.map((categoria) => {
            const doGrupo = produtos.filter((p) => p.categoria === categoria);
            if (doGrupo.length === 0) return null;

            return (
              <div key={categoria}>
                <h2 className="mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {CATEGORIA_LABELS[categoria]}
                </h2>
                <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                  {doGrupo.map((produto) => (
                    <ProdutoRow key={produto.id} produto={produto} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
