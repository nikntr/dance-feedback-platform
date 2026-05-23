import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface LegalDoc {
  title: string
  content: string[]
}

export const PRIVACY_POLICY: LegalDoc = {
  title: 'Согласие на обработку персональных данных',
  content: [
    'Регистрируясь на платформе DanceFeed, пользователь даёт согласие оператору на обработку своих персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».',
    'Обрабатываются следующие данные: фамилия, имя, адрес электронной почты, номер телефона, а также данные, добровольно загруженные пользователем (видеозаписи выступлений, комментарии, оценки).',
    'Цели обработки: регистрация и идентификация пользователя, предоставление услуг платформы, обеспечение взаимодействия между участниками, судьями и организаторами, проведение платежей.',
    'Обработка персональных данных осуществляется с использованием средств автоматизации. Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством, и платёжного оператора для проведения расчётов.',
    'Пользователь вправе отозвать согласие, направив запрос в службу поддержки. Видеозаписи хранятся не более 1 месяца с момента активации, после чего автоматически удаляются.',
  ],
}

export const TERMS_OF_USE: LegalDoc = {
  title: 'Пользовательское соглашение',
  content: [
    'Настоящее Пользовательское соглашение регулирует отношения между платформой DanceFeed (далее — Сервис) и пользователем при использовании функций Сервиса.',
    'Сервис предоставляет участникам возможность заказывать обратную связь у судей по результатам выступлений, судьям — предоставлять экспертную оценку, организаторам — проводить соревнования.',
    'Оплата услуг обратной связи производится по принципу безопасной сделки (hold/capture): средства резервируются при создании запроса и переводятся судье только после подтверждения участником полученной обратной связи.',
    'Пользователь обязуется загружать только материалы, права на которые ему принадлежат, и не размещать контент, нарушающий законодательство или права третьих лиц.',
    'Сервис не несёт ответственности за субъективную оценку судей. Возврат средств производится в случае, если судья не предоставил обратную связь в установленный срок.',
    'Продолжая использование Сервиса, пользователь подтверждает согласие с условиями настоящего соглашения.',
  ],
}

interface LegalDialogProps {
  trigger: React.ReactNode
  title: string
  content: string[]
}

export function LegalDialog({ trigger, title, content }: LegalDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={
            'fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 ' +
            'flex-col rounded-lg border border-border bg-bg-surface shadow-modal focus:outline-none ' +
            'data-[state=open]:animate-slide-up'
          }
        >
          <div className="flex items-start justify-between gap-4 border-b border-border-subtle p-5">
            <Dialog.Title className="font-display text-base font-semibold text-text-primary">
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Закрыть"
              className="shrink-0 rounded p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto p-5 text-sm leading-relaxed text-text-secondary">
            {content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
