import { Activity, BarChart3, LayoutDashboard, Users } from 'lucide-react'
import type { NavigationItem } from '../../types/navigation'

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Automation Center', icon: Activity },
  { label: 'Employees', icon: Users },
]
