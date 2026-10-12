import { useEffect, useState, type ComponentProps } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useThemeColors } from '@/theme/use-theme-colors';
import { radii } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { useApp } from '@/providers/AppProvider';
import { hugeTabIcons } from './huge-tab-icons';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
function TabItem({name,label,focused,showLabel,width,onPress,onLongPress}:{
  name:string;label:string;focused:boolean;showLabel:boolean;width:number;onPress:()=>void;onLongPress:()=>void;
}) {
  const colors=useThemeColors();
  const scale=useSharedValue(focused?1.08:1);
  const isAssistant=name==='assistant';
  useEffect(()=>{scale.value=withSpring(focused?1.08:1,{damping:18,stiffness:250,reduceMotion:ReduceMotion.System});},[focused,scale]);
  const animated=useAnimatedStyle(()=>({transform:[{scale:scale.value}]}));
  const tint=focused?colors.primary:colors.onSurfaceVariant;
  return <Pressable
    accessibilityRole="tab"
    accessibilityLabel={label}
    accessibilityState={{selected:focused}}
    onPress={onPress}
    onLongPress={onLongPress}
    hitSlop={4}
    style={[styles.item,{width}]}>
    <Animated.View style={[styles.itemContent,animated]}>
      <View style={[styles.iconFrame,isAssistant&&styles.assistantFrame,isAssistant&&{backgroundColor:colors.primary}]}>
        <HugeiconsIcon icon={hugeTabIcons[name]??hugeTabIcons.home} size={28} color={isAssistant?colors.onPrimary:tint} strokeWidth={focused?2:1.7}/>
      </View>
      {showLabel&&<Text numberOfLines={1} style={[styles.label,{color:tint}]}>{label}</Text>}
    </Animated.View>
  </Pressable>;
}

export function FloatingTabBar({state,descriptors,navigation,insets}:TabBarProps) {
  const colors=useThemeColors();
  const {entry}=useApp();
  const showLabel=entry.showTabLabels;
  const {width:screenWidth,fontScale}=useWindowDimensions();
  const [keyboardVisible,setKeyboardVisible]=useState(false);
  const barWidth=Math.min(screenWidth-28,430);
  const itemWidth=(barWidth-16)/state.routes.length;
  const barHeight=(showLabel?76:64)+Math.max(0,fontScale-1)*18;
  const selected=useSharedValue(state.index);
  const visibility=useSharedValue(1);
  const entrance=useSharedValue(0);

  useEffect(()=>{entrance.value=withTiming(1,{duration:360,reduceMotion:ReduceMotion.System});},[entrance]);
  useEffect(()=>{selected.value=withSpring(state.index,{damping:22,stiffness:250,reduceMotion:ReduceMotion.System});},[state.index,selected]);
  useEffect(()=>{
    const show=Keyboard.addListener(Platform.OS==='ios'?'keyboardWillShow':'keyboardDidShow',()=>setKeyboardVisible(true));
    const hide=Keyboard.addListener(Platform.OS==='ios'?'keyboardWillHide':'keyboardDidHide',()=>setKeyboardVisible(false));
    return()=>{show.remove();hide.remove();};
  },[]);
  useEffect(()=>{visibility.value=withTiming(keyboardVisible?0:1,{duration:180,reduceMotion:ReduceMotion.System});},[keyboardVisible,visibility]);
  const indicatorStyle=useAnimatedStyle(()=>({transform:[{translateX:selected.value*itemWidth}]}),[itemWidth]);
  const visibilityStyle=useAnimatedStyle(()=>({opacity:visibility.value*entrance.value,transform:[{translateY:(1-entrance.value)*20+(1-visibility.value)*32}]}));

  return <Animated.View pointerEvents={keyboardVisible?'none':'box-none'} style={[styles.host,{bottom:insets.bottom+(Platform.OS==='ios'?10:14)},visibilityStyle]}>
    <View style={[styles.pill,{width:barWidth,height:barHeight,backgroundColor:Platform.OS==='ios'?colors.surfaceContainerLowest:colors.surfaceContainerLow,shadowColor:colors.shadow}]}>
      <Animated.View pointerEvents="none" style={[styles.indicator,{width:itemWidth,backgroundColor:colors.primaryContainer},indicatorStyle]}/>
      {state.routes.map((route,index)=>{
        const focused=state.index===index;
        const options=descriptors[route.key].options;
        const label=typeof options.tabBarLabel==='string'?options.tabBarLabel:typeof options.title==='string'?options.title:route.name;
        const onPress=()=>{
          const event=navigation.emit({type:'tabPress',target:route.key,canPreventDefault:true});
          if(!focused&&!event.defaultPrevented)navigation.navigate(route.name,route.params);
        };
        const onLongPress=()=>navigation.emit({type:'tabLongPress',target:route.key});
        return <TabItem key={route.key} name={route.name} label={label} focused={focused} showLabel={showLabel} width={itemWidth} onPress={onPress} onLongPress={onLongPress}/>;
      })}
    </View>
  </Animated.View>;
}

const styles=StyleSheet.create({
  host:{position:'absolute',left:0,right:0,alignItems:'center',zIndex:20},
  pill:{height:76,borderRadius:radii.pill,paddingHorizontal:8,flexDirection:'row',alignItems:'center',
    shadowOffset:{width:0,height:8},shadowOpacity:Platform.OS==='ios'?0.16:0.08,shadowRadius:22,
    elevation:Platform.OS==='android'?12:0},
  indicator:{position:'absolute',left:8,top:8,bottom:8,borderRadius:radii.pill},
  item:{height:'100%',alignItems:'center',justifyContent:'center'},
  itemContent:{alignItems:'center',justifyContent:'center',gap:2},
  iconFrame:{width:36,height:36,alignItems:'center',justifyContent:'center'},
  assistantFrame:{width:42,height:42,borderRadius:radii.md,overflow:'hidden'},
  label:{fontFamily:fonts.bold,fontSize:10,lineHeight:13,textAlign:'center',includeFontPadding:false},
});
