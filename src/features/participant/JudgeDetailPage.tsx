import { useParams, Link } from 'react-router-dom'
import { Star, ArrowLeft, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { MOCK_JUDGES } from '@/mocks/data'

export default function JudgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const judge = MOCK_JUDGES.find((j) => j.id === id)
  if (!judge) return <div className="page-container"><p className="text-text-muted">Судья не найден</p></div>
  return (
    <div className="page-container max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6"><Link to="/judges"><ArrowLeft className="h-4 w-4" />Назад</Link></Button>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/20 font-display text-xl font-bold text-accent-400">{getInitials(judge.full_name)}</div>
            <div><h1 className="font-display text-xl font-bold text-text-primary">{judge.full_name}</h1><div className="flex items-center gap-1 mt-1"><Star className="h-4 w-4 fill-accent-500 text-accent-500" /><span className="font-semibold text-text-primary">{judge.rating}</span><span className="text-text-muted text-sm">— средний рейтинг</span></div></div>
          </div>
          {judge.bio && <p className="text-sm text-text-secondary leading-relaxed mb-5">{judge.bio}</p>}
          <Button asChild className="w-full"><Link to={`/feedback/new?judge=${judge.id}`}><MessageSquare className="h-4 w-4" />Заказать обратную связь</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}
