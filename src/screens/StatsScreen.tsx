import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../types/book';
import { PaperHeader } from '../components/PaperHeader';
import { Colors, Shadows } from '../constants/theme';

interface StatsScreenProps {
  books: BookCard[];
  annualGoal: number;
  onUpdateAnnualGoal: (goal: number) => void;
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  books,
  annualGoal,
  onUpdateAnnualGoal,
  onBack,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(annualGoal));

  // Métricas calculadas
  const totalBooks = books.length;
  
  const averageRating =
    totalBooks > 0
      ? (books.reduce((acc, curr) => acc + curr.rating, 0) / totalBooks).toFixed(1)
      : '0.0';

  const totalPagesRead = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);

  // Formatos
  const formatCounts = books.reduce(
    (acc, curr) => {
      acc[curr.format] = (acc[curr.format] || 0) + 1;
      return acc;
    },
    { fisico: 0, digital: 0, audiolivro: 0 } as Record<string, number>
  );

  // Gêneros mais lidos
  const genreCounts = books.reduce((acc, curr) => {
    if (curr.genre) {
      acc[curr.genre] = (acc[curr.genre] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Progresso da meta anual
  const progressPercent = Math.min(Math.round((totalBooks / (annualGoal || 1)) * 100), 100);

  const handleSaveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Valor inválido', 'Digite uma quantidade válida para a meta anual.');
      return;
    }
    onUpdateAnnualGoal(val);
    setIsEditingGoal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a biblioteca"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <PaperHeader title="ESTATÍSTICAS" subtitle="Meu Panorama de Leitura" />

        {/* Card: Meta Anual com Barra de Progresso */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleGroup}>
              <Ionicons name="flag-outline" size={18} color={Colors.primaryDark} />
              <Text style={styles.cardTitle}>Meta Anual de Leitura</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsEditingGoal(!isEditingGoal)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editGoalBtnText}>
                {isEditingGoal ? 'Cancelar' : 'Ajustar meta'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditingGoal ? (
            <View style={styles.goalEditRow}>
              <TextInput
                style={styles.goalInput}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="numeric"
                placeholder="Ex: 24"
              />
              <TouchableOpacity style={styles.goalSaveBtn} onPress={handleSaveGoal}>
                <Text style={styles.goalSaveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.progressInfoRow}>
              <Text style={styles.progressMainText}>
                <Text style={styles.progressHighlight}>{totalBooks}</Text> de {annualGoal} livros lidos
              </Text>
              <Text style={styles.percentText}>{progressPercent}%</Text>
            </View>
          )}

          {/* Barra de progresso visual */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          <Text style={styles.progressSubtext}>
            {totalBooks >= annualGoal
              ? '🎉 Parabéns! Você atingiu sua meta de leitura!'
              : `Faltam ${Math.max(0, annualGoal - totalBooks)} livro(s) para completar seu objetivo.`}
          </Text>
        </View>

        {/* Grid de Resumo: Total lido, Média de Avaliação, Páginas */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, Shadows.soft]}>
            <Ionicons name="book-outline" size={24} color={Colors.primaryDark} />
            <Text style={styles.metricValue}>{totalBooks}</Text>
            <Text style={styles.metricLabel}>Livros Lidos</Text>
          </View>

          <View style={[styles.metricCard, Shadows.soft]}>
            <Ionicons name="star" size={24} color={Colors.starActive} />
            <Text style={styles.metricValue}>{averageRating}</Text>
            <Text style={styles.metricLabel}>Média Geral</Text>
          </View>

          <View style={[styles.metricCard, Shadows.soft]}>
            <Ionicons name="document-text-outline" size={24} color={Colors.secondary} />
            <Text style={styles.metricValue}>{totalPagesRead}</Text>
            <Text style={styles.metricLabel}>Páginas Lidas</Text>
          </View>
        </View>

        {/* Card: Livros por Formato */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.cardTitleGroup}>
            <Ionicons name="pie-chart-outline" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>Livros por Formato</Text>
          </View>

          <View style={styles.formatList}>
            <View style={styles.formatItem}>
              <View style={styles.formatLeft}>
                <Ionicons name="book-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.formatName}>Físico</Text>
              </View>
              <Text style={styles.formatCount}>{formatCounts.fisico} livro(s)</Text>
            </View>

            <View style={styles.formatItem}>
              <View style={styles.formatLeft}>
                <Ionicons name="tablet-portrait-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.formatName}>Digital (E-book)</Text>
              </View>
              <Text style={styles.formatCount}>{formatCounts.digital} livro(s)</Text>
            </View>

            <View style={styles.formatItem}>
              <View style={styles.formatLeft}>
                <Ionicons name="headset-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.formatName}>Audiolivro</Text>
              </View>
              <Text style={styles.formatCount}>{formatCounts.audiolivro} livro(s)</Text>
            </View>
          </View>
        </View>

        {/* Card: Gêneros Mais Lidos */}
        <View style={[styles.card, Shadows.card]}>
          <View style={styles.cardTitleGroup}>
            <Ionicons name="bookmarks-outline" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>Gêneros Mais Lidos</Text>
          </View>

          {sortedGenres.length > 0 ? (
            <View style={styles.genresContainer}>
              {sortedGenres.map(([genre, count], idx) => (
                <View key={genre} style={styles.genreRow}>
                  <View style={styles.genreRankCircle}>
                    <Text style={styles.genreRankText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.genreRowName}>{genre}</Text>
                  <Text style={styles.genreRowCount}>{count} obra(s)</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNote}>
              Adicione o gênero dos livros nas fichas para visualizar este gráfico!
            </Text>
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
  navBar: {
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 6,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'serif',
  },
  editGoalBtnText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  goalEditRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 8,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    fontSize: 14,
  },
  goalSaveBtn: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  goalSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  progressMainText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  progressHighlight: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  percentText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#F2E9E1',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryDark,
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  formatList: {
    gap: 10,
    marginTop: 4,
  },
  formatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5ECE3',
  },
  formatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formatName: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  formatCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  genresContainer: {
    gap: 10,
    marginTop: 4,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  genreRankCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  genreRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  genreRowName: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  genreRowCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  emptyNote: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
