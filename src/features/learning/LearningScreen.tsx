import { ActionGroup, ActionRow } from '@/components/ui/ActionGroup';
import {
  Card,
  DataBoundary,
  Icon,
  Notice,
  Screen,
  Txt,
  go,
} from '@/components/ui/kit';
import { lessons } from '@/mocks/catalog';
import { useApp } from '@/providers/AppProvider';
import { useCardPalette, useThemeColors } from '@/theme/use-theme-colors';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function LearningScreen() {
  const palette = useCardPalette();
  const colors = useThemeColors();
  const { state, setState, t } = useApp();
  const toggleHeart = (id: string) =>
    setState((current) => ({
      ...current,
      likedLessons: current.likedLessons.includes(id)
        ? current.likedLessons.filter((lessonId) => lessonId !== id)
        : [...current.likedLessons, id],
    }));
  return (
    <Screen
      tab
      title={t(
        'Kidogo kila siku.\nJifunze kwa utulivu.',
        'A little every day.\nLearn at your pace.',
      )}
      subtitle={t(
        'Nafasi ya kusoma, kuuliza na kujiandaa.',
        'Space to read, ask, and prepare.',
      )}
    >
      <Notice>
        {t(
          'Makala za mfano. Moyo huonyesha unazopenda katika kikao hiki tu; mapitio ya kitabibu na lugha bado yanahitajika.',
          'Sample articles. Hearts mark favorites for this demo session only; clinical and language review is still required.',
        )}
      </Notice>
      <DataBoundary>
        {lessons.map((lesson, index) => {
          const liked = state.likedLessons.includes(lesson.id);
          const title = t(...lesson.title);
          return (
            <Card key={lesson.id} tone={palette[index % palette.length]}>
              <View style={styles.cardHeader}>
                <Txt kind='small'>
                  {t('SOMA', 'READ')} · {lesson.minutes}{' '}
                  {t('DAKIKA', 'MINUTES')}
                </Txt>
                <Pressable
                  accessibilityRole='button'
                  accessibilityLabel={
                    liked
                      ? t('Ondoa kwenye unazopenda', 'Remove from favorites')
                      : t('Ongeza kwenye unazopenda', 'Add to favorites')
                  }
                  accessibilityState={{ selected: liked }}
                  onPress={() => toggleHeart(lesson.id)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.heartButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Icon
                    name={liked ? 'heart' : 'heart-outline'}
                    size={27}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
              <Pressable
                accessibilityRole='button'
                accessibilityLabel={title}
                onPress={() => go(`/learning/${lesson.id}`)}
                style={({ pressed }) => [
                  styles.articleLink,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Txt kind='title'>{title}</Txt>
                <Txt>{t(...lesson.summary)}</Txt>
                <View style={styles.cardFooter}>
                  <Txt kind='small'>
                    {t('Timu ya mfano · Rasimu 1', 'Example team · Draft 1')}
                  </Txt>
                  <Icon name='chevron-forward' size={20} />
                </View>
              </Pressable>
            </Card>
          );
        })}
      </DataBoundary>
    </Screen>
  );
}

export function LearningDetail() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useApp();
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson)
    return (
      <Screen back title={t('Makala haipatikani', 'Article unavailable')}>
        <Notice>
          {t('Tafuta makala nyingine.', 'Try another article.')}
        </Notice>
      </Screen>
    );
  return (
    <Screen back title={t(...lesson.title)}>
      <Card tone={colors.lavender}>
        <Txt>{t(...lesson.summary)}</Txt>
        <Txt kind='small'>
          {t(
            'Rasimu ya mfano · Toleo 1 · Haijapitiwa kitabibu',
            'Example draft · Version 1 · Not clinically reviewed',
          )}
        </Txt>
      </Card>
      {lesson.sections.map((section, index) => (
        <Txt key={index} kind={index % 2 === 0 ? 'heading' : 'body'}>
          {t(...section)}
        </Txt>
      ))}
      <Notice>
        {t(
          'Sauti, kupakua na kushiriki zitapatikana baada ya maudhui kuidhinishwa.',
          'Audio, downloads and sharing become available after content approval.',
        )}
      </Notice>
      <ActionGroup>
        <ActionRow
          label={t('Uliza kuhusu maandalizi', 'Ask about preparation')}
          icon='chatbubble-outline'
          href='/assistant/chat'
        />
      </ActionGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heartButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  articleLink: { gap: 12 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
