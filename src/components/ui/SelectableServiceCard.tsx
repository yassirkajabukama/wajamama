import { Icon, Txt } from '@/components/ui/kit';
import { useAppTheme } from '@/theme/use-theme-colors';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type IconName = ComponentProps<typeof Icon>['name'];

export function SelectableServiceCard({ title, description, icon, tone, selected, onPress }: {
  title: string; description: string; icon: IconName; tone: string; selected: boolean; onPress: () => void;
}) {
  const theme = useAppTheme();
  const colors = theme.colors;
  const selector = theme.components.selection;
  return <Pressable
    accessibilityRole="checkbox"
    accessibilityLabel={title}
    accessibilityHint={description}
    accessibilityState={{ checked: selected }}
    onPress={onPress}
    style={({ pressed }) => [styles.card, { backgroundColor: tone, borderRadius: theme.components.card.borderRadius, padding: theme.spacing.xl, gap: theme.spacing.sm, opacity: pressed ? 0.8 : 1 }]}>
    <View style={styles.top}>
      <Icon name={icon} size={34} />
      <View style={[styles.circle, { width: selector.size, height: selector.size, borderRadius: selector.borderRadius, backgroundColor: selected ? selector.selected : colors.surface, borderColor: selector.outline }]}>
        {selected && <Icon name="checkmark" size={19} color={selector.onSelected} />}
      </View>
    </View>
    <Txt kind="heading">{title}</Txt>
    <Txt kind="small">{description}</Txt>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { minHeight: 154 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  circle: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
