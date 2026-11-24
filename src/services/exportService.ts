import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { BookCard } from '../types/book';

export const ExportService = {
  getFormatLabel(format: string): string {
    switch (format) {
      case 'fisico':
        return '📖 Livro Físico';
      case 'digital':
        return '📱 Digital (E-book)';
      case 'audiolivro':
        return '🎧 Audiolivro';
      default:
        return 'Livro';
    }
  },

  generateBookHtml(book: BookCard): string {
    const starsHtml = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Ficha de Leitura - ${book.title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600&display=swap');
          
          body {
            font-family: 'Quicksand', sans-serif;
            background-color: #FAF6F0;
            color: #4A3E3D;
            margin: 0;
            padding: 30px;
          }
          .sheet-container {
            background-color: #FFFDF9;
            border: 2px solid #EADBC8;
            border-radius: 20px;
            padding: 35px;
            max-width: 650px;
            margin: 0 auto;
            box-shadow: 0 4px 15px rgba(74, 62, 61, 0.08);
            position: relative;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #EADBC8;
            padding-bottom: 18px;
            margin-bottom: 25px;
          }
          .header h1 {
            font-family: 'Lora', serif;
            letter-spacing: 4px;
            font-size: 26px;
            color: #4A3E3D;
            margin: 0;
            text-transform: uppercase;
          }
          .heart-icon {
            color: #E5989B;
            font-size: 18px;
            margin-top: 5px;
          }
          .top-section {
            display: flex;
            gap: 25px;
            margin-bottom: 25px;
          }
          .cover-box {
            width: 140px;
            height: 190px;
            border: 2px dashed #D4A373;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #FDFBF7;
            flex-shrink: 0;
          }
          .cover-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .cover-placeholder {
            font-size: 13px;
            color: #AFA098;
            text-align: center;
            padding: 10px;
          }
          .info-col {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          .info-row {
            border-bottom: 1px solid #F0E6DD;
            padding: 6px 0;
          }
          .info-label {
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #7F6A63;
            font-weight: 600;
          }
          .info-value {
            font-size: 17px;
            font-family: 'Lora', serif;
            color: #4A3E3D;
            margin-top: 2px;
          }
          .stars {
            color: #E5989B;
            font-size: 24px;
            letter-spacing: 4px;
            margin-top: 5px;
          }
          .pill-badge {
            display: inline-block;
            background-color: #FBE8E7;
            color: #B56576;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 5px;
          }
          .section-tag {
            background-color: #FBE8E7;
            color: #B56576;
            display: inline-block;
            padding: 4px 14px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .lined-box {
            background: repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 27px,
              #F2EAE1 28px
            );
            line-height: 28px;
            padding: 10px 14px;
            font-size: 14px;
            color: #4A3E3D;
            border: 1px solid #EADBC8;
            border-radius: 12px;
            min-height: 90px;
            margin-bottom: 20px;
            white-space: pre-wrap;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #AFA098;
            margin-top: 20px;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="sheet-container">
          <div class="header">
            <h1>Ficha de Leitura</h1>
            <div class="heart-icon">♥</div>
          </div>

          <div class="top-section">
            <div class="cover-box">
              ${
                book.coverUri
                  ? `<img src="${book.coverUri}" class="cover-img" alt="Capa" />`
                  : `<div class="cover-placeholder">3 x 4 cm<br/>Capa do livro</div>`
              }
            </div>
            <div class="info-col">
              <div class="info-row">
                <div class="info-label">Título:</div>
                <div class="info-value"><strong>${book.title}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">Autor(a):</div>
                <div class="info-value">${book.author}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Avaliação:</div>
                <div class="stars">${starsHtml}</div>
              </div>
              ${
                book.opinion
                  ? `<div><span class="pill-badge">✨ ${book.opinion}</span></div>`
                  : ''
              }
            </div>
          </div>

          <div style="display: flex; gap: 15px; margin-bottom: 18px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 130px; border: 1px solid #EADBC8; border-radius: 10px; padding: 10px;">
              <div class="info-label">Formato</div>
              <div style="font-weight: 600; margin-top: 4px;">${this.getFormatLabel(book.format)}</div>
            </div>
            ${
              book.pages
                ? `
            <div style="flex: 1; min-width: 110px; border: 1px solid #EADBC8; border-radius: 10px; padding: 10px;">
              <div class="info-label">Páginas</div>
              <div style="font-weight: 600; margin-top: 4px;">📄 ${book.pages} páginas</div>
            </div>`
                : ''
            }
            ${
              book.genre
                ? `
            <div style="flex: 1; min-width: 140px; border: 1px solid #EADBC8; border-radius: 10px; padding: 10px;">
              <div class="info-label">Gênero</div>
              <div style="font-weight: 600; margin-top: 4px;">🏷️ ${book.genre}</div>
            </div>`
                : ''
            }
            ${
              book.favoriteCharacter
                ? `
            <div style="flex: 1; min-width: 140px; border: 1px solid #EADBC8; border-radius: 10px; padding: 10px;">
              <div class="info-label">Personagem Favorito</div>
              <div style="font-weight: 600; margin-top: 4px;">👑 ${book.favoriteCharacter}</div>
            </div>`
                : ''
            }
          </div>

          ${
            book.review
              ? `
            <div class="section-tag">Minha Resenha:</div>
            <div class="lined-box">${book.review}</div>
          `
              : ''
          }

          ${
            book.myOpinion
              ? `
            <div class="section-tag">Minha Opinião:</div>
            <div class="lined-box">${book.myOpinion}</div>
          `
              : ''
          }

          <div class="footer">
            🌸 Ficha de Leitura Digital • Gerado com carinho
          </div>
        </div>
      </body>
      </html>
    `;
  },

  async exportAsPdf(book: BookCard): Promise<void> {
    try {
      const html = this.generateBookHtml(book);
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Ficha de Leitura - ${book.title}`,
        });
      } else {
        Alert.alert('PDF Gerado', `Arquivo pronto em: ${uri}`);
      }
    } catch (e: any) {
      console.error('Erro ao gerar PDF:', e);
      Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o PDF.');
    }
  },

  async printFicha(book: BookCard): Promise<void> {
    try {
      const html = this.generateBookHtml(book);
      await Print.printAsync({ html });
    } catch (e) {
      console.error('Erro ao imprimir:', e);
      Alert.alert('Erro', 'Não foi possível enviar para a impressora.');
    }
  },
};
