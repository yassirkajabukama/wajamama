import { ActionGroup, ActionRow } from '@/components/ui/ActionGroup';
import {
   Access,
   Button,
   Card,
   Icon,
   Notice,
   Row,
   Screen,
   Txt,
} from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { useThemeColors } from '@/theme/use-theme-colors';
import { useState } from 'react';

export default function GroupsScreen() {
   const colors = useThemeColors();
   const { state, update, t, offline } = useApp();
   const [error, setError] = useState('');
   const interest = () => {
      if (offline) {
         setError(t('Unganisha mtandao kwanza.', 'Reconnect first.'));
         return;
      }
      update({ membership: 'interest' });
   };
   return (
      <Access>
         <Screen
            tab
            title={t('Pamoja, tunajifunza.', 'Better together.')}
            subtitle={t('Uzazi Bora Pamoja', 'Uzazi Bora Pamoja')}
         >
            <Card tone={colors.lavender}>
               <Row>
                  <Icon name='people-outline' size={36} />
                  <Txt kind='small'>{t('HUDUMA YA KIKUNDI', 'GROUP CARE')}</Txt>
               </Row>
               <Txt kind='heading'>
                  {t(
                     'Nafasi ya kusikilizwa na kujifunza.',
                     'A space to be heard and learn.',
                  )}
               </Txt>
               <Txt>
                  {t(
                     'Kikundi kinaongozwa na mwezeshaji. Ushiriki na ratiba hutegemea mapitio ya timu.',
                     'A facilitator guides the group. Participation and schedules depend on team review.',
                  )}
               </Txt>
            </Card>
            {error && <Notice danger>{error}</Notice>}
            {state.membership === 'none' ? (
               <>
                  <Button
                     label={t(
                        'Ningependa kujiunga · mfano',
                        'I’m interested · demo',
                     )}
                     onPress={interest}
                  />
                  <ActionGroup>
                     <ActionRow
                        label={t('Kuhusu faragha ya kikundi', 'Group privacy')}
                        icon='shield-checkmark-outline'
                        href='/groups/invitation'
                     />
                  </ActionGroup>
               </>
            ) : state.membership === 'interest' ? (
               <>
                  <Notice>
                     {t(
                        'Nia yako imeandikwa katika mfano huu tu. Timu halisi haijapokea ombi.',
                        'Your interest is recorded only in this demo. No real team received it.',
                     )}
                  </Notice>
                  <ActionGroup>
                     <ActionRow
                        label={t(
                           'Angalia maelezo ya mwaliko wa mfano',
                           'Preview a sample invitation',
                        )}
                        icon='mail-outline'
                        href='/groups/invitation'
                     />
                  </ActionGroup>
               </>
            ) : state.membership === 'active' ? (
               <>
                  <Card tone={colors.mint}>
                     <Txt kind='small'>
                        {t('KIKUNDI CHA MFANO', 'SAMPLE GROUP')}
                     </Txt>
                     <Txt kind='heading'>
                        {t(
                           'Pamoja · kikundi cha mfano',
                           'Pamoja · sample cohort',
                        )}
                     </Txt>
                     <Txt>
                        {t(
                           'Mwezeshaji: Timu ya mfano (si mhudumu halisi)',
                           'Facilitator: Example team (not real staff)',
                        )}
                     </Txt>
                  </Card>
                  <ActionGroup title={t('KIKUNDI CHANGU', 'MY GROUP')}>
                     <ActionRow
                        label={t('Kikao kijacho', 'Next session')}
                        icon='calendar-outline'
                        href='/groups/session'
                     />
                     <ActionRow
                        label={t('Mazungumzo ya kikundi', 'Group discussion')}
                        icon='chatbubbles-outline'
                        href='/groups/discussion'
                     />
                     <ActionRow
                        label={t('Muulize mwezeshaji', 'Ask facilitator')}
                        icon='help-circle-outline'
                        href='/groups/ask'
                     />
                     <ActionRow
                        label={t('Baada ya kikao', 'Session follow-up')}
                        icon='document-text-outline'
                        href='/groups/follow-up'
                     />
                  </ActionGroup>
                  <ActionGroup>
                     <ActionRow
                        label={t(
                           'Ondoka kwenye kikundi cha mfano',
                           'Leave demo group',
                        )}
                        icon='exit-outline'
                        destructive
                        onPress={() =>
                           update({ membership: 'left', rsvp: false })
                        }
                     />
                  </ActionGroup>
               </>
            ) : (
               <>
                  <Notice>
                     {t(
                        'Hujajiunga na kikundi kwa sasa.',
                        'You are not currently in a group.',
                     )}
                  </Notice>
                  <Button
                     label={t('Onyesha nia tena', 'Express interest again')}
                     onPress={interest}
                  />
               </>
            )}
         </Screen>
      </Access>
   );
}
