import React from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';
import { Icon, Txt, go } from '@/components/ui/kit';
import { useAppTheme, useIosTheme, useThemeColors } from '@/theme/use-theme-colors';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Icon>['name'];

export function ActionGroup({title,children}:{title?:string;children:React.ReactNode}) {
  const colors=useThemeColors();
  const ios=useIosTheme();
  const theme=useAppTheme();
  const rows=React.Children.toArray(children);
  return <View style={styles.groupWrap}>
    {title&&<Txt kind="small" color={colors.muted}>{title}</Txt>}
    <View style={[styles.group,{borderRadius:theme.components.card.borderRadius,backgroundColor:Platform.OS==='ios'?ios.secondaryGroupedBackground:theme.backgrounds.muted}]}>
      {rows.map((row,index)=><React.Fragment key={index}>
        {index>0&&<View style={[styles.separator,{backgroundColor:Platform.OS==='ios'?ios.separator:colors.outlineVariant}]}/>}
        {row}
      </React.Fragment>)}
    </View>
  </View>;
}

export function ActionRow({label,detail,icon,href,onPress,value,onToggle,selected,destructive,external}:{
  label:string;detail?:string;icon?:IconName;href?:string;onPress?:()=>void;
  value?:boolean;onToggle?:(next:boolean)=>void;selected?:boolean;destructive?:boolean;external?:boolean;
}) {
  const colors=useThemeColors();
  const theme=useAppTheme();
  const activate=()=>{if(onToggle)onToggle(!value);else {onPress?.();if(href)go(href);}};
  const actionColor=destructive?colors.error:colors.primary;
  return <Pressable
    accessibilityRole={onToggle?'switch':'button'}
    accessibilityLabel={label}
    accessibilityHint={detail}
    accessibilityState={onToggle?{checked:!!value}:selected!==undefined?{selected}:undefined}
    onPress={activate}
    style={({pressed})=>[styles.row,{opacity:pressed?.65:1}]}>
    {icon&&<View style={[styles.icon,{borderRadius:theme.radii.sm,backgroundColor:destructive?colors.errorContainer:colors.primaryContainer}]}><Icon name={icon} size={20} color={actionColor}/></View>}
    <View style={styles.label}><Txt kind="label" color={destructive?colors.error:colors.onSurface}>{label}</Txt>{detail&&<Txt kind="small" color={colors.onSurfaceVariant}>{detail}</Txt>}</View>
    {onToggle?<Switch accessible={false} pointerEvents="none" value={!!value} trackColor={{false:colors.outlineVariant,true:colors.primary}} thumbColor={colors.surface} ios_backgroundColor={colors.outlineVariant}/>:
      href?<Icon name="chevron-forward" size={20} color={colors.onSurfaceVariant}/>:
      external?<Icon name="open-outline" size={20} color={colors.onSurfaceVariant}/>:
      selected?<Icon name="checkmark" size={22} color={colors.primary}/>:null}
  </Pressable>;
}

const styles=StyleSheet.create({
  groupWrap:{gap:8},
  group:{overflow:'hidden'},
  row:{minHeight:58,paddingHorizontal:16,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12},
  icon:{width:34,height:34,alignItems:'center',justifyContent:'center'},
  label:{flex:1,gap:2},
  separator:{height:StyleSheet.hairlineWidth,marginLeft:62},
});
