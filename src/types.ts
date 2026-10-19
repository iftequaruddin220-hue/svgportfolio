export interface WorkItem {
  img: string;
  full?: string;
  title: string;
  tags: string;
}

export interface WorkCategory {
  name: string;
  items: WorkItem[];
}

export interface VideoReelItem {
  src: string;
  caption: string;
}

export interface RigItem {
  type: 'image' | 'video';
  src: string;
  full?: string;
  title: string;
  tags?: string;
}

export interface ModelConfig {
  name: string;
  url: string;
  thumb: string;
}

export type RenderMode = 'shaded' | 'base' | 'wire' | 'matcap' | 'normals' | 'uv';

export interface LightboxMedia {
  type: 'image' | 'video';
  src: string;
  title?: string;
}
