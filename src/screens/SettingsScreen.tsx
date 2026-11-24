import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppSettings, BookCard } from '../types/book';
import { LightTheme, DarkTheme, Shadows } from '../constants/theme';
import { ExportService } from '../services/exportService';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  books: BookCard[];
  onClearData: () => void;
  onBack: () => void;
  isDark: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  books,
  onClearData,
  onBack,
  isDark,
}) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const [goalInput, setGoalInput] = useState(String(settings.annualGoal || 12));
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const handleSaveGoal = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) {
      onUpdateSettings({ annualGoal: val });
      setIsEditingGoal(false);
      Alert.alert('Sucesso', 'Meta anual atualizada!');
    }
  };

  const handleExportAll = async () => {
    if (books.length === 0) {
      Alert.alert('Vazio', 'Você ainda não tem fichas de leitura salvas para exportar.');
      return;
    }
    // Exporta o primeiro ou o mais recente como exemplo
    await ExportService.exportAsPdf(books[0]);
  };

  const handleClearPrompt = () => {
    Alert.alert(
      'Atenção',
      'Deseja apagar todas as fichas e redefinir o caderno para os dados iniciais?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir Tudo',
          style: 'destructive',
          onPress: onClearData,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
            <Text style={[styles.backBtnText, { color: theme.textPrimary }]}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Configurações</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          Personalize sua experiência de leitura
        </Text>

        {/* 1. TEMA CLARO / ESCURO */}
        <View style={[styles.sectionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={theme.primaryDark} />
              <View style={styles.itemTextCol}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Modo Escuro</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  {isDark ? 'Ativado (leitura noturna suave)' : 'Desativado (estilo papel creme clássico)'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(val) => onUpdateSettings({ darkMode: val })}
              trackColor={{ false: '#E0D2C7', true: theme.primaryDark }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 2. META ANUAL DE LEITURA */}
        <View style={[styles.sectionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons name="flag-outline" size={22} color={theme.secondary} />
              <View style={styles.itemTextCol}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Meta Anual de Leitura</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  {settings.annualGoal} livros previstos para este ano
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setIsEditingGoal(!isEditingGoal)}>
              <Text style={[styles.actionLink, { color: theme.primaryDark }]}>
                {isEditingGoal ? 'Fechar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditingGoal && (
            <View style={styles.goalEditRow}>
              <TextInput
                style={[styles.goalInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                value={goalInput}
                onChangeText={setGoalInput}
                keyboardType="numeric"
              />
              <TouchableOpacity style={[styles.goalSaveBtn, { backgroundColor: theme.primaryDark }]} onPress={handleSaveGoal}>
                <Text style={styles.goalSaveBtnText}>Salvar Meta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 3. ANIMAÇÃO DE VIRAR PÁGINA */}
        <View style={[styles.sectionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons name="swap-horizontal-outline" size={22} color={theme.accent} />
              <View style={styles.itemTextCol}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Animação de Virar Página</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  Transição suave ao avançar fichas do caderno
                </Text>
              </View>
            </View>
            <Switch
              value={settings.pageTurnAnimation}
              onValueChange={(val) => onUpdateSettings({ pageTurnAnimation: val })}
              trackColor={{ false: '#E0D2C7', true: theme.primaryDark }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 4. ARMAZENAMENTO E FOTOS */}
        <View style={[styles.sectionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons name="images-outline" size={22} color={theme.primaryDark} />
              <View style={styles.itemTextCol}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Armazenamento e Fotos</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  {books.length} fichas salvas localmente
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. EXPORTAR FICHAS */}
        <TouchableOpacity
          style={[styles.sectionCard, Shadows.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={handleExportAll}
        >
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Ionicons name="document-text-outline" size={22} color={theme.secondary} />
              <View style={styles.itemTextCol}>
                <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Exportar Fichas em PDF</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  Gere folhas pautadas elegantes para impressão ou arquivo
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </View>
        </TouchableOpacity>

        {/* REDEFINIR DADOS */}
        <TouchableOpacity style={styles.clearDataBtn} onPress={handleClearPrompt}>
          <Ionicons name="trash-outline" size={16} color={theme.danger} style={{ marginRight: 6 }} />
          <Text style={[styles.clearDataText, { color: theme.danger }]}>Redefinir Dados do Aplicativo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topBar: {
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  screenSubtitle: {
    fontSize: 13,
    marginBottom: 16,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  itemTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  actionLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  goalEditRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  goalInput: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
  },
  goalSaveBtn: {
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  goalSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  clearDataBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 10,
  },
  clearDataText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
