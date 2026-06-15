import { Link } from 'react-router-dom'
import { Star, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState, InlineError } from '@/shared/ErrorBoundary'
import { CardSkeleton } from '@/shared/LoadingSpinner'
import { getInitials } from '@/lib/utils'
import { useJudges } from '@/api/endpoints/judges'

export default function JudgesListPage() {
  const { data, isLoading, isError } = useJudges()
  const judges = data?.data ?? []

  return (
    <div className="page-container">
      <div className="mb-8"><h1 className="page-title">Каталог судей</h1><p className="page-subtitle">Выберите судью для получения обратной связи</p></div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <InlineError message="Не удалось загрузить каталог судей" />
      ) : judges.length === 0 ? (
        <EmptyState icon={<Star className="h-5 w-5" />} title="Судьи пока не добавлены" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {judges.map((judge) => (
            <Card key={judge.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-500/20 font-display text-base font-bold text-accent-400">{getInitials(judge.full_name)}</div>
                  <div><p className="font-semibold font-display text-text-primary">{judge.full_name}</p><div className="flex items-center gap-1 mt-0.5"><Star className="h-3 w-3 fill-accent-500 text-accent-500" /><span className="text-xs text-text-secondary">{judge.rating}</span></div></div>
                </div>
                {judge.bio && <p className="text-xs text-text-muted line-clamp-3 mb-4">{judge.bio}</p>}
                <Button variant="secondary" size="sm" className="w-full" asChild>
                  <Link to={`/judges/${judge.id}`}><MessageSquare className="h-4 w-4" />Профиль</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
