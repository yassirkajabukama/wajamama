import {
   Access,
   Button,
   Card,
   Chip,
   Field,
   go,
   Notice,
   Row,
   Screen,
   Txt,
} from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { useThemeColors } from '@/theme/use-theme-colors';
import { useState, type ReactNode } from 'react';

function GroupAccess({ children }: { children: ReactNode }) {
   const { state, t } = useApp();
   return state.membership === 'active' ? (
      <Access>{children}</Access>
   ) : (
      <Screen back title={t('Kikundi hakipatikani', 'Group unavailable')}>
         <Notice>
            {t(
               'Unahitaji uanachama ulioidhinishwa ili kuona mazungumzo na nyenzo za kikundi.',
               'You need an approved membership to view group conversations and resources.',
            )}
         </Notice>
         <Button
            label={t('Rudi Pamoja', 'Back to Pamoja')}
            onPress={() => go('/pamoja')}
         />
      </Screen>
   );
}
export function Invitation() {
   const colors = useThemeColors();
   const { update, consent, t, offline } = useApp();
   const [agree, setAgree] = useState(false);
   return (
      <Access>
         <Screen back title={t('Jiunge na kikundi', 'Join a group')}>
            <Card tone={colors.lavender}>
               <Txt kind='heading'>
                  {t('Mwaliko wa mfano', 'Sample invitation')}
               </Txt>
               <Txt>
                  {t(
                     'Ratiba, ukubwa wa kikundi na vigezo vya kushiriki vitathibitishwa na timu. Hakuna mwaliko halisi uliotumwa.',
                     'The team must confirm schedule, group size and eligibility. No real invitation was sent.',
                  )}
               </Txt>
            </Card>
            <Txt>
               {t(
                  'Wenzako wanaweza kuona jina utakalochagua na unachochapisha. Wafanyakazi walioidhinishwa wanaweza kuona mtumaji wa swali lililofichwa kwa wenzako. Picha za skrini haziwezi kuzuiwa kabisa.',
                  'Peers can see your chosen name and posts. Authorized staff can identify the sender of a question hidden from peers. Screenshots cannot be fully prevented.',
               )}
            </Txt>
            <Notice>
               {t(
                  'Taarifa zako za matibabu na maswali ya faragha hayaonekani kwa kikundi.',
                  'Your clinical details and private questions are not visible to the group.',
               )}
            </Notice>
            <Chip
               label={t(
                  'Nimeelewa wigo wa faragha na kanuni',
                  'I understand visibility and group rules',
               )}
               selected={agree}
               onPress={() => setAgree(!agree)}
            />
            <Button
               disabled={!agree || offline}
               label={t('Kubali mwaliko wa mfano', 'Accept sample invitation')}
               onPress={() => {
                  consent('group', true);
                  update({ membership: 'active' });
                  go('/pamoja');
               }}
            />
            <Button
               secondary
               label={t('Kataa / baadaye', 'Decline / later')}
               onPress={() => {
                  update({ membership: 'declined' });
                  go('/pamoja');
               }}
            />
         </Screen>
      </Access>
   );
}
export function Session() {
   const colors = useThemeColors();
   const { state, update, t, offline } = useApp();
   return (
      <GroupAccess>
         <Screen back title={t('Kikao chetu', 'Our session')}>
            <Card tone={colors.mint}>
               <Txt kind='small'>{t('KIKAO CHA MFANO', 'SAMPLE SESSION')}</Txt>
               <Txt kind='heading'>
                  {t('Tujifunze pamoja', 'Learning together')}
               </Txt>
               <Txt>
                  {t('Mwezeshaji: Timu ya mfano', 'Facilitator: Example team')}
               </Txt>
               <Txt>
                  {t(
                     'Tarehe, saa na mahali vitathibitishwa. Hakuna kiungo cha mkutano wa mtandaoni.',
                     'Date, time and place require confirmation. No online meeting link is configured.',
                  )}
               </Txt>
            </Card>
            <Txt>
               {t(
                  'Ajenda ya mfano: maswali ya huduma, maandalizi ya ziara, na kujifunza pamoja.',
                  'Sample agenda: care questions, visit preparation, and learning together.',
               )}
            </Txt>
            <Notice>
               {t(
                  'Mahudhurio huwekwa na wafanyakazi walioidhinishwa. RSVP hapa ni ya mfano tu.',
                  'Attendance is set by authorized staff. RSVP here is only a demo.',
               )}
            </Notice>
            <Button
               disabled={state.membership !== 'active' || offline}
               label={
                  state.rsvp
                     ? t('Ghairi ushiriki wa mfano', 'Cancel demo RSVP')
                     : t('Nitakuja · mfano', 'I’ll attend · demo')
               }
               onPress={() => update({ rsvp: !state.rsvp })}
            />
            <Button
               secondary
               label={t('Muulize mwezeshaji', 'Ask facilitator')}
               onPress={() => go('/groups/ask')}
            />
            <Button
               secondary
               label={t('Nyenzo baada ya kikao', 'Follow-up resources')}
               onPress={() => go('/groups/follow-up')}
            />
         </Screen>
      </GroupAccess>
   );
}
export function Discussion() {
   const colors = useThemeColors();
   const { state, update, t, offline } = useApp();
   const [body, setBody] = useState('');
   const [error, setError] = useState('');
   return (
      <GroupAccess>
         <Screen back title={t('Mazungumzo ya kikundi', 'Group discussion')}>
            <Notice>
               {t(
                  'Machapisho ya mfano ni ya kikundi hiki tu. Hakuna ujumbe wa moja kwa moja kati ya wanachama.',
                  'Sample posts are limited to this group. Member direct messages are not available.',
               )}
            </Notice>
            <Card tone={colors.lavender}>
               <Txt kind='small'>
                  {t(
                     'IMEBANDIKWA · MWEZESHAJI WA MFANO',
                     'PINNED · SAMPLE FACILITATOR',
                  )}
               </Txt>
               <Txt>
                  {t(
                     'Karibu. Tushiriki kwa heshima na tulinde faragha ya kila mmoja.',
                     'Welcome. Let us speak kindly and protect each other’s privacy.',
                  )}
               </Txt>
            </Card>
            {state.posts.map((p) => (
               <Card key={p.id}>
                  <Txt kind='small'>
                     {p.author}
                     {p.reported ? t(' · imeripotiwa', ' · reported') : ''}
                  </Txt>
                  <Txt>{p.body}</Txt>
                  <Button
                     secondary
                     label={t('Ripoti chapisho', 'Report post')}
                     onPress={() =>
                        update({
                           posts: state.posts.map((q) =>
                              q.id === p.id ? { ...q, reported: true } : q,
                           ),
                        })
                     }
                  />
               </Card>
            ))}
            <Field
               label={t('Andika ujumbe wa mfano', 'Write a demo post')}
               value={body}
               onChangeText={setBody}
               multiline
               maxLength={500}
            />
            {error && <Notice danger>{error}</Notice>}
            <Button
               disabled={
                  !body.trim() || state.membership !== 'active' || offline
               }
               label={t('Chapisha kwa kikundi cha mfano', 'Post to demo group')}
               onPress={() => {
                  if (!body.trim()) return;
                  update({
                     posts: [
                        ...state.posts,
                        {
                           id: `p${Date.now()}`,
                           body: body.trim(),
                           reported: false,
                           author: state.name || t('Mimi', 'Me'),
                        },
                     ],
                  });
                  setBody('');
                  setError('');
               }}
            />
            <Chip
               label={
                  state.muted
                     ? t('Arifa zimenyamazishwa', 'Notifications muted')
                     : t('Nyamazisha arifa', 'Mute notifications')
               }
               selected={state.muted}
               onPress={() => update({ muted: !state.muted })}
            />
         </Screen>
      </GroupAccess>
   );
}
export function Ask() {
   const colors = useThemeColors();
   const { state, update, t, offline } = useApp();
   const [body, setBody] = useState('');
   const [privateQuestion, setPrivate] = useState(true);
   return (
      <GroupAccess>
         <Screen back title={t('Muulize mwezeshaji', 'Ask the facilitator')}>
            <Notice>
               {t(
                  'Maswali ya mfano hayatumwi kwa wafanyakazi. Kwa tatizo la haraka, tafuta msaada wa moja kwa moja.',
                  'Demo questions are not sent to staff. For urgent concerns, seek direct help.',
               )}
            </Notice>
            <Row>
               <Chip
                  label={t('Swali la faragha', 'Private question')}
                  selected={privateQuestion}
                  onPress={() => setPrivate(true)}
               />
               <Chip
                  label={t('Ficha jina kwa wenzangu', 'Hide name from peers')}
                  selected={!privateQuestion}
                  onPress={() => setPrivate(false)}
               />
            </Row>
            <Card tone={colors.butter}>
               <Txt>
                  {privateQuestion
                     ? t(
                          'Wafanyakazi walioidhinishwa pekee wanaweza kuona swali.',
                          'Only authorized staff can see the question.',
                       )
                     : t(
                          'Wenzako hawataona jina lako; wasimamizi walioidhinishwa wanaweza kulitambua.',
                          'Peers will not see your name; authorized moderators can identify you.',
                       )}
               </Txt>
            </Card>
            <Field
               label={t('Swali lako', 'Your question')}
               value={body}
               onChangeText={setBody}
               multiline
               maxLength={1000}
            />
            <Button
               disabled={
                  !body.trim() || state.membership !== 'active' || offline
               }
               label={t('Tuma swali la mfano', 'Send demo question')}
               onPress={() => {
                  update({
                     questions: [
                        ...state.questions,
                        { body: body.trim(), private: privateQuestion },
                     ],
                  });
                  setBody('');
               }}
            />
            {state.questions.map((q, i) => (
               <Card key={i}>
                  <Txt>{q.body}</Txt>
                  <Txt kind='small'>
                     {t('Linasubiri · mfano', 'Pending · demo')}
                  </Txt>
               </Card>
            ))}
            <Button
               secondary
               label={t('Msaada wa haraka', 'Urgent help')}
               onPress={() => go('/urgent-help')}
            />
         </Screen>
      </GroupAccess>
   );
}
export function FollowUp() {
   const colors = useThemeColors();
   const { t } = useApp();
   return (
      <GroupAccess>
         <Screen back title={t('Baada ya kikao', 'After the session')}>
            <Card tone={colors.mint}>
               <Txt kind='heading'>
                  {t('Endelea kwa hatua yako.', 'Continue at your pace.')}
               </Txt>
               <Txt>
                  {t(
                     'Muhtasari wa kikao unahitaji mapitio ya mwezeshaji. Hakuna mazungumzo yaliyorekodiwa au kufupishwa kiotomatiki.',
                     'A session recap requires facilitator review. No conversation was recorded or summarized automatically.',
                  )}
               </Txt>
            </Card>
            <Button
               label={t('Soma nyenzo za mfano', 'Read sample resources')}
               onPress={() => go('/learning/together')}
            />
            <Button
               secondary
               label={t('Omba msaada kwa faragha', 'Ask for private help')}
               onPress={() => go('/assistant/handoff')}
            />
         </Screen>
      </GroupAccess>
   );
}
