import { AppointmentCard } from '@/components/patterns/AppointmentCard';
import {
   Access,
   Button,
   Card,
   Chip,
   DataBoundary,
   go,
   Row,
   Screen,
   Txt,
} from '@/components/ui/kit';
import { useApp } from '@/providers/AppProvider';
import { useState } from 'react';

export default function AppointmentsScreen() {
   const { state, t } = useApp();
   const [past, setPast] = useState(false);
   const appointments = state.appointments.filter(
      (a) =>
         a.status !== 'held' &&
         a.status !== 'expired' &&
         (past
            ? !['confirmed', 'checked_in', 'in_progress'].includes(a.status)
            : ['confirmed', 'checked_in', 'in_progress'].includes(a.status)),
   );
   return (
      <Access>
         <Screen
            tab
            title={t('Miadi yangu', 'Your time for care')}
            subtitle={t(
               'Panga. Jiandae. Tuko pamoja.',
               'Plan ahead. Feel prepared.',
            )}
         >
            <Button
               icon='add-outline'
               label={t('Weka miadi', 'Book a visit')}
               onPress={() => go('/booking')}
            />
            <Row>
               <Chip
                  label={t('Inayokuja', 'Upcoming')}
                  selected={!past}
                  onPress={() => setPast(false)}
               />
               <Chip
                  label={t('Iliyopita', 'Past & cancelled')}
                  selected={past}
                  onPress={() => setPast(true)}
               />
            </Row>
            <DataBoundary>
               {appointments.length ? (
                  appointments.map((a) => (
                     <AppointmentCard key={a.id} appointment={a} />
                  ))
               ) : (
                  <Card>
                     <Txt kind='heading'>
                        {t(
                           'Nafasi kwa hatua inayofuata',
                           'Room for your next step',
                        )}
                     </Txt>
                     <Txt>
                        {t(
                           'Hakuna miadi katika orodha hii.',
                           'There are no appointments in this list.',
                        )}
                     </Txt>
                  </Card>
               )}
               {state.rsvp && !past && (
                  <Card>
                     <Txt kind='heading'>
                        {t('Kikao cha Pamoja · mfano', 'Pamoja session · demo')}
                     </Txt>
                     <Txt>
                        {t(
                           'Usajili wa kikundi, si miadi binafsi.',
                           'Group registration, separate from individual visits.',
                        )}
                     </Txt>
                     <Button
                        secondary
                        label={t('Angalia kikao', 'View session')}
                        onPress={() => go('/groups/session')}
                     />
                  </Card>
               )}
            </DataBoundary>
         </Screen>
      </Access>
   );
}
