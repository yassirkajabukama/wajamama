import {
   BottomSheetBackdrop,
   BottomSheetBackdropProps,
   BottomSheetModal,
   BottomSheetProps,
   type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';

/** Horizontal padding applied to all bottom sheet content containers. */
export const SHEET_CONTENT_PADDING = 16;

import { radii } from '@/theme/tokens';
import { useThemeColors } from '@/theme/use-theme-colors';

type BottomSheetWrapperProps = Partial<BottomSheetProps> & {
   children: ReactNode;
   snapPoints?: string[];
   /** Use `push` when opening this sheet on top of another bottom sheet. */
   stackBehavior?: BottomSheetModalProps['stackBehavior'];
};

export const BottomSheetWrapper = forwardRef<
   BottomSheetModal,
   BottomSheetWrapperProps
>(
   (
      {
         children,
         snapPoints,
         stackBehavior,
         enableDynamicSizing,
         maxDynamicContentSize,
         ...props
      },
      ref,
   ) => {
      const theme = useThemeColors();
      const { height } = useWindowDimensions();
      const useFixedSnapPoints = Boolean(snapPoints?.length);

      const renderBackdrop = useCallback(
         (backdropProps: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
               {...backdropProps}
               disappearsOnIndex={-1}
               appearsOnIndex={0}
               opacity={0.5}
            />
         ),
         [],
      );

      return (
         <BottomSheetModal
            ref={ref}
            stackBehavior={stackBehavior}
            snapPoints={useFixedSnapPoints ? snapPoints : undefined}
            enableDynamicSizing={
               useFixedSnapPoints ? false : (enableDynamicSizing ?? true)
            }
            maxDynamicContentSize={
               useFixedSnapPoints
                  ? undefined
                  : (maxDynamicContentSize ?? height * 0.9)
            }
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            activeOffsetY={[-1, 1]}
            activeOffsetX={[-10, 10]}
            backgroundStyle={{
               backgroundColor: theme.surface,
               borderTopLeftRadius: radii['2xl'],
               borderTopRightRadius: radii['2xl'],
               overflow: 'hidden',
            }}
            handleIndicatorStyle={{ backgroundColor: theme.outline }}
            {...props}
         >
            {children}
         </BottomSheetModal>
      );
   },
);

BottomSheetWrapper.displayName = 'BottomSheetWrapper';
