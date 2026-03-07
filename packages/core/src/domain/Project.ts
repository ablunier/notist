export interface Project {
  id: string;
  name: string;
  color?: string;
  parentId?: string;
  isShared: boolean;
  isFavorite: boolean;
}
