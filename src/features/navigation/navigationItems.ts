import { Activity, BarChart3, LayoutDashboard, Users } from 'lucide-react'
import type { NavigationItem } from '../../types/navigation'

export const navigationItems: NavigationItem[] = [
  { label: 'Панель управления', icon: LayoutDashboard },
  { label: 'Аналитика', icon: BarChart3 },
  { label: 'Центр автоматизации', icon: Activity },
  { label: 'Сотрудники', icon: Users },
]
