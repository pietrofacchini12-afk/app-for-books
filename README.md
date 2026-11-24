# 📖 Ficha de Leitura (Mobile App)

Um aplicativo mobile encantador e aconchegante para registrar, avaliar e eternizar suas leituras, inspirado na textura afetiva de um caderno/fichário literário artesanal.

---

## 📱 Nova Arquitetura e Estrutura de Telas

O aplicativo foi totalmente reformulado com uma navegação na parte inferior e proporções calibradas para qualquer tela de celular (sem botões inalcançáveis e com barra de navegação ergonômica):

### 1. Início ([MainHomeScreen.tsx](file:///C:/Users/Startklar/.gemini/antigravity/scratch/ficha-de-leitura/src/screens/MainHomeScreen.tsx))
- **Continuar lendo**: card destacado que abre diretamente a última ficha/página que você estava visualizando.
- **Abrir meu livro de leitura**: atalho para o modo folheável.
- **Pesquisar livros**: atalho para o catálogo online.
- **Minha Biblioteca**: carrossel com as capas salvas e indicação da página.

### 2. Abrir Meu Livro de Leitura ([BookReaderScreen.tsx](file:///C:/Users/Startklar/.gemini/antigravity/scratch/ficha-de-leitura/src/screens/BookReaderScreen.tsx))
- **Página anterior (←)** e **Próxima página (→)**.
- **Ficha atual do livro**: layout idêntico à folha pautada da referência (capa 3x4, título, autor, estrelas, formato, gênero, personagem, resenha e opinião).
- **Ir para página [número editável]**: digite o número da página desejada e pule direto para ela.
- **Adicionar livro nesta página**: se a página estiver em branco, toque no botão para cadastrar uma ficha diretamente naquela página do caderno.

### 3. Pesquisar Livros Online ([SearchBooksScreen.tsx](file:///C:/Users/Startklar/.gemini/antigravity/scratch/ficha-de-leitura/src/screens/SearchBooksScreen.tsx))
- Busca online por **Título**, **Autor** ou **ISBN** através da API aberta da Open Library.
- Resultados com capa original, título, autor, ano de publicação e ISBN.
- **Adicionar à minha biblioteca**:
  - Opção de manter a capa original ou **escolher foto própria da capa** tirando com a câmera ou da galeria.
  - Criar ficha em uma nova página ou escolher o número da página desejada.

### 4. Minha Biblioteca ([LibraryShelfScreen.tsx](file:///C:/Users/Startklar/.gemini/antigravity/scratch/ficha-de-leitura/src/screens/LibraryShelfScreen.tsx))
- Visualização em **Grade/Estante de capas** ou em **Lista**.
- Busca instantânea entre os livros salvos.
- Filtros por toque: **Todos**, **Favoritos ♥**, **Físico 📖**, **E-book 📱**, **Audiolivro 🎧** e **5 Estrelas ★**.
- Ao tocar no livro, abre sua ficha/página correspondente.

### 5. Configurações ([SettingsScreen.tsx](file:///C:/Users/Startklar/.gemini/antigravity/scratch/ficha-de-leitura/src/screens/SettingsScreen.tsx))
- **Tema Claro / Escuro**: alternância suave entre o papel creme pólen e o modo noturno aconchegante.
- **Meta anual de leitura**: contador e ajuste de meta.
- **Animação de virar página**: toggle de preferência visual.
- **Armazenamento e fotos**: status dos registros salvos localmente.
- **Exportar fichas**: geração e compartilhamento em PDF estilizado.
- **Redefinir dados**: opção de limpar e restaurar exemplos.

---

## 📦 Como Gerar o APK para Instalar no Celular

O projeto já está configurado com `eas.json` pronto para gerar o arquivo `.apk` direto para instalação no Android (sem precisar de Play Store):

### Opção 1: Gerar o APK com EAS Build (Nuvem Expo - Gratuito)
1. No terminal do seu computador, entre na pasta:
   ```bash
   cd "C:\Users\Startklar\.gemini\antigravity\scratch\ficha-de-leitura"
   ```
2. Faça login na sua conta gratuita do Expo (se não tiver, crie em [expo.dev](https://expo.dev)):
   ```bash
   eas login
   ```
3. Dispare a compilação do APK:
   ```bash
   eas build -p android --profile preview
   ```
4. Ao finalizar, o terminal exibirá um link e um **QR Code**: basta escanear com a câmera do celular para baixar o arquivo `.apk` diretamente e instalar no seu Android!

---

### Opção 2: Testar Imediatamente no Celular via Expo Go (Sem esperar build)
Se quiser rodar agora mesmo no celular:
1. Instale o aplicativo **Expo Go** na Google Play Store (Android) ou App Store (iOS).
2. No computador, execute:
   ```bash
   cd "C:\Users\Startklar\.gemini\antigravity\scratch\ficha-de-leitura"
   npx expo start
   ```
3. Aponte a câmera do seu celular para o QR Code gerado no terminal. O app abrirá instantaneamente com todas as telas e dados persistidos.
