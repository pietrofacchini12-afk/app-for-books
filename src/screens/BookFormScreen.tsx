import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BookCard, BookFormat, BookOpinion } from '../types/book';
import { StarRating } from '../components/StarRating';
import { PaperHeader } from '../components/PaperHeader';
import { Colors, Shadows } from '../constants/theme';

interface BookFormScreenProps {
  initialBook?: BookCard | null;
  onSave: (book: BookCard) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const BookFormScreen: React.FC<BookFormScreenProps> = ({
  initialBook,
  onSave,
  onCancel,
  onDelete,
}) => {
  const isEditing = !!initialBook;

  // Estados dos campos
  const [title, setTitle] = useState(initialBook?.title || '');
  const [author, setAuthor] = useState(initialBook?.author || '');
  const [pages, setPages] = useState(initialBook?.pages ? String(initialBook.pages) : '');
  const [genre, setGenre] = useState(initialBook?.genre || '');
  const [favoriteCharacter, setFavoriteCharacter] = useState(initialBook?.favoriteCharacter || '');
  const [format, setFormat] = useState<BookFormat>(initialBook?.format || 'fisico');
  const [rating, setRating] = useState<number>(initialBook?.rating || 5);
  const [opinion, setOpinion] = useState<BookOpinion | undefined>(initialBook?.opinion);
  const [review, setReview] = useState(initialBook?.review || '');
  const [myOpinion, setMyOpinion] = useState(initialBook?.myOpinion || '');
  const [isFavorite, setIsFavorite] = useState(initialBook?.isFavorite || false);
  const [coverUri, setCoverUri] = useState<string | undefined>(initialBook?.coverUri);

  // Erros de validação
  const [errors, setErrors] = useState<{ title?: string; author?: string }>({});

  const opinionsList: BookOpinion[] = [
    'Melhor livro que já li',
    'Gostei',
    'Não gostei',
    'Queria não ter lido',
  ];

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir acesso à galeria de fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setCoverUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setCoverUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const handleSelectCoverPrompt = () => {
    Alert.alert(
      'Capa do Livro',
      'Como deseja adicionar a foto da capa?',
      [
        { text: 'Tirar foto', onPress: takePhoto },
        { text: 'Escolher da galeria', onPress: pickImage },
        coverUri
          ? {
              text: 'Remover capa',
              style: 'destructive',
              onPress: () => setCoverUri(undefined),
            }
          : { text: 'Cancelar', style: 'cancel' },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const validate = (): boolean => {
    const errs: { title?: string; author?: string } = {};
    if (!title.trim()) {
      errs.title = 'O título do livro é obrigatório';
    }
    if (!author.trim()) {
      errs.author = 'O nome do autor é obrigatório';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Atenção', 'Por favor preencha os campos obrigatórios (Título e Autor).');
      return;
    }

    const savedBook: BookCard = {
      id: initialBook ? initialBook.id : Date.now().toString(),
      pageNumber: initialBook?.pageNumber || 1,
      title: title.trim(),
      author: author.trim(),
      pages: pages ? parseInt(pages, 10) : undefined,
      genre: genre.trim() || undefined,
      favoriteCharacter: favoriteCharacter.trim() || undefined,
      format,
      rating,
      opinion,
      review: review.trim() || undefined,
      myOpinion: myOpinion.trim() || undefined,
      isFavorite,
      coverUri,
      status: initialBook?.status || 'lido',
      completedAt: initialBook?.completedAt || new Date().toISOString(),
      createdAt: initialBook?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedBook);
  };

  const handleDelete = () => {
    if (!initialBook || !onDelete) return;

    Alert.alert(
      'Excluir Ficha',
      `Tem certeza que deseja apagar a ficha de "${initialBook.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(initialBook.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Folha Física de Papel */}
        <View style={[styles.paperSheet, Shadows.card]}>
          <PaperHeader
            title={isEditing ? 'EDITAR FICHA' : 'FICHA DE LEITURA'}
            subtitle="Registro Literário"
          />

          {/* Top Section: Capa 3x4 + Título & Autor + Avaliação */}
          <View style={styles.topSection}>
            <TouchableOpacity
              style={styles.coverBox}
              onPress={handleSelectCoverPrompt}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Adicionar ou alterar capa do livro"
            >
              {coverUri ? (
                <Image source={{ uri: coverUri }} style={styles.coverImage} resizeMode="cover" />
              ) : (
                <View style={styles.placeholderBox}>
                  <Ionicons name="camera-outline" size={28} color={Colors.secondary} />
                  <Text style={styles.coverBoxText}>3 x 4 cm</Text>
                  <Text style={styles.coverSubText}>Toque p/ foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.topRightCol}>
              {/* Título */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>TÍTULO:</Text>
                <TextInput
                  style={[styles.inputUnderline, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="Nome do livro"
                  placeholderTextColor={Colors.textMuted}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Autor */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>AUTOR:</Text>
                <TextInput
                  style={[styles.inputUnderline, errors.author && styles.inputError]}
                  value={author}
                  onChangeText={(a) => {
                    setAuthor(a);
                    if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                  }}
                  placeholder="Nome do(a) autor(a)"
                  placeholderTextColor={Colors.textMuted}
                />
                {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
              </View>

              {/* Avaliação em estrelas */}
              <View style={{ marginTop: 8 }}>
                <Text style={styles.fieldLabel}>AVALIAÇÃO:</Text>
                <StarRating rating={rating} size={28} interactive onRatingChange={setRating} />
              </View>
            </View>
          </View>

          {/* Favorito Checkbox/Toggle */}
          <TouchableOpacity
            style={styles.favoriteRow}
            onPress={() => setIsFavorite(!isFavorite)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={Colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.favoriteLabel}>
              {isFavorite ? 'Marcado como Livro Favorito ♥' : 'Marcar como favorito'}
            </Text>
          </TouchableOpacity>

          {/* Formato do Livro */}
          <View style={styles.boxSection}>
            <Text style={styles.boxTitle}>FORMATO DO LIVRO:</Text>
            <View style={styles.radioGroup}>
              {(['fisico', 'digital', 'audiolivro'] as BookFormat[]).map((fmt) => {
                const isSelected = format === fmt;
                const label =
                  fmt === 'fisico'
                    ? 'Físico 📖'
                    : fmt === 'digital'
                    ? 'Digital (E-book) 📱'
                    : 'Audiolivro 🎧';
                return (
                  <TouchableOpacity
                    key={fmt}
                    style={[styles.radioItem, isSelected && styles.radioItemSelected]}
                    onPress={() => setFormat(fmt)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? Colors.primaryDark : Colors.textMuted}
                    />
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Detalhes rápidos: Páginas, Gênero, Personagem Favorito */}
          <View style={styles.smallFieldsGrid}>
            <View style={styles.smallFieldItem}>
              <View style={styles.iconTag}>
                <Ionicons name="document-text-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.smallTagLabel}>PÁGINAS:</Text>
              </View>
              <TextInput
                style={styles.inputUnderline}
                value={pages}
                onChangeText={setPages}
                keyboardType="numeric"
                placeholder="Ex: 320"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.smallFieldItem}>
              <View style={styles.iconTag}>
                <Ionicons name="pricetag-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.smallTagLabel}>GÊNERO:</Text>
              </View>
              <TextInput
                style={styles.inputUnderline}
                value={genre}
                onChangeText={setGenre}
                placeholder="Ex: Ficção, Fantasia..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={[styles.smallFieldItem, { marginBottom: 14 }]}>
            <View style={styles.iconTag}>
              <Ionicons name="sparkles-outline" size={14} color={Colors.secondary} />
              <Text style={styles.smallTagLabel}>PERSONAGEM FAVORITO:</Text>
            </View>
            <TextInput
              style={styles.inputUnderline}
              value={favoriteCharacter}
              onChangeText={setFavoriteCharacter}
              placeholder="Quem marcou sua leitura?"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Sobre o Livro (Opinião Única com Checkboxes) */}
          <View style={styles.boxSection}>
            <View style={styles.badgeSectionTitle}>
              <Text style={styles.badgeSectionTitleText}>SOBRE O LIVRO</Text>
            </View>
            <View style={styles.opinionsGrid}>
              {opinionsList.map((op) => {
                const isSelected = opinion === op;
                return (
                  <TouchableOpacity
                    key={op}
                    style={[styles.opinionOption, isSelected && styles.opinionOptionSelected]}
                    onPress={() => setOpinion(isSelected ? undefined : op)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={18}
                      color={isSelected ? Colors.primaryDark : Colors.textMuted}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.opinionText, isSelected && styles.opinionTextSelected]}>
                      {op.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Minha Resenha (Pautado) */}
          <View style={styles.boxSection}>
            <View style={styles.badgeSectionTitle}>
              <Text style={styles.badgeSectionTitleText}>MINHA RESENHA:</Text>
            </View>
            <TextInput
              style={styles.linedInput}
              value={review}
              onChangeText={setReview}
              placeholder="Escreva um resumo ou análise sobre o enredo, universo e proposta do livro..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Minha Opinião (Pautado) */}
          <View style={styles.boxSection}>
            <View style={styles.badgeSectionTitle}>
              <Text style={styles.badgeSectionTitleText}>MINHA OPINIÃO:</Text>
            </View>
            <TextInput
              style={styles.linedInput}
              value={myOpinion}
              onChangeText={setMyOpinion}
              placeholder="Como essa leitura fez você se sentir? Quais foram seus momentos favoritos?"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Salvar Ficha</Text>
            </TouchableOpacity>
          </View>

          {/* Botão de Excluir (apenas em modo de edição) */}
          {isEditing && onDelete && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.danger} style={{ marginRight: 6 }} />
              <Text style={styles.deleteBtnText}>Excluir esta ficha</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  paperSheet: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  topSection: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  coverBox: {
    width: 105,
    height: 145,
    borderWidth: 2,
    borderColor: Colors.borderDashed,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    alignItems: 'center',
    padding: 6,
  },
  coverBoxText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  coverSubText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  topRightCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fieldRow: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  inputUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  inputError: {
    borderBottomColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 11,
    marginTop: 2,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 10,
  },
  favoriteLabel: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  boxSection: {
    marginVertical: 10,
  },
  boxTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFDF9',
  },
  radioItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radioLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  radioLabelSelected: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  smallFieldsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  smallFieldItem: {
    flex: 1,
  },
  iconTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  smallTagLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  badgeSectionTitle: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeSectionTitleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1.2,
  },
  opinionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FAF7F2',
  },
  opinionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 4,
  },
  opinionOptionSelected: {},
  opinionText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  opinionTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  linedInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFDF9',
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 22,
    minHeight: 85,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: '#F7EFE7',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.primaryDark,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 8,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
});
