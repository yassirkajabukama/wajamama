import { Icon, Txt } from '@/components/ui/kit';
import { BottomSheetWrapper, SHEET_CONTENT_PADDING } from '@/components/bottomsheets/wrapper';
import { countries } from '@/lib/countries';
import { radii, spacing } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';
import {
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export interface Country {
  id: number;
  name: string;
  iso2: string;
  phone_code: string;
  emoji: string;
  native?: string | null;
}

export type { Country as CountryType };

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  disabled?: boolean;
  style?: object;
}

export function CountrySelector({ selectedCountry, onSelect, disabled = false, style }: CountrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const sheetRef = useRef<BottomSheetModal>(null);

  const filteredCountries = useMemo(
    () =>
      countries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone_code.includes(searchQuery) ||
          (c.native && c.native.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [searchQuery],
  );

  const open = () => {
    if (!disabled) sheetRef.current?.present();
  };
  const close = () => {
    sheetRef.current?.dismiss();
    setSearchQuery('');
  };


  const renderItem = useCallback(
    ({ item: country }: { item: (typeof countries)[number] }) => (
      <Pressable
        key={country.id}
        onPress={() => { onSelect(country); close(); }}
        style={({ pressed }) => [
          styles.countryItem,
          {
            backgroundColor:
              selectedCountry.id === country.id ? colors.primaryContainer : 'transparent',
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text style={styles.flag}>{country.emoji}</Text>
        <View style={styles.countryDetails}>
          <Txt>{country.name}</Txt>
          <Txt kind="small" color={colors.onSurfaceVariant}>
            {country.native ? `${country.native} · ` : ''}+{country.phone_code}
          </Txt>
        </View>
        {selectedCountry.id === country.id && (
          <Icon name="checkmark" size={20} color={colors.primary} />
        )}
      </Pressable>
    ),
    [selectedCountry, colors],
  );

  return (
    <>
      <Pressable
        onPress={open}
        disabled={disabled}
        style={({ pressed }) => [
          styles.trigger,
          {
            borderColor: colors.outline,
            backgroundColor: pressed ? colors.surfaceContainer : colors.surfaceContainerLow,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <View style={styles.triggerContent}>
          <Text style={styles.flag}>{selectedCountry.emoji}</Text>
          <Txt kind="small">+{selectedCountry.phone_code}</Txt>
        </View>
        {!disabled && <Icon name="chevron-down" size={20} color={colors.onSurfaceVariant} />}
      </Pressable>

      <BottomSheetWrapper ref={sheetRef} snapPoints={['75%']}>
        <BottomSheetView style={styles.sheetContent}>
          {/* Fixed header — stays above the scrollable list */}
          <View style={styles.sheetHeader}>
            <Txt kind="heading">Select Country</Txt>
            <Pressable onPress={close} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.onSurface} />
            </Pressable>
          </View>
          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceContainerLow }]}>
            <Icon name="search" size={20} color={colors.onSurfaceVariant} />
            <BottomSheetTextInput
              style={[styles.searchInput, { color: colors.onSurface }]}
              placeholder="Search country..."
              placeholderTextColor={colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          {/* Scrollable list takes remaining height */}
          <BottomSheetFlatList
            data={filteredCountries}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
          />
        </BottomSheetView>
      </BottomSheetWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flag: { fontSize: 24 },

  sheetContent: {
    flex: 1,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SHEET_CONTENT_PADDING,
    paddingTop: SHEET_CONTENT_PADDING,
    paddingBottom: spacing.md,
  },
  closeButton: { padding: spacing.sm },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SHEET_CONTENT_PADDING,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 16, padding: 0 },

  list: { paddingBottom: spacing.xl },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  countryDetails: { flex: 1 },
});
