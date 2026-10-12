import { describe, expect, test } from 'bun:test';
import { appColors, brand, cardPalette, iosColors, material } from '../src/theme/tokens';
function luminance(hex:string){const [r,g,b]=hex.slice(1).match(/../g)!.map(part=>parseInt(part,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;}
function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
describe('centralized platform theme',()=>{
 test('matches the supplied swatches and keeps deep purple primary',()=>{expect(brand).toEqual({orange:'#FF9100',sunset:'#FFC880',amethyst:'#9D4EDD',twilight:'#5A189A',deep:'#3C096C'});expect(material.light.primary).toBe(brand.twilight);});
 test('Material 3 text and control role pairs meet normal-text contrast in both schemes',()=>{for(const scheme of ['light','dark'] as const){const c=material[scheme];for(const [background,foreground] of [['primary','onPrimary'],['primaryContainer','onPrimaryContainer'],['secondary','onSecondary'],['tertiary','onTertiary'],['tertiaryContainer','onTertiaryContainer'],['error','onError'],['background','onBackground'],['surface','onSurface'],['surfaceVariant','onSurfaceVariant']] as const){expect(contrast(c[background],c[foreground])).toBeGreaterThanOrEqual(4.5);}}});
 test('app cards and iOS aliases track the chosen scheme',()=>{for(const scheme of ['light','dark'] as const){const c=appColors(scheme),ios=iosColors(scheme);expect(ios.tint).toBe(material[scheme].primary);expect(ios.systemBackground).toBe(c.bg);for(const tone of cardPalette(scheme))expect(contrast(tone,c.onSurface)).toBeGreaterThanOrEqual(4.5);}});
});
