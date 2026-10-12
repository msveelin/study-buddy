import { Component, ElementRef, effect, inject, input } from '@angular/core';
import {
  createElement, IconNode,
  AlignCenter, AlignLeft, AlignRight, ArrowLeft, ArrowRight, BatteryCharging, Bell, Bold, BookMarked, BookOpen, Bus,
  Check, ChevronRight, Circle, CircleCheck, CircleDot, CircleHelp, ClipboardPaste, Cloud, CloudSun, Code, Command, Compass,
  Copy, Download, Dumbbell, Ellipsis, File, FileImage, FileSpreadsheet, FileText, Film, Folder, FolderOpen, Globe,
  GraduationCap, Hand, Heart, Home, Image, Inbox, Italic, Keyboard, Layers, LayoutGrid, LayoutTemplate, LifeBuoy,
  Lightbulb, List, ListChecks, ListOrdered, LoaderCircle, Lock, Mail, Maximize, Menu, Minus, Monitor, Moon, MousePointerClick,
  Mouse, MoveHorizontal, Music, PaintBucket, Palette, Paperclip, PartyPopper, Pencil, Play, Plus, Pointer, Power, Printer,
  Redo2, RefreshCw, Rocket, RotateCcw, Save, Scissors, Search, Send, Settings, Sparkles, Square, Star, Sun, Table, Target,
  Trash2, TriangleAlert, Triangle, Trophy, Underline, Undo2, Utensils, Video, Volume2, Wifi, X, Zap, Calculator, Package,
  Timer, Clock, Shield, ShieldCheck, Users, UserRound, Smile, Eye, Flag, Route, Library, Blocks, Wrench, Sprout, FilePen,
} from 'lucide';

/** Every icon the app can draw, by kebab-case name. Add here when a new one is needed. */
export const ICONS: Record<string, IconNode> = {
  'align-center': AlignCenter, 'align-left': AlignLeft, 'align-right': AlignRight, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight,
  'battery-charging': BatteryCharging, bell: Bell, bold: Bold, 'book-marked': BookMarked, 'book-open': BookOpen, bus: Bus,
  check: Check, 'chevron-right': ChevronRight, circle: Circle, 'circle-check': CircleCheck, 'circle-dot': CircleDot,
  'circle-help': CircleHelp, 'clipboard-paste': ClipboardPaste, cloud: Cloud, 'cloud-sun': CloudSun, code: Code, command: Command,
  compass: Compass, copy: Copy, download: Download, dumbbell: Dumbbell, ellipsis: Ellipsis, file: File, 'file-image': FileImage,
  'file-spreadsheet': FileSpreadsheet, 'file-text': FileText, film: Film, folder: Folder, 'folder-open': FolderOpen, globe: Globe,
  'graduation-cap': GraduationCap, hand: Hand, heart: Heart, home: Home, image: Image, inbox: Inbox, italic: Italic,
  keyboard: Keyboard, layers: Layers, 'layout-grid': LayoutGrid, 'layout-template': LayoutTemplate, 'life-buoy': LifeBuoy,
  lightbulb: Lightbulb, list: List, 'list-checks': ListChecks, 'list-ordered': ListOrdered, 'loader-circle': LoaderCircle, lock: Lock,
  mail: Mail, maximize: Maximize, menu: Menu, minus: Minus, monitor: Monitor, moon: Moon, 'mouse-pointer-click': MousePointerClick,
  mouse: Mouse, 'move-horizontal': MoveHorizontal, music: Music, 'paint-bucket': PaintBucket, palette: Palette, paperclip: Paperclip,
  'party-popper': PartyPopper, pencil: Pencil, play: Play, plus: Plus, pointer: Pointer, power: Power, printer: Printer,
  'redo-2': Redo2, 'refresh-cw': RefreshCw, rocket: Rocket, 'rotate-ccw': RotateCcw, save: Save, scissors: Scissors, search: Search,
  send: Send, settings: Settings, sparkles: Sparkles, square: Square, star: Star, sun: Sun, table: Table, target: Target,
  'trash-2': Trash2, 'triangle-alert': TriangleAlert, triangle: Triangle, trophy: Trophy, underline: Underline, 'undo-2': Undo2,
  utensils: Utensils, video: Video, 'volume-2': Volume2, wifi: Wifi, x: X, zap: Zap, calculator: Calculator, package: Package,
  timer: Timer, clock: Clock, shield: Shield, 'shield-check': ShieldCheck, users: Users, 'user-round': UserRound, smile: Smile,
  eye: Eye, flag: Flag, route: Route, library: Library, blocks: Blocks, wrench: Wrench, sprout: Sprout, 'file-pen': FilePen,
};

export const hasIcon = (name: string) => name in ICONS;

/** Icon for a course, by slug (the database stores a legacy emoji we no longer show). */
export const COURSE_ICON: Record<string, string> = {
  computer: 'monitor', mouse: 'mouse', typing: 'keyboard', files: 'folder-open', internet: 'globe', settings: 'settings',
  word: 'file-text', excel: 'table', programming: 'code', webdev: 'layout-template',
};
export const courseIcon = (slugOrCourse: string | { slug: string }) => {
  const slug = typeof slugOrCourse === 'string' ? slugOrCourse : slugOrCourse.slug;
  return COURSE_ICON[slug] ?? 'book-open';
};

/**
 * Inline SVG icon from the Lucide set. Usage: <app-icon name="home" [size]="18" />
 * Sized in px, coloured by the surrounding text colour (currentColor), optionally filled.
 */
@Component({
  selector: 'app-icon',
  template: '',
  host: { class: 'app-icon', '[style.width.px]': 'size()', '[style.height.px]': 'size()', '[attr.aria-hidden]': 'true' },
  styles: `
    :host { display: inline-flex; align-items: center; justify-content: center; flex: none; vertical-align: -0.2em; line-height: 0; }
    :host ::ng-deep svg { width: 100%; height: 100%; display: block; }
  `,
})
export class Icon {
  name = input.required<string>();
  size = input(20);
  stroke = input(2);
  fill = input(false);

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement;
    effect(() => {
      const node = ICONS[this.name()] ?? ICONS['circle-help'];
      const svg = createElement(node, {
        width: this.size(), height: this.size(), 'stroke-width': this.stroke(),
        fill: this.fill() ? 'currentColor' : 'none',
      });
      host.replaceChildren(svg);
    });
  }
}
