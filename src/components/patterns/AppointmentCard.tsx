import { Card, Icon, Row, Txt, go } from '@/components/ui/kit';
import { dateLabel } from '@/i18n';
import { services } from '@/mocks/catalog';
import { useApp } from '@/providers/AppProvider';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { Appointment, AppointmentStatus } from '@/types/domain';
import { View } from 'react-native';

const labels: Record<AppointmentStatus, readonly [string, string]> = {
   held: ['Imeshikiliwa kwa muda', 'Temporarily held'],
   confirmed: ['Imethibitishwa · mfano', 'Confirmed · demo'],
   cancelled: ['Imeghairiwa', 'Cancelled'],
   expired: ['Muda umeisha', 'Expired'],
   completed: ['Imekamilika', 'Completed'],
   checked_in: ['Umefika', 'Checked in'],
   in_progress: ['Inaendelea', 'In progress'],
   no_show: ['Hakufika', 'Not attended'],
};
export function StatusLabel({ status }: { status: AppointmentStatus }) {
   const { t } = useApp();
   return <Txt kind='small'>{t(...labels[status])}</Txt>;
}
export function AppointmentCard({ appointment }: { appointment: Appointment }) {
   const colors = useThemeColors();
   const { t, language } = useApp();
   const service = services.find((s) => s.id === appointment.serviceId);
   return (
      <Card
         tone={colors.mint}
         onPress={() => go(`/appointments/${appointment.id}`)}
      >
         <Row>
            <Icon name='calendar-outline' />
            <View style={{ flex: 1 }}>
               <Txt kind='label'>{dateLabel(appointment.start, language)}</Txt>
            </View>
            <Icon name='chevron-forward' size={20} />
         </Row>
         <Txt kind='heading'>
            {service ? t(...service.title) : t('Miadi', 'Appointment')}
         </Txt>
         <View>
            <Txt>{appointment.patient}</Txt>
            <Txt kind='small'>
               {t('Kliniki ya mfano · Zanzibar', 'Example clinic · Zanzibar')}
            </Txt>
         </View>
         <StatusLabel status={appointment.status} />
      </Card>
   );
}
