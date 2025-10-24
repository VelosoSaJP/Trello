function App() {
  return (
    // 'h-screen': altura total da tela
    // 'bg-zinc-900': cor de fundo (um cinza escuro)
    // 'text-white': cor do texto branca
    // 'flex items-center justify-center': centraliza o conteúdo
    <div className="h-screen bg-zinc-900 text-white flex items-center justify-center">
      
      {/* 'text-5xl': tamanho da fonte grande */}
      {/* 'font-bold': negrito */}
      <h1 className="text-5xl font-bold">
        Meu Projeto Trello
      </h1>

    </div>
  )
}

export default App