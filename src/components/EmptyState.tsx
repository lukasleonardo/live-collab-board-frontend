export const EmptyState=({ searchTerm }: { searchTerm: string }) =>{
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-dashed border-slate-300">
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-slate-400" />
      </div>
      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum resultado encontrado</h3>
          <p className="text-slate-500 max-w-md mb-4">
            Não encontramos nenhum board que corresponda a "{searchTerm}". Tente outro termo ou crie um novo board.
          </p>
          <Button variant="outline" onClick={() => {}}>
            Limpar pesquisa
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum board encontrado</h3>
          <p className="text-slate-500 max-w-md mb-4">
            Você ainda não tem nenhum board. Crie seu primeiro board para começar a organizar suas tarefas.
          </p>
          <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
            <Plus className="h-4 w-4" /> Criar primeiro board
          </Button>
        </>
      )}
    </div>
  )}