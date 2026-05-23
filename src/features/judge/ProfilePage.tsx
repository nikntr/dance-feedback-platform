import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'
import { MOCK_JUDGES } from '@/mocks/data'
import { Star } from 'lucide-react'

export default function JudgeProfilePage() {
  const user = useAuthStore((s) => s.user)
  const judge = MOCK_JUDGES.find((j) => j.id === user?.id)
  return (
    <div className="page-container max-w-2xl">
      <h1 className="page-title mb-8">Мой профиль</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/20 font-display text-xl font-bold text-accent-400">{getInitials(user?.full_name ?? '')}</div>
            <div>
              <p className="font-display text-xl font-bold text-text-primary">{user?.full_name}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </div>
          {judge && (
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 fill-accent-500 text-accent-500" />
              <span className="text-2xl font-display font-bold text-text-primary">{judge.rating}</span>
              <span className="text-text-muted text-sm">— средний рейтинг</span>
            </div>
          )}
          {judge?.bio && <p className="text-sm text-text-secondary leading-relaxed">{judge.bio}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
