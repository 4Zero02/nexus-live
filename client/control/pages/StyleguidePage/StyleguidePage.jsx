import { useState } from 'react'
import Button from '@shared/ui/Button/Button'
import Input from '@shared/ui/Input/Input'
import Badge from '@shared/ui/Badge/Badge'
import Card from '@shared/ui/Card/Card'
import { useToast } from '@shared/ui/Toast/useToast'
import styles from './StyleguidePage.module.css'

const Section = ({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.sectionContent}>{children}</div>
  </section>
)

const StyleguidePage = () => {
  const { toast } = useToast()
  const [inputVal, setInputVal] = useState('')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Styleguide</h1>
      <p className={styles.subtitle}>Componentes de UI do design system Nexus Elite</p>

      <Section title="Botões — Variantes">
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Section>

      <Section title="Botões — Tamanhos">
        <div className={styles.row}>
          <Button size="sm">Small (40px)</Button>
          <Button size="md">Medium (52px)</Button>
          <Button size="lg">Large (64px)</Button>
        </div>
      </Section>

      <Section title="Botões — Estados">
        <div className={styles.row}>
          <Button disabled>Desabilitado</Button>
          <Button loading>Carregando</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </Section>

      <Section title="Toast">
        <div className={styles.row}>
          <Button onClick={() => toast.success('Ação realizada com sucesso!')}>Toast Success</Button>
          <Button variant="danger" onClick={() => toast.error('Algo deu errado.')}>Toast Error</Button>
          <Button variant="ghost" onClick={() => toast.info('Informação importante.')}>Toast Info</Button>
        </div>
      </Section>

      <Section title="Inputs">
        <div className={styles.col}>
          <Input
            id="sg-name"
            label="Nome"
            placeholder="Ex: João Silva"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <Input
            id="sg-error"
            label="Campo com erro"
            placeholder="Texto inválido"
            error="Este campo é obrigatório"
          />
          <Input
            id="sg-textarea"
            label="Textarea"
            variant="textarea"
            placeholder="Múltiplas linhas..."
          />
        </div>
      </Section>

      <Section title="Badges">
        <div className={styles.row}>
          <Badge variant="online">Online</Badge>
          <Badge variant="offline">Offline</Badge>
          <Badge variant="live">Ao Vivo</Badge>
        </div>
      </Section>

      <Section title="Cards">
        <div className={styles.row}>
          <Card>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>Card padrão</p>
          </Card>
          <Card interactive>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>Card interativo (hover)</p>
          </Card>
        </div>
      </Section>
    </div>
  )
}

export default StyleguidePage
